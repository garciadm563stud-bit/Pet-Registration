<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Vaccine;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Exports\VaccineDashboardExport;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\VaccineRankingExport;
class VaccineDashboardController extends Controller
{

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

        $currentYear = now()->year;

        if (!$request->has('year')) {
            return redirect()->route('vaccine.dashboard', [
                'year' => $currentYear
            ]);
        }

        $year = $request->input('year');
        $species = $request->input('species');
        $barangay = $request->input('barangay');
        $vaccine = $request->input('vaccine');


        $query = Vaccine::with(['pet.owner'])
            ->whereYear('date_administered', $year);


        if ($species) {
            $query->whereHas('pet', fn($q) => $q->where('species', $species));
        }

        if ($barangay) {
            $query->whereHas('pet.owner', fn($q) => $q->where('barangay', $barangay));
        }

        if ($vaccine) {
            $query->where(function ($q) use ($vaccine) {
                $q->where('vaccine_name', $vaccine)
                    ->orWhere('vaccine_choice', $vaccine);
            });
        }


        // FULL DATASET
        $allVaccines = $query->get();


        // TABLE PAGINATION
        $vaccines = $query
            ->latest()
            ->paginate(5)
            ->withQueryString();


        // TOTALS
        $totalPets = $allVaccines->count();

        $totalDogs = $allVaccines
            ->filter(fn($v) => $v->pet->species === 'Dog')
            ->count();

        $totalCats = $allVaccines
            ->filter(fn($v) => $v->pet->species === 'Cat')
            ->count();

        $totalOwners = $allVaccines
            ->pluck('pet.owner_id')
            ->unique()
            ->count();


        // BARANGAY RANKINGS
        $rankingCollection = $allVaccines
            ->groupBy(fn($v) => $v->pet->owner->barangay)
            ->map(function ($items, $barangay) {

                $dogs = $items->filter(fn($i) => $i->pet->species === 'Dog')->count();
                $cats = $items->filter(fn($i) => $i->pet->species === 'Cat')->count();

                return [
                    'barangay' => $barangay,
                    'dogs' => $dogs,
                    'cats' => $cats,
                    'total' => $items->count(),
                    'owners' => $items->pluck('pet.owner_id')->unique()->count()
                ];

            })
            ->sortByDesc('total')
            ->values();


        // PAGINATE RANKINGS
        $page = $request->input('rank_page', 1);
        $perPage = 5;

        $items = $rankingCollection->forPage($page, $perPage)->values();

        $rankings = (new LengthAwarePaginator(
            $items,
            $rankingCollection->count(),
            $perPage,
            $page,
            [
                'path' => request()->url(),
                'query' => request()->query()
            ]
        ))->setPageName('rank_page');


        // BARANGAY DROPDOWN
        $barangays = collect($this->barangayOptions)
            ->map(fn($b) => [
                'value' => $b,
                'label' => $b
            ]);


        // VACCINE DROPDOWN (FROM DATABASE)
        $vaccinesList = Vaccine::query()
            ->selectRaw("COALESCE(vaccine_name, vaccine_choice) as name")
            ->distinct()
            ->orderBy('name')
            ->pluck('name')
            ->map(fn($v) => [
                'value' => $v,
                'label' => $v
            ])
            ->values();


        return Inertia::render('VaccineDashboard', [

            'currentYear' => $currentYear,

            'totalPets' => $totalPets,
            'totalDogs' => $totalDogs,
            'totalCats' => $totalCats,
            'totalOwners' => $totalOwners,

            'rankings' => $rankings,

            'records' => $vaccines,

            'barangays' => $barangays,

            'vaccines' => $vaccinesList,

            'filters' => [
                'year' => $year,
                'species' => $species,
                'barangay' => $barangay,
                'vaccine' => $vaccine
            ]

        ]);

    }


    // public function export(Request $request)
    // {
    //     $year = $request->input('year');
    //     $barangay = $request->input('barangay');
    //     $species = $request->input('species');
    //     $vaccine = $request->input('vaccine');

    //     return Excel::download(
    //         new VaccineDashboardExport($year, $barangay, $species, $vaccine),
    //         "vaccination_records_{$year}.xlsx"
    //     );
    // // }
    // public function export(Request $request)
    // {

    //     $year = $request->input('year');
    //     $barangay = $request->input('barangay');
    //     $species = $request->input('species');
    //     $vaccine = $request->input('vaccine');

    //     return Excel::download(
    //         new VaccineRankingExport($year, $barangay, $species, $vaccine),
    //         "barangay_rankings_{$year}.xlsx"
    //     );

    // }
    public function exportRanking(Request $request)
    {
        $year = $request->year;
        $barangay = $request->barangay;
        $species = $request->species;
        $vaccine = $request->vaccine;

        return Excel::download(
            new VaccineRankingExport($year, $barangay, $species, $vaccine),
            "barangay_rankings_{$year}.xlsx"
        );
    }


    public function exportRecords(Request $request)
    {
        $year = $request->year;
        $barangay = $request->barangay;
        $species = $request->species;
        $vaccine = $request->vaccine;

        return Excel::download(
            new VaccineDashboardExport($year, $barangay, $species, $vaccine),
            "vaccination_records_{$year}.xlsx"
        );
    }
}