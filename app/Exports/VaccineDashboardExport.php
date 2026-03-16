<?php

namespace App\Exports;

use App\Models\Vaccine;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithDrawings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;

use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use Maatwebsite\Excel\Events\AfterSheet;

use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\PageSetup;

class VaccineDashboardExport implements FromCollection, WithHeadings, WithDrawings, WithEvents, WithCustomStartCell
{

    protected $vaccines;
    protected $year;
    protected $barangay;
    protected $species;

    public function __construct($year, $barangay, $species)
    {
        $this->year = $year;
        $this->barangay = $barangay;
        $this->species = $species;
    }

    /*
    |--------------------------------------------------------------------------
    | DATA
    |--------------------------------------------------------------------------
    */

    public function collection()
    {

        $query = Vaccine::with(['pet.owner'])
            ->whereYear('date_administered', $this->year);

        if ($this->species) {
            $query->whereHas('pet', fn($q) => $q->where('species', $this->species));
        }

        if ($this->barangay) {
            $query->whereHas('pet.owner', fn($q) => $q->where('barangay', $this->barangay));
        }

        $this->vaccines = $query->get();

        return $this->vaccines->map(function ($v) {

            // Skip if vaccine record has no important data
            if (!$v->pet || !$v->pet->owner) {
                return null;
            }

            // return [
            //     '',
            //     $v->pet->owner->first_name . ' ' . $v->pet->owner->last_name,
            //     $v->pet->owner->contact_number,
            //     $v->pet->owner->barangay,
            //     '',
            //     $v->pet->pet_name,
            //     $v->pet->species,
            //     $v->vaccine_name ?? $v->vaccine_choice,
            //     $v->date_administered
            // ];
            return [
                '',
                ucwords(strtolower($v->pet->owner->first_name . ' ' . $v->pet->owner->last_name)),
                $v->pet->owner->contact_number,
                ucwords(strtolower($v->pet->owner->barangay)),
                '',
                ucwords(strtolower($v->pet->pet_name)),
                ucfirst(strtolower($v->pet->species)),
                ucwords(strtolower($v->vaccine_name ?? $v->vaccine_choice)),
                $v->date_administered
            ];

        })->filter(); // removes null rows

    }

    /*
    |--------------------------------------------------------------------------
    | TABLE START POSITION
    |--------------------------------------------------------------------------
    */

    public function startCell(): string
    {
        return 'B8'; // ADJUST if you want the table more left/right
    }

    /*
    |--------------------------------------------------------------------------
    | TABLE HEADERS
    |--------------------------------------------------------------------------
    */

