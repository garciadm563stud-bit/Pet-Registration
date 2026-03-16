<?php

namespace App\Exports;

use App\Models\Vaccine;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithDrawings;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use Maatwebsite\Excel\Events\AfterSheet;

use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\PageSetup;

class VaccineRankingExport implements FromCollection, WithEvents, WithDrawings, WithCustomStartCell
{

    protected $year;
    protected $barangay;
    protected $species;
    protected $vaccine;

    public function __construct($year, $barangay, $species, $vaccine)
    {
        $this->year = $year;
        $this->barangay = $barangay;
        $this->species = $species;
        $this->vaccine = $vaccine;
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

        if ($this->vaccine) {
            $query->where(function ($q) {
                $q->where('vaccine_name', $this->vaccine)
                    ->orWhere('vaccine_choice', $this->vaccine);
            });
        }

        $vaccines = $query->get();

        $ranking = $vaccines
            ->groupBy(fn($v) => $v->pet->owner->barangay)
            ->map(function ($items, $barangay) {

                $dogs = $items->filter(fn($i) => $i->pet->species === 'Dog')->count();
                $cats = $items->filter(fn($i) => $i->pet->species === 'Cat')->count();

                $owners = $items->pluck('pet.owner.id')->unique()->count();

                return [
                    'barangay' => $barangay,
                    'owners' => $owners,
                    'dogs' => $dogs,
                    'cats' => $cats,
                    'total' => $items->count()
                ];
            })
            ->sortByDesc('total')
            ->values();

        $rank = 1;

        return $ranking->map(function ($r) use (&$rank) {

            return [
                $rank++,
                $r['barangay'],
                $r['owners'],
                $r['dogs'],
                $r['cats'],
                $r['total']
            ];
        });
    }

    /*
    |--------------------------------------------------------------------------
    | TABLE START
    |--------------------------------------------------------------------------
    */

    public function startCell(): string
    {
        return 'A9';
    }

    /*
    |--------------------------------------------------------------------------
    | LOGO
    |--------------------------------------------------------------------------
    */
    public function drawings()
    {
        $logo = new Drawing();
        $logo->setPath(public_path('logo.jpeg'));

        // logo size
        $logo->setHeight(85);

        // base position
        $logo->setCoordinates('B1');

        // move RIGHT
        $logo->setOffsetX(70);

        // move DOWN
        $logo->setOffsetY(1);

        return [$logo];
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

                $sheet->getPageSetup()->setOrientation(PageSetup::ORIENTATION_PORTRAIT);
                $sheet->getPageSetup()->setFitToWidth(1);
                $sheet->getPageSetup()->setFitToHeight(1);
                $sheet->getPageSetup()->setHorizontalCentered(true);

                /*
                MARGINS
                */

                $sheet->getPageMargins()->setTop(0.5);
                $sheet->getPageMargins()->setBottom(0.5);
                $sheet->getPageMargins()->setLeft(0.4);
                $sheet->getPageMargins()->setRight(0.4);

                /*
                COLUMN WIDTH
                */

                $sheet->getColumnDimension('A')->setWidth(8);
                $sheet->getColumnDimension('B')->setWidth(28);
                $sheet->getColumnDimension('C')->setWidth(18);
                $sheet->getColumnDimension('D')->setWidth(18);
                $sheet->getColumnDimension('E')->setWidth(18);
                $sheet->getColumnDimension('F')->setWidth(18);

                /*
                HEADER BESIDE LOGO
                */

                /*
  HEADER CENTERED
  */

                $sheet->mergeCells('A1:F1');
                $sheet->mergeCells('A2:F2');
                $sheet->mergeCells('A3:F3');
                $sheet->mergeCells('A4:F4');

                $sheet->setCellValue('A1', 'REPUBLIC OF THE PHILIPPINES');
                $sheet->setCellValue('A2', 'Municipal Agriculture Office');
                $sheet->setCellValue('A3', 'Local Government Unit of Santa Barbara');
                $sheet->setCellValue('A4', 'PET VACCINATION BARANGAY RANKINGS REPORT');

                $sheet->getStyle('A1:F4')->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'size' => 12
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER
                    ]
                ]);

                /*
                FILTER TEXT
                */

                $sheet->mergeCells('A6:F6');

                $sheet->setCellValue(
                    'A6',
                    'Year: ' . $this->year .
                    ' | Barangay: ' . ($this->barangay ?: 'All Barangays') .
                    ' | Species: ' . ($this->species ?: 'All Species') .
                    ' | Vaccine: ' . ($this->vaccine ?: 'All Vaccines')
                );

                $sheet->getStyle('A6:F6')->getAlignment()
                    ->setHorizontal(Alignment::HORIZONTAL_CENTER);

                /*
                TABLE HEADER
                */

                $sheet->setCellValue('A8', 'Rank');
                $sheet->setCellValue('B8', 'Barangay');
                $sheet->setCellValue('C8', 'Total Owners');
                $sheet->setCellValue('D8', 'Dogs Vaccinated');
                $sheet->setCellValue('E8', 'Cats Vaccinated');
                $sheet->setCellValue('F8', 'Total Vaccinated');

                $sheet->getStyle('A8:F8')->applyFromArray([
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
                LAST ROW
                */

                $lastRow = $sheet->getHighestRow();

                /*
                REMOVE OLD BORDERS
                */

                $sheet->getStyle('A8:F' . $lastRow)->applyFromArray([
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_NONE
                        ]
                    ]
                ]);

                /*
                CLEAN CONSISTENT BORDERS
                */

                $sheet->getStyle('A8:F' . $lastRow)->applyFromArray([
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                            'color' => ['rgb' => '000000']
                        ]
                    ]
                ]);

                /*
                CENTER TABLE DATA
                */

                $sheet->getStyle('A8:F' . $lastRow)
                    ->getAlignment()
                    ->setHorizontal(Alignment::HORIZONTAL_CENTER);

                /*
                PRINT AREA
                */

                $sheet->getPageSetup()->setPrintArea('A1:F' . $lastRow);

            }

        ];
    }
}