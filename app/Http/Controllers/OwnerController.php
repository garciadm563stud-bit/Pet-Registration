<?php

// namespace App\Http\Controllers;

// use App\Models\Owner;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Storage;
// use Inertia\Inertia;

// class OwnerController extends Controller
// {
//     // ✅ You can edit these anytime
//     private array $sexOptions = ['Male', 'Female'];
//     private array $civilStatusOptions = ['Single', 'Married', 'Widowed', 'Separated'];

//     // ✅ Put your real barangay list here
//     private array $barangayOptions = ['Palamis', 'Poblacion', 'San Jose', 'San Vicente'];

//     public function index(Request $request)
//     {
//         $search = $request->string('search')->toString();
//         $barangay = $request->string('barangay')->toString();
//         $sort = $request->string('sort')->toString(); // newest | oldest

//         $ownersQuery = Owner::query()
//             ->withCount('pets')
//             ->when($search, function ($q) use ($search) {
//                 $q->where(function ($qq) use ($search) {
//                     $qq->where('first_name', 'like', "%{$search}%")
//                         ->orWhere('middle_name', 'like', "%{$search}%")
//                         ->orWhere('last_name', 'like', "%{$search}%")
//                         ->orWhere('owner_uid', 'like', "%{$search}%");
//                 });
//             })
//             ->when($barangay, fn($q) => $q->where('barangay', $barangay))
//             ->orderBy('created_at', $sort === 'oldest' ? 'asc' : 'desc');

//         $owners = $ownersQuery->paginate(10)->withQueryString();

//         // ✅ Summary (pets counts will be 0 until you create pets)
//         $totalOwners = Owner::count();
//         $totalPets = \App\Models\Pet::count();
//         $totalDogs = \App\Models\Pet::where('species', 'Dog')->count();
//         $totalCats = \App\Models\Pet::where('species', 'Cat')->count();

//         return Inertia::render('OwnersDashboard', [
//             'owners' => $owners,
//             'filters' => [
//                 'search' => $search,
//                 'barangay' => $barangay,
//                 'sort' => $sort ?: 'newest',
//             ],
//             'summary' => [
//                 'totalOwners' => $totalOwners,
//                 'totalPets' => $totalPets,
//                 'totalDogs' => $totalDogs,
//                 'totalCats' => $totalCats,
//             ],
//             'options' => [
//                 'sex' => $this->sexOptions,
//                 'civilStatus' => $this->civilStatusOptions,
//                 'barangay' => $this->barangayOptions,
//             ],
//         ]);
//     }

//     private function generateOwnerUid(): string
//     {
//         $year = now()->year;

//         // Find latest owner_uid for this year (OWNER-YYYY-xxxxx)
//         $last = Owner::where('owner_uid', 'like', "OWNER-{$year}-%")
//             ->orderBy('id', 'desc')
//             ->first();

//         $nextNumber = 1;

//         if ($last && $last->owner_uid) {
//             $lastNumber = (int) substr($last->owner_uid, -5);
//             $nextNumber = $lastNumber + 1;
//         }

//         return 'OWNER-' . $year . '-' . str_pad($nextNumber, 5, '0', STR_PAD_LEFT);
//     }

//     public function store(Request $request)
//     {
//         $validated = $request->validate([
//             'photo' => ['nullable', 'image', 'max:2048'],
//             'first_name' => ['required', 'string', 'max:100'],
//             'middle_name' => ['nullable', 'string', 'max:100'],
//             'last_name' => ['required', 'string', 'max:100'],
//             'address' => ['required', 'string', 'max:255'],
//             'barangay' => ['required', 'string', 'max:100'],
//             'civil_status' => ['required', 'string', 'max:50'],
//             'sex' => ['required', 'string', 'max:10'],
//             'contact_number' => ['nullable', 'string', 'max:30'],
//         ]);

//         $photoPath = null;
//         if ($request->hasFile('photo')) {
//             $photoPath = $request->file('photo')->store('owners', 'public');
//         }

//         Owner::create([
//             'owner_uid' => $this->generateOwnerUid(),
//             'photo_path' => $photoPath,
//             ...$validated,
//         ]);

//         return redirect()->back()->with('success', 'Owner added successfully.');
//     }