    public function headings(): array
    {
        return [
            'Owner Photo',
            'Owner Name',
            'Contact',
            'Barangay',
            'Pet Photo',
            'Pet Name',
            'Species',
            'Vaccine',
            'Date Administered'
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | LOGO + IMAGES
    |--------------------------------------------------------------------------
    */

    public function drawings()
    {

        $drawings = [];

        /*
        |--------------------------------------------------------------------------
        | HEADER LOGO
        |--------------------------------------------------------------------------
        */

        $logo = new Drawing();
        $logo->setPath(public_path('logo.jpeg'));

        $logo->setHeight(90); // ADJUST LOGO SIZE

        $logo->setCoordinates('D1'); // ADJUST COLUMN if you want logo left/right

        $logo->setOffsetX(32); // ADJUST horizontal position
        $logo->setOffsetY(3);  // ADJUST vertical position

        $drawings[] = $logo;

        /*
        |--------------------------------------------------------------------------
        | OWNER + PET PHOTOS
        |--------------------------------------------------------------------------
        */

        foreach ($this->vaccines as $index => $v) {

            $row = $index + 9;

            /*
            OWNER PHOTO
            */

            if ($v->pet->owner->photo_path) {

                $owner = new Drawing();
                $owner->setPath(storage_path('app/public/' . $v->pet->owner->photo_path));

                $owner->setWidth(45);  // ADJUST OWNER PHOTO SIZE
                $owner->setHeight(45);

                $owner->setCoordinates('B' . $row);

                $owner->setOffsetX(35); // center horizontally
                $owner->setOffsetY(2);  // center vertically

                $drawings[] = $owner;
            }

            /*
            PET PHOTO
            */

            if ($v->pet->photo_path) {

                $pet = new Drawing();
                $pet->setPath(storage_path('app/public/' . $v->pet->photo_path));

                $pet->setWidth(45); // ADJUST PET PHOTO SIZE
                $pet->setHeight(45);

                $pet->setCoordinates('F' . $row);

                $pet->setOffsetX(35); // center horizontally
                $pet->setOffsetY(2);  // center vertically

                $drawings[] = $pet;
            }

        }

        return $drawings;

    }

    /*
    |--------------------------------------------------------------------------
    | STYLING
    |--------------------------------------------------------------------------
    */

    public function registerEvents(): array
    {

        return [

            AfterSheet::class => function (AfterSheet $event) {

                $sheet = $event->sheet->getDelegate();

                /*
                PRINT SETTINGS
                */

                $sheet->getPageSetup()->setOrientation(PageSetup::ORIENTATION_LANDSCAPE);
                $sheet->getPageSetup()->setFitToWidth(1);
                $sheet->getPageSetup()->setHorizontalCentered(true);

                /*
                COLUMN WIDTH
                */

                $sheet->getColumnDimension('B')->setWidth(15);
                $sheet->getColumnDimension('C')->setWidth(25);
                $sheet->getColumnDimension('D')->setWidth(18);
                $sheet->getColumnDimension('E')->setWidth(18);
                $sheet->getColumnDimension('F')->setWidth(15);
                $sheet->getColumnDimension('G')->setWidth(18);
                $sheet->getColumnDimension('H')->setWidth(12);
                $sheet->getColumnDimension('I')->setWidth(18);
                $sheet->getColumnDimension('J')->setWidth(18);

                /*
                HEADER TEXT
                */

                $sheet->mergeCells('C1:I1');
                $sheet->mergeCells('C2:I2');
                $sheet->mergeCells('C3:I3');
                $sheet->mergeCells('C4:I4');

                $sheet->setCellValue('C1', 'REPUBLIC OF THE PHILIPPINES');
                $sheet->setCellValue('C2', 'Municipal Agriculture Office');
                $sheet->setCellValue('C3', 'Local Government Unit of Santa Barbara');
                $sheet->setCellValue('C4', 'PET VACCINATION MASTER LIST');

                $sheet->getStyle('C1:I4')->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'size' => 12
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER
                    ]
                ]);

                /*
                FILTER TEXT
                */

                $sheet->mergeCells('B6:J6');

                $sheet->setCellValue(
                    'B6',
                    'Year: ' . $this->year .
                    ' | Barangay: ' . ($this->barangay ?: 'All Barangays') .
                    ' | Species: ' . ($this->species ?: 'All Species')
                );

                $sheet->getStyle('B6:J6')->getAlignment()
                    ->setHorizontal(Alignment::HORIZONTAL_CENTER);

                /*
                GREEN HEADER
                */

                $sheet->getStyle('B8:J8')->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'color' => ['rgb' => 'FFFFFF']
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER
                    ],
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'color' => ['rgb' => '2E7D32']
                    ]
                ]);

                /*
                ROW HEIGHT
                */

                $lastRow = 8 + $this->vaccines->count();
                if ($this->vaccines->count() > 0) {
                    for ($i = 9; $i <= $lastRow; $i++) {
                        $sheet->getRowDimension($i)->setRowHeight(38);
                    }
                }

                /*
                BORDERS
                */

                $sheet->getStyle('B8:J' . $lastRow)->applyFromArray([
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN
                        ]
                    ]
                ]);

                /*
                CENTER TEXT
                */

                $sheet->getStyle('B8:J' . $lastRow)
                    ->getAlignment()
                    ->setHorizontal(Alignment::HORIZONTAL_CENTER)
                    ->setVertical(Alignment::VERTICAL_CENTER);

            }

        ];
    }
}

