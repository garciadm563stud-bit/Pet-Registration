@php use Illuminate\Support\Str; @endphp
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">

    <style>
        @page {
            margin: 0;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 11.5px;
            color: #2c3e50;
            margin: 0;
            padding: 6px 20px 20px 20px;
        }

        /* WATERMARK */
        .watermark {
            position: fixed;
            width: 600px;
            height: 600px;
            top: 50%;
            left: 50%;
            margin-top: -300px;
            margin-left: -300px;
            opacity: 0.09;
            z-index: -1;
        }

        /* HEADER */
        .header-wrapper {
            width: 100%;
            margin-top: 20px;
            margin-bottom: 10px;
            padding-bottom: 6px;
            border-bottom: 2px solid #2E7D32;
            /* GREEN */
        }

        .header-table {
            margin-left: auto;
            margin-right: auto;
        }

        .logo-cell {
            width: 110px;
            vertical-align: middle;
            padding-right: 12px;
        }

        .logo {
            width: 100px;
            height: 100px;
        }

        .text-cell {
            vertical-align: middle;
            text-align: center;
        }

        .header-main {
            font-size: 17px;
            font-weight: bold;
        }

        .header-sub {
            font-size: 12px;
        }

        .header-address {
            font-size: 11px;
            color: #555;
        }

        .header-title {
            font-size: 18px;
            font-weight: bold;
            color: #2E7D32;
            /* GREEN */
        }

        /* SECTION TITLE */
        .section-title {
            font-weight: bold;
            font-size: 14px;
            margin-top: 16px;
            margin-bottom: 0;
            text-align: center;
            color: white;
            background-color: #2E7D32;
            /* GREEN */
            padding: 6px;
            border: 1px solid #2E7D32;
            /* GREEN */
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
        }

        /* SECTION CARD */
        .section-card {
            border: 1px solid #2E7D32;
            /* GREEN */
            border-top: none;
            padding: 8px;
            margin-bottom: 12px;
        }

        .info-table {
            width: 100%;
        }

        .info-table td {
            padding: 6px;
        }

        .photo-container {
            width: 140px;
            text-align: center;
        }

        .photo {
            width: 110px;
            height: 110px;
            border: 1px solid #2E7D32;
            /* GREEN */
            border-radius: 4px;
            object-fit: cover;
            display: block;
            margin: auto;
        }

        .name {
            font-size: 15px;
            font-weight: bold;
            color: #2E7D32;
            /* GREEN */
            margin-bottom: 4px;
            text-transform: capitalize;
        }

        .label {
            font-size: 10px;
            color: #6c757d;
        }

        .value {
            font-size: 12px;
            font-weight: bold;
            text-transform: capitalize;
        }

        .vaccine-table {
            width: 100%;
            border-collapse: collapse;
        }

        .vaccine-table th {
            background-color: #2E7D32;
            /* GREEN */
            color: white;
            padding: 6px;
            text-align: left;
        }

        .vaccine-table td {
            padding: 6px;
            border-bottom: 1px solid #ddd;
        }

        .footer {
            margin-top: 40px;
            text-align: center;
        }

        .signature-line {
            margin: 40px auto 0 auto;
            border-top: 1px solid black;
            width: 220px;
        }

        .signature-text {
            margin-top: 4px;
            font-weight: bold;
        }
    </style>


</head>