//     public function destroy(Owner $owner)
//     {
//         if ($owner->photo_path) {
//             Storage::disk('public')->delete($owner->photo_path);
//         }

//         $owner->delete();

//         return redirect()->back()->with('success', 'Owner deleted successfully.');
//     }
// }


namespace App\Http\Controllers;

use App\Models\Owner;
use App\Models\Pet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
class OwnerController extends Controller
{
    // ✅ You can edit these anytime
    private array $sexOptions = ['Male', 'Female'];
    private array $civilStatusOptions = ['Single', 'Married', 'Widowed', 'Separated'];

    // ✅ Put your real barangay list here
    private array $barangayOptions = [
        'Alibago',
        'Balingueo',
        'Banaoang',
        'Banzal',
        'Botao',
        'Cablong',
        'Carusocan',
        'Dalongue',
        'Erfe',
        'Gueguesangen',
        'Leet',
        'Malanay',
        'Maningding',
        'Maronong',
        'Maticmatic',
        'Minien East',
        'Minien West',
        'Nilombot',
        'Patayac',
        'Payas',
        'Poblacion Norte',
        'Poblacion Sur',
        'Primicias',
        'Sapang',
        'Sonquil',
        'Tebag East',
        'Tebag West',
        'Tuliao',
        'Ventinilla',
        'Villa ph. 112',
        'Camella'
    ];


