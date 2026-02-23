<?php

namespace App\Http\Controllers;

use App\Models\Owner;
use App\Models\Pet;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
class PetController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->string('search')->toString();
        $species = $request->string('species')->toString(); // Dog/Cat
        $sort = $request->string('sort')->toString() ?: 'newest';

        $petsQuery = Pet::query()
            ->with(['owner:id,owner_uid,first_name,last_name'])
            ->when($search, function ($q) use ($search) {
                $q->where(function ($qq) use ($search) {
                    $qq->where('pet_name', 'like', "%{$search}%")
                        ->orWhere('pet_uid', 'like', "%{$search}%")
                        ->orWhere('breed', 'like', "%{$search}%");
                });
            })
            ->when($species, fn($q) => $q->where('species', $species))
            ->orderBy('created_at', $sort === 'oldest' ? 'asc' : 'desc');

        $pets = $petsQuery->paginate(6)->withQueryString();


        // ✅ GUARANTEED: convert each row to plain array so dates can't serialize to ISO
        $pets->setCollection(
            $pets->getCollection()->map(function ($p) {
                $birth = $p->birth_date ? Carbon::parse($p->birth_date) : null;

                return [
                    'id' => $p->id,

                    'pet_uid' => $p->pet_uid,
                    'registration_no' => $p->registration_no,
                    'pet_name' => $p->pet_name,
                    'or_number' => $p->or_number,
                    'species' => $p->species,
                    'breed' => $p->breed,
                    'gender' => $p->gender,
                    'color' => $p->color,
                    'markings' => $p->markings,
                    'confinement_status' => $p->confinement_status,
                    'photo_path' => $p->photo_path,

                    // ✅ force YYYY-MM-DD strings
                    'date_registered' => $p->date_registered ? Carbon::parse($p->date_registered)->format('Y-m-d') : null,
                    'birth_date' => $birth ? $birth->format('Y-m-d') : null,

                    // ✅ integer months, never negative/decimal
                    'age_months' => ($birth && !$birth->isFuture()) ? (int) $birth->diffInMonths(now()) : null,

                    // owner (optional display)
                    'owner' => $p->owner ? [
                        'id' => $p->owner->id,
                        'owner_uid' => $p->owner->owner_uid,
                        'first_name' => $p->owner->first_name,
                        'last_name' => $p->owner->last_name,
                    ] : null,
                ];
            })
        );

        // Owners for searchable dropdown
        $owners = Owner::query()
            ->select('id', 'owner_uid', 'first_name', 'last_name')
            ->orderBy('last_name')
            ->get()
            ->map(fn($o) => [
                'id' => $o->id,
                'label' => "{$o->owner_uid} - {$o->last_name}, {$o->first_name}",
            ]);

        $summary = [
            'totalPets' => Pet::count(),
            'totalDogs' => Pet::where('species', 'Dog')->count(),
            'totalCats' => Pet::where('species', 'Cat')->count(),
        ];

        return Inertia::render('PetsDashboard', [
            'pets' => $pets,
            'filters' => [
                'search' => $search,
                'species' => $species,
                'sort' => $sort,
            ],
            'summary' => $summary,
            'options' => [
                'owners' => $owners,
            ],
            'flash' => session()->get('flash'),
        ]);
    }


    public function store(Request $request)
    {
        $data = $request->validate([
            'owner_id' => ['required', 'exists:owners,id'],

            // ✅ NOW REQUIRED
            'photo' => ['required', 'image', 'max:4096'],

            'pet_name' => ['required', 'string', 'max:255'],

            'or_number' => ['required', 'string', 'max:255'],

            'species' => ['required', 'in:Dog,Cat'],

            'breed' => ['required', 'string', 'max:255'],

            'birth_date' => ['nullable', 'date', 'before_or_equal:today'],

            'gender' => ['required', 'in:Male,Female'],

            'color' => ['required', 'string', 'max:255'],

            'markings' => ['nullable', 'string', 'max:255'],

            'confinement_status' => ['nullable', 'in:Bound,Sometimes,Free'],
        ]);


        // $pet = DB::transaction(function () use ($data) {
        //     $year = now()->year;

        //     // ✅ Prefix depends on species
        //     $prefix = $data['species'] === 'Dog' ? 'DOG' : 'CAT';

        //     // ✅ Next pet_uid per species + year
        //     $lastPetUid = Pet::where('pet_uid', 'like', "{$prefix}-{$year}-%")
        //         ->lockForUpdate()
        //         ->max('pet_uid');

        //     $nextPetSeq = 1;
        //     if ($lastPetUid) {
        //         $last = (int) substr($lastPetUid, -5);
        //         $nextPetSeq = $last + 1;
        //     }

        //     $pet_uid = sprintf("%s-%d-%05d", $prefix, $year, $nextPetSeq);

        //     // ✅ Next registration_no global per year
        //     $lastReg = Pet::where('registration_no', 'like', "{$year}-%")
        //         ->lockForUpdate()
        //         ->max('registration_no');

        //     $nextRegSeq = 1;
        //     if ($lastReg) {
        //         $last = (int) substr($lastReg, -5);
        //         $nextRegSeq = $last + 1;
        //     }

        //     $registration_no = sprintf("%d-%05d", $year, $nextRegSeq);

        //     // ✅ photo
        //     $photo_path = null;
        //     if (request()->hasFile('photo')) {
        //         $photo_path = request()->file('photo')->store('pets', 'public');
        //     }

        //     return Pet::create([
        //         'owner_id' => $data['owner_id'],
        //         'pet_uid' => $pet_uid,
        //         'registration_no' => $registration_no,

        //         'pet_name' => $data['pet_name'],
        //         'or_number' => $data['or_number'] ?? null,
        //         'date_registered' => now()->toDateString(),

        //         'species' => $data['species'],
        //         'breed' => $data['breed'] ?? null,

        //         'birth_date' => $data['birth_date'] ?? null,
        //         'gender' => $data['gender'] ?? null,

        //         'color' => $data['color'] ?? null,
        //         'markings' => $data['markings'] ?? null,

        //         'confinement_status' => $data['confinement_status'] ?? null,
        //         'photo_path' => $photo_path,
        //     ]);
        // });
        $pet = DB::transaction(function () use ($data) {
            $year = now()->year;

            $prefix = $data['species'] === 'Dog' ? 'DOG' : 'CAT';

            // ✅ GAP-FILL pet_uid (per species + year)
            $nextPetSeq = $this->nextMissingSeq("{$prefix}-{$year}-%", 'pet_uid', 5);
            $pet_uid = sprintf("%s-%d-%05d", $prefix, $year, $nextPetSeq);

            // ✅ GAP-FILL registration_no (global per year)
            $nextRegSeq = $this->nextMissingSeq("{$year}-%", 'registration_no', 5);
            $registration_no = sprintf("%d-%05d", $year, $nextRegSeq);

            // photo
            $photo_path = null;
            if (request()->hasFile('photo')) {
                $photo_path = request()->file('photo')->store('pets', 'public');
            }

            return Pet::create([
                'owner_id' => $data['owner_id'],
                'pet_uid' => $pet_uid,
                'registration_no' => $registration_no,

                'pet_name' => $data['pet_name'],
                'or_number' => $data['or_number'],
                'date_registered' => now()->toDateString(),

                'species' => $data['species'],
                'breed' => $data['breed'],

                'birth_date' => $data['birth_date'],
                'gender' => $data['gender'],

                'color' => $data['color'],
                'markings' => $data['markings'] ?? null,

                'confinement_status' => $data['confinement_status'] ?? null,
                'photo_path' => $photo_path,
            ]);
        });

        return back()->with('success', "Pet added: {$pet->pet_uid}");
    }

    // ✅ PetController.php (ONLY the parts you need to change)

    public function update(Request $request, Pet $pet)
    {
        $data = $request->validate([
            'owner_id' => ['required', 'exists:owners,id'],

            // ✅ NEW: remove flag
            'remove_photo' => ['nullable', 'boolean'],

            // ✅ photo is required if:
            // - pet has no existing photo, OR
            // - user clicked "Remove Photo"
            'photo' => [
                ($pet->photo_path && !$request->boolean('remove_photo')) ? 'nullable' : 'required',
                'image',
                'max:4096'
            ],

            'pet_name' => ['required', 'string', 'max:255'],
            'or_number' => ['required', 'string', 'max:255'],
            'species' => ['required', 'in:Dog,Cat'],
            'breed' => ['required', 'string', 'max:255'],
            'birth_date' => ['nullable', 'date', 'before_or_equal:today'],
            'gender' => ['required', 'in:Male,Female'],
            'color' => ['required', 'string', 'max:255'],
            'markings' => ['nullable', 'string', 'max:255'],
            'confinement_status' => ['nullable', 'in:Bound,Sometimes,Free'],
        ]);

        $updated = DB::transaction(function () use ($request, $data, $pet) {

            // ✅ If species changed, regenerate pet_uid (keep your logic)
            if ($data['species'] !== $pet->species) {
                $year = now()->year;
                $prefix = $data['species'] === 'Dog' ? 'DOG' : 'CAT';

                $nextPetSeq = $this->nextMissingSeq("{$prefix}-{$year}-%", 'pet_uid', 5);
                $data['pet_uid'] = sprintf("%s-%d-%05d", $prefix, $year, $nextPetSeq);
            }

            // ✅ If user clicked remove photo
            if ($request->boolean('remove_photo')) {
                $data['photo_path'] = null;
            }

            // ✅ If user uploaded a new photo, replace / set it
            if ($request->hasFile('photo')) {
                $photo_path = $request->file('photo')->store('pets', 'public');
                $data['photo_path'] = $photo_path;
            }

            unset($data['photo']);         // not db column
            unset($data['remove_photo']);  // not db column

            $pet->update($data);

            return $pet;
        });

        return back()->with('success', "Pet updated: {$updated->pet_uid}");
    }

    public function destroy(Pet $pet)
    {
        $pet->delete();
        return back()->with('success', "Pet deleted.");
    }
    // public function previewId(Request $request)
    // {
    //     $data = $request->validate([
    //         'species' => ['required', 'in:Dog,Cat'],
    //     ]);

    //     $year = now()->year;
    //     $prefix = $data['species'] === 'Dog' ? 'DOG' : 'CAT';

    //     // ✅ Next pet_uid per species + year
    //     $lastPetUid = Pet::where('pet_uid', 'like', "{$prefix}-{$year}-%")
    //         ->max('pet_uid');

    //     $nextPetSeq = 1;
    //     if ($lastPetUid) {
    //         $last = (int) substr($lastPetUid, -5);
    //         $nextPetSeq = $last + 1;
    //     }

    //     $pet_uid = sprintf("%s-%d-%05d", $prefix, $year, $nextPetSeq);

    //     // ✅ Next registration_no (GLOBAL per year)
    //     $lastReg = Pet::where('registration_no', 'like', "{$year}-%")
    //         ->max('registration_no');

    //     $nextRegSeq = 1;
    //     if ($lastReg) {
    //         $last = (int) substr($lastReg, -5);
    //         $nextRegSeq = $last + 1;
    //     }

    //     $registration_no = sprintf("%d-%05d", $year, $nextRegSeq);

    //     return response()->json([
    //         'pet_uid' => $pet_uid,
    //         'registration_no' => $registration_no,
    //     ]);
    // }

    public function previewId(Request $request)
    {
        $data = $request->validate([
            'species' => ['required', 'in:Dog,Cat'],
        ]);

        $year = now()->year;
        $prefix = $data['species'] === 'Dog' ? 'DOG' : 'CAT';

        // ✅ GAP-FILL pet_uid preview
        $nextPetSeq = $this->nextMissingSeq("{$prefix}-{$year}-%", 'pet_uid', 5);
        $pet_uid = sprintf("%s-%d-%05d", $prefix, $year, $nextPetSeq);

        // ✅ GAP-FILL reg preview
        $nextRegSeq = $this->nextMissingSeq("{$year}-%", 'registration_no', 5);
        $registration_no = sprintf("%d-%05d", $year, $nextRegSeq);

        return response()->json([
            'pet_uid' => $pet_uid,
            'registration_no' => $registration_no,
        ]);
    }

    private function nextMissingSeq(string $prefixLike, string $column, int $pad = 5): int
    {
        // Get all suffix numbers (last 5 digits) for matching rows, sorted asc
        $nums = Pet::where($column, 'like', $prefixLike)
            ->orderBy($column)
            ->lockForUpdate()
            ->pluck($column)
            ->map(fn($v) => (int) substr($v, -$pad))
            ->values();

        $expected = 1;
        foreach ($nums as $n) {
            if ($n < $expected)
                continue;
            if ($n === $expected) {
                $expected++;
                continue;
            }
            // gap found
            break;
        }

        return $expected; // smallest missing
    }
    public function show(Pet $pet)
    {
        $pet->load('owner');

        $vaccines = $pet->vaccines()
            ->orderByDesc('date_administered')
            ->paginate(6) // ✅ 10 per page
            ->withQueryString();

        return Inertia::render('ShowPetDetails', [
            'pet' => $pet,          // includes age_label
            'owner' => $pet->owner,
            'vaccines' => $vaccines,
        ]);
    }


    // public function downloadCertificate($petId)
    // {
    //     $pet = Pet::with(['owner', 'vaccines'])->findOrFail($petId);

    //     $owner = $pet->owner;
    //     $vaccines = $pet->vaccines;

    //     $pdf = Pdf::loadView('pdf.pet-certificate', [
    //         'pet' => $pet,
    //         'owner' => $owner,
    //         'vaccines' => $vaccines
    //     ])->setPaper('A4');

    //     return $pdf->download('Pet_Registration_Certificate.pdf');
    // }


    public function downloadCertificate($petId)
    {
        $pet = Pet::with(['owner', 'vaccines'])->findOrFail($petId);

        // ✅ ADD THIS
        if ($pet->birth_date) {
            $pet->age_months = (int) \Carbon\Carbon::parse($pet->birth_date)->diffInMonths(now());
        } else {
            $pet->age_months = null;
        }

        $owner = $pet->owner;
        $vaccines = $pet->vaccines;

        $pdf = Pdf::loadView('pdf.pet-certificate', [
            'pet' => $pet,
            'owner' => $owner,
            'vaccines' => $vaccines
        ])->setPaper('A4');

        return $pdf->download('Pet_Registration_Certificate.pdf');
    }

}
