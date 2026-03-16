<?php



use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OwnerController;
use App\Http\Controllers\PetController;

Route::get('/', function () {
    return redirect('/owners');
});

// ✅ OWNERS
Route::get('/owners', [OwnerController::class, 'index'])->name('owners.index');
Route::post('/owners', [OwnerController::class, 'store'])->name('owners.store');
Route::put('/owners/{owner}', [OwnerController::class, 'update'])->name('owners.update');
Route::delete('/owners/{owner}', [OwnerController::class, 'destroy'])->name('owners.destroy');

// ✅ PETS
Route::get('/pets', [PetController::class, 'index'])->name('pets.index');
Route::post('/pets', [PetController::class, 'store'])->name('pets.store');
Route::put('/pets/{pet}', [PetController::class, 'update'])->name('pets.update');
Route::delete('/pets/{pet}', [PetController::class, 'destroy'])->name('pets.destroy');
Route::get('/pets/preview-id', [PetController::class, 'previewId'])->name('pets.preview-id');

// use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\OwnerController;

// Route::get('/', function () {
//     return redirect('/owners');
// });

// // ✅ OWNERS (Inertia page is returned by OwnerController@index)
// Route::get('/owners', [OwnerController::class, 'index'])->name('owners.index');
// Route::post('/owners', [OwnerController::class, 'store'])->name('owners.store');
// Route::put('/owners/{owner}', [OwnerController::class, 'update'])->name('owners.update');
// Route::delete('/owners/{owner}', [OwnerController::class, 'destroy'])->name('owners.destroy');

// // ✅ PETS (leave this for now if you haven't made PetsController yet)
// Route::get('/pets', function () {
//     return Inertia\Inertia::render('PetsDashboard');
// })->name('pets.index');

// use Illuminate\Support\Facades\Route;
// use Inertia\Inertia;

// Route::get('/', function () {
//     return redirect('/owners');
// });

// Route::get('/owners', function () {
//     return Inertia::render('OwnersDashboard');
// });

// Route::get('/pets', function () {
//     return Inertia::render('PetsDashboard');
// });

// use App\Http\Controllers\OwnerController;

// Route::get('/owners', [OwnerController::class, 'index']);
// Route::post('/owners', [OwnerController::class, 'store']);
// Route::delete('/owners/{owner}', [OwnerController::class, 'destroy']);
// use App\Http\Controllers\PetController;

// Route::get('/pets', [PetController::class, 'index'])->name('pets.index');
// Route::post('/pets', [PetController::class, 'store'])->name('pets.store');
// Route::put('/pets/{pets}', [PetController::class, 'update'])->name('pets.update');
// Route::delete('/pets/{pets}', [PetController::class, 'destroy'])->name('pets.destroy');



Route::get('/owners', [OwnerController::class, 'index']);
Route::get('/owners/{owner}', [OwnerController::class, 'show'])->name('owners.show');



use App\Http\Controllers\VaccineController;

Route::get('/pets/{pet}', [PetController::class, 'show'])->name('pets.show');

Route::post('/pets/{pet}/vaccines', [VaccineController::class, 'store'])->name('pets.vaccines.store');
Route::put('/vaccines/{vaccine}', [VaccineController::class, 'update'])->name('vaccines.update');
Route::delete('/vaccines/{vaccine}', [VaccineController::class, 'destroy'])->name('vaccines.destroy');
Route::get('/pets/{pet}/certificate', [PetController::class, 'downloadCertificate'])
    ->name('pets.certificate');
Route::get('/owners/coupon/download', [OwnerController::class, 'downloadCoupon']);

Route::get('/pets/coupon/download', [PetController::class, 'downloadForm']);

use App\Http\Controllers\VaccineDashboardController;

Route::get('/vaccine-dashboard', [VaccineDashboardController::class, 'index'])
    ->name('vaccine.dashboard');
Route::get('/vaccine-dashboard-export', [VaccineDashboardController::class, 'export'])
    ->name('vaccine.dashboard.export');

Route::get('/vaccine-ranking-export', [VaccineDashboardController::class, 'exportRanking']);
Route::get('/vaccine-records-export', [VaccineDashboardController::class, 'exportRecords']);