<body>

    <!-- WATERMARK -->
    <img src="{{ public_path('logo.jpeg') }}" class="watermark">

    <!-- HEADER -->
    <div class="header-wrapper">
        <table class="header-table">
            <tr>
                <td class="logo-cell">
                    <img src="{{ public_path('logo.jpeg') }}" class="logo">
                </td>
                <td class="text-cell">
                    <div class="header-main">REPUBLIC OF THE PHILIPPINES</div>
                    <div class="header-sub">Municipal Agriculture Office</div>
                    <div class="header-sub">Local Government Unit of Santa Barbara</div>
                    <div class="header-address">
                        Poblacion Sur, Sta. Barbara, Pangasinan Philippines, 2419
                    </div>
                    <div class="header-title">
                        PET REGISTRATION CERTIFICATE
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <!-- OWNER INFORMATION -->
    <div class="section-title">OWNER INFORMATION</div>

    <div class="section-card">
        <table class="info-table">
            <tr>

                <!-- <td class="photo-container">
                    @if($owner && $owner->photo_path && file_exists(public_path('storage/' . $owner->photo_path)))
                        <img src="{{ public_path('storage/' . $owner->photo_path) }}" class="photo">
                    @endif
                </td> -->
                <td class="photo-container">
                    @if($owner && $owner->photo_path)

                        @php
                            $ownerPhoto = Str::startsWith($owner->photo_path, 'http')
                                ? $owner->photo_path
                                : public_path('storage/' . $owner->photo_path);
                        @endphp

                        <img src="{{ $ownerPhoto }}" class="photo">

                    @endif
                </td>
                <td>

                    <div class="label">Owner Name</div>
                    <div class="name">


                        {{ ucwords(strtolower($owner
    ? ($owner->first_name . ' ' .
        ($owner->middle_name ?? '') . ' ' .
        $owner->last_name)
    : '__________')) }}
                    </div>

                    <table width="100%">

                        <tr>
                            <td>
                                <div class="label">Address</div>
                                <div class="value">{{ ucwords(strtolower($owner->address ?? '__________')) }}</div>

                            </td>

                            <td>
                                <div class="label">Barangay</div>
                                <div class="value">{{ $owner->barangay ?? '__________' }}</div>
                            </td>

                            <td>
                                <div class="label">Contact Number</div>
                                <div class="value">{{ $owner->contact_number ?? '__________' }}</div>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <div class="label">Civil Status</div>
                                <div class="value">{{ $owner->civil_status ?? '__________' }}</div>
                            </td>

                            <td>
                                <div class="label">Sex</div>
                                <div class="value">{{ $owner->sex ?? '__________' }}</div>
                            </td>

                            <td>
                                <div class="label">Owner ID</div>
                                <div class="value">{{ $owner->owner_uid ?? '__________' }}</div>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </div>

    <!-- PET INFORMATION -->
    <div class="section-title">PET INFORMATION</div>

    <div class="section-card">
        <table class="info-table">
            <tr>

                <!-- <td class="photo-container">
                    @if($pet && $pet->photo_path && file_exists(public_path('storage/' . $pet->photo_path)))
                        <img src="{{ public_path('storage/' . $pet->photo_path) }}" class="photo">
                    @endif
                </td> -->
                <td class="photo-container">
                    @if($pet && $pet->photo_path)

                        @php
                            $petPhoto = Str::startsWith($pet->photo_path, 'http')
                                ? $pet->photo_path
                                : public_path('storage/' . $pet->photo_path);
                        @endphp

                        <img src="{{ $petPhoto }}" class="photo">

                    @endif
                </td>
                <td>

                    <div class="label">Pet Name</div>
                    <div class="name">{{ ucwords(strtolower($pet->pet_name ?? '__________')) }}</div>
                    <table width="100%">

                        <tr>
                            <td>
                                <div class="label">Pet ID</div>
                                <div class="value">{{ $pet->pet_uid ?? '__________' }}</div>
                            </td>

                            <td>
                                <div class="label">Registration No</div>
                                <div class="value">{{ $pet->registration_no ?? '__________' }}</div>
                            </td>

                            <td>
                                <div class="label">O.R. Number</div>
                                <div class="value">{{ $pet->or_number ?? '__________' }}</div>
                            </td>

                            <td>
                                <div class="label">Date Registered</div>
                                <div class="value">
                                    {{ $pet->date_registered
    ? \Carbon\Carbon::parse($pet->date_registered)->format('Y-m-d')
    : '__________' }}
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <div class="label">Species</div>
                                <div class="value">{{ $pet->species ?? '__________' }}</div>
                            </td>

                            <td>
                                <div class="label">Breed</div>
                                <div class="value">{{ $pet->breed ?? '__________' }}</div>
                            </td>

                            <td>
                                <div class="label">Gender</div>
                                <div class="value">{{ $pet->gender ?? '__________' }}</div>
                            </td>

                            <td>
                                <div class="label">Color</div>
                                <div class="value"> {{ ucwords(strtolower($pet->color ?? '__________')) }}</div>

                            </td>
                        </tr>

                        <tr>
                            <td>
                                <div class="label">Age</div>
                                <div class="value">
                                    {{ $pet->age ?? '__________' }}
                                </div>
                            </td>




                            <td>
                                <div class="label">Markings</div>
                                <div class="value">{{ $pet->markings ?? '__________' }}</div>
                            </td>

                            <td>
                                <div class="label">Confinement</div>
                                <div class="value">{{ $pet->confinement_status ?? '__________' }}</div>
                            </td>

                            <td>
                                <div class="label">Sterilized</div>
                                <div class="value">{{ $pet->sterilized ?? '__________' }}</div>
                            </td>
                        </tr>

                    </table>

                </td>
            </tr>
        </table>
    </div>

    <!-- VACCINE -->
    <div class="section-title">VACCINATION SERVICE RENDERED</div>

    <div class="section-card">
        <table class="vaccine-table">

            <tr>
                <th>Date Administered</th>
                <th>Vaccine Name</th>
                <th>Vaccine Brand</th>
                <th>Lot No</th>
                <th>Next Schedule</th>
                <th>Personnel</th>
            </tr>

            @forelse($vaccines as $v)
                    <tr>

                        <td>
                            {{ $v->date_administered
                ? \Carbon\Carbon::parse($v->date_administered)->format('Y-m-d')
                : '' }}
                        </td>

                        <td>{{ ucwords(strtolower($v->vaccine_name)) }}</td>
                        <td>{{ ucwords(strtolower($v->vaccine_brand)) }}</td>
                        <td>{{ $v->lot_batch_no }}</td>

                        <td>
                            {{ $v->next_schedule
                ? \Carbon\Carbon::parse($v->next_schedule)->format('Y-m-d')
                : '' }}
                        </td>

                        <!-- <td>{{ $v->administering_personnel }}</td> -->
                        <td>{{ ucwords(strtolower($v->administering_personnel)) }}</td>
                    </tr>
            @empty
                <tr>
                    <td colspan="5" style="text-align:center;">
                        No vaccination records
                    </td>
                </tr>
            @endforelse

        </table>
    </div>

    <!-- SIGNATURE -->
    <div class="footer">
        <div class="signature-line"></div>
        <div class="signature-text">
            Veterinarian
        </div>
    </div>

</body>

</html>