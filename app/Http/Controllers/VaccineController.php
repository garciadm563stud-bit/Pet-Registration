<?php
namespace App\Http\Controllers;

use App\Models\Pet;
use App\Models\Vaccine;
use Illuminate\Http\Request;

class VaccineController extends Controller
{
    private array $commonVaccines = [
        'Anti-Rabies',
        '5-in-1 (DHPP)',
        '6-in-1 (DHPPiL)',
        'Parvo',
        'Distemper',
        'Bordetella (Kennel Cough)',
        'Leptospirosis',
        'Feline 3-in-1 (FVRCP)',
        'Feline Leukemia (FeLV)',
        'Deworming',
        'Tick/Flea Prevention',



    ];

    // private function validChoice(string $choice): bool
    // {
    //     return in_array($choice, $this->commonVaccines, true);
    // }
    private function validChoice(?string $choice): bool
    {
        return !empty(trim($choice));
    }
    // private function finalName(string $choice, ?string $custom): array
    // {
    //     if ($choice === 'Other') {
    //         $custom = trim((string) $custom);
    //         return [
    //             'vaccine_name' => $custom,
    //             'custom_vaccine_name' => $custom,
    //         ];
    //     }

    //     return [
    //         'vaccine_name' => $choice,
    //         'custom_vaccine_name' => null,
    //     ];
    // }

    private function finalName(string $choice, ?string $custom): array
    {
        $name = trim($custom ?: $choice);

        return [
            'vaccine_name' => $name,
            'custom_vaccine_name' => $custom ?: null,
        ];
    }
    public function store(Request $request, Pet $pet)
    {
        $data = $request->validate([
            'date_administered' => ['required', 'date'],
            'vaccine_choice' => ['required', 'string', 'max:255'],
            'custom_vaccine_name' => ['nullable', 'string', 'max:255'],
            'lot_batch_no' => ['nullable', 'string', 'max:255'],
            'vaccine_brand' => ['nullable', 'string', 'max:255'],
            'next_schedule' => ['nullable', 'date'],
            'administering_personnel' => ['required', 'string', 'max:255'],
        ]);

        if (!$this->validChoice($data['vaccine_choice'])) {
            return back()->withErrors(['vaccine_choice' => 'Invalid vaccine choice.']);
        }

        if ($data['vaccine_choice'] === 'Other' && empty(trim($data['custom_vaccine_name'] ?? ''))) {
            return back()->withErrors(['custom_vaccine_name' => 'Please enter the custom vaccine name.']);
        }

        $final = $this->finalName($data['vaccine_choice'], $data['custom_vaccine_name'] ?? null);

        $pet->vaccines()->create([
            'date_administered' => $data['date_administered'],
            'vaccine_choice' => $data['vaccine_choice'],
            'custom_vaccine_name' => $final['custom_vaccine_name'],
            'vaccine_name' => $final['vaccine_name'],
            'lot_batch_no' => $data['lot_batch_no'] ?? null,
            'next_schedule' => $data['next_schedule'] ?? null,
            'administering_personnel' => $data['administering_personnel'] ?? null,
            'vaccine_brand' => $data['vaccine_brand'] ?? null,
        ]);

        return back()->with('success', 'Vaccine added successfully!');
    }

    public function update(Request $request, Vaccine $vaccine)
    {
        $data = $request->validate([
            'date_administered' => ['required', 'date'],
            'vaccine_choice' => ['required', 'string', 'max:255'],
            'custom_vaccine_name' => ['nullable', 'string', 'max:255'],
            'lot_batch_no' => ['nullable', 'string', 'max:255'],
            'next_schedule' => ['nullable', 'date'],
            'administering_personnel' => ['required', 'string', 'max:255'],
            'vaccine_brand' => ['nullable', 'string', 'max:255'],
        ]);

        if (!$this->validChoice($data['vaccine_choice'])) {
            return back()->withErrors(['vaccine_choice' => 'Invalid vaccine choice.']);
        }

        if ($data['vaccine_choice'] === 'Other' && empty(trim($data['custom_vaccine_name'] ?? ''))) {
            return back()->withErrors(['custom_vaccine_name' => 'Please enter the custom vaccine name.']);
        }

        $final = $this->finalName($data['vaccine_choice'], $data['custom_vaccine_name'] ?? null);

        $vaccine->update([
            'date_administered' => $data['date_administered'],
            'vaccine_choice' => $data['vaccine_choice'],
            'custom_vaccine_name' => $final['custom_vaccine_name'],
            'vaccine_name' => $final['vaccine_name'],
            'lot_batch_no' => $data['lot_batch_no'] ?? null,
            'next_schedule' => $data['next_schedule'] ?? null,
            'administering_personnel' => $data['administering_personnel'] ?? null,
            'vaccine_brand' => $data['vaccine_brand'] ?? null,
        ]);

        return back()->with('success', 'Vaccine updated successfully!');
    }

    public function destroy(Vaccine $vaccine)
    {
        $vaccine->delete();
        return back()->with('success', 'Vaccine deleted successfully!');
    }
}