    public function index(Request $request)
    {
        $search = $request->string('search')->toString();
        $barangay = $request->string('barangay')->toString();
        $sort = $request->string('sort')->toString(); // newest | oldest

        $ownersQuery = Owner::query()
            ->withCount('pets')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($qq) use ($search) {
                    $qq->where('first_name', 'like', "%{$search}%")
                        ->orWhere('middle_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('owner_uid', 'like', "%{$search}%");
                });
            })
            ->when($barangay, fn($q) => $q->where('barangay', $barangay))
            ->orderBy('created_at', $sort === 'oldest' ? 'asc' : 'desc');

        // ✅ 6 rows per page
        $owners = $ownersQuery->paginate(6)->withQueryString();

        // ✅ Summary (pets counts will be 0 until you create pets)
        $totalOwners = Owner::count();
        $totalPets = Pet::count();
        $totalDogs = Pet::where('species', 'Dog')->count();
        $totalCats = Pet::where('species', 'Cat')->count();

        return Inertia::render('OwnersDashboard', [
            'owners' => $owners,
            'filters' => [
                'search' => $search,
                'barangay' => $barangay,
                'sort' => $sort ?: 'newest',
            ],
            'summary' => [
                'totalOwners' => $totalOwners,
                'totalPets' => $totalPets,
                'totalDogs' => $totalDogs,
                'totalCats' => $totalCats,
            ],
            'options' => [
                'sex' => $this->sexOptions,
                'civilStatus' => $this->civilStatusOptions,
                'barangay' => $this->barangayOptions,
            ],
        ]);
    }

    private function generateOwnerUid(): string
    {
        $year = now()->year;

        // Find latest owner_uid for this year (OWNER-YYYY-xxxxx)
        $last = Owner::where('owner_uid', 'like', "OWNER-{$year}-%")
            ->orderBy('id', 'desc')
            ->first();

        $nextNumber = 1;

        if ($last && $last->owner_uid) {
            $lastNumber = (int) substr($last->owner_uid, -5);
            $nextNumber = $lastNumber + 1;
        }

        return 'OWNER-' . $year . '-' . str_pad($nextNumber, 5, '0', STR_PAD_LEFT);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            // ✅ REQUIRED + IMAGE ONLY
            'photo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],

            'first_name' => ['required', 'string', 'max:100'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'address' => ['required', 'string', 'max:255'],
            'barangay' => ['required', 'string', 'max:100'],
            'civil_status' => ['required', 'string', 'max:50'],
            'sex' => ['required', 'string', 'max:10'],
            'contact_number' => ['nullable', 'string', 'max:30'],
        ]);

        // since photo is required, this will always exist
        $photoPath = $request->file('photo')->store('owners', 'public');

        Owner::create([
            'owner_uid' => $this->generateOwnerUid(),
            'photo_path' => $photoPath,

            // ⛔ do not save "photo" column (not in DB)
            // so remove it from array before spreading
            ...collect($validated)->except('photo')->all(),
        ]);

        return redirect()->back()->with('success', 'Owner added successfully.');
    }
    // public function update(Request $request, Owner $owner)
    // {
    //     $validated = $request->validate([
    //         // ✅ optional on edit (keep old if no new upload)
    //         'photo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],

    //         'first_name' => ['required', 'string', 'max:100'],
    //         'middle_name' => ['nullable', 'string', 'max:100'],
    //         'last_name' => ['required', 'string', 'max:100'],
    //         'address' => ['required', 'string', 'max:255'],
    //         'barangay' => ['required', 'string', 'max:100'],
    //         'civil_status' => ['required', 'string', 'max:50'],
    //         'sex' => ['required', 'string', 'max:10'],
    //         'contact_number' => ['nullable', 'string', 'max:30'],
    //     ]);

    //     // ✅ if user uploaded a new photo, replace the old one
    //     if ($request->hasFile('photo')) {
    //         // delete old
    //         if ($owner->photo_path) {
    //             Storage::disk('public')->delete($owner->photo_path);
    //         }

    //         // store new
    //         $photoPath = $request->file('photo')->store('owners', 'public');
    //         $owner->photo_path = $photoPath;
    //     }

    //     // ✅ update fields (exclude 'photo' because not a DB column)
    //     $owner->update(collect($validated)->except('photo')->all());

    //     return redirect()->back()->with('success', 'Owner updated successfully.');
    // }


    public function update(Request $request, Owner $owner)
    {
        $validated = $request->validate([
            // ✅ NEW FLAG
            'remove_photo' => ['nullable', 'boolean'],

            // ✅ photo required only if:
            // - owner has no existing photo, OR
            // - user clicked "Remove Photo"
            'photo' => [
                ($owner->photo_path && !$request->boolean('remove_photo')) ? 'nullable' : 'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048'
            ],

            'first_name' => ['required', 'string', 'max:100'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'address' => ['required', 'string', 'max:255'],
            'barangay' => ['required', 'string', 'max:100'],
            'civil_status' => ['required', 'string', 'max:50'],
            'sex' => ['required', 'string', 'max:10'],
            'contact_number' => ['nullable', 'string', 'max:30'],
        ]);

        // ✅ If user removed photo, delete file + clear DB column
        if ($request->boolean('remove_photo')) {
            if ($owner->photo_path) {
                Storage::disk('public')->delete($owner->photo_path);
            }
            $owner->photo_path = null;
            $owner->save();
        }

        // ✅ If user uploaded new photo, replace old
        if ($request->hasFile('photo')) {
            if ($owner->photo_path) {
                Storage::disk('public')->delete($owner->photo_path);
            }

            $photoPath = $request->file('photo')->store('owners', 'public');
            $owner->photo_path = $photoPath;
            $owner->save();
        }

        // ✅ Update fields (exclude photo + remove_photo)
        $owner->update(collect($validated)->except(['photo', 'remove_photo'])->all());

        return redirect()->back()->with('success', 'Owner updated successfully.');
    }

    public function destroy(Owner $owner)
    {
        if ($owner->photo_path) {
            Storage::disk('public')->delete($owner->photo_path);
        }

        $owner->delete();

        return redirect()->back()->with('success', 'Owner deleted successfully.');
    }


    // public function show(Owner $owner)
    // {
    //     $owner->load(['pets' => fn($q) => $q->latest()]);

    //     return Inertia::render('ShowOwnerDetails', [
    //         'owner' => $owner,
    //     ]);
    // }

    public function show(Owner $owner)
    {
        $pets = $owner->pets()
            ->latest()
            ->paginate(6)
            ->withQueryString(); // keeps ?page=2 in URL

        return Inertia::render('ShowOwnerDetails', [
            'owner' => $owner, // owner info only
            'pets' => $pets,  // paginated pets
        ]);
    }
    public function downloadCoupon()
    {
        $pdf = Pdf::loadView('pdf.owner-coupon')
            ->setPaper('A4', 'portrait');

        return $pdf->download('owner-registration-form.pdf');
    }
}
