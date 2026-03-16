<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">

    <style>
        @page {
            margin: 12mm;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            margin: 0;
        }

        .grid {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }

        .grid td:first-child {
            padding-right: 8mm;
        }

        .grid td:last-child {
            padding-left: 8mm;
        }

        .grid td {
            width: 50%;
            padding: 6mm;
            vertical-align: top;
            box-sizing: border-box;
        }

        .coupon {
            width: 100%;
            height: 115mm;
            /* slightly increased */
            border: 2px solid #2E7D32;
            border-radius: 10px;
            padding: 14px 16px;
            /* reduced padding */
            box-sizing: border-box;
            position: relative;
        }

        .watermark {
            position: absolute;
            width: 150px;
            height: 150px;
            top: 52%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0.05;
            z-index: 0;
        }

        .header {
            text-align: center;
        }

        .logo {
            width: 50px;
            margin-bottom: 2px;
        }

        .header-main {
            font-size: 11px;
            font-weight: bold;
        }

        .header-sub {
            font-size: 9px;
        }

        .header-title {
            font-size: 12px;
            font-weight: bold;
            color: #2E7D32;
            margin-top: 3px;
            margin-bottom: 6px;
        }

        .label {
            font-size: 9px;
            margin-top: 5px;
            margin-bottom: 2px;
        }

        .line {
            border-bottom: 1px solid black;
            height: 14px;
            width: 100%;
            margin-bottom: 4px;
        }

        .row {
            width: 100%;
            margin-top: 4px;
            margin-bottom: 4px;
        }

        .col {
            width: 48%;
            display: inline-block;
        }

        .col.right {
            float: right;
        }

        .signature {
            margin-top: 25px;
            /* reduced */
            text-align: center;
        }

        .signature-line {
            border-bottom: 1px solid black;
            width: 60%;
            margin: 0 auto;
        }

        .signature-text {
            font-size: 9px;
            margin-top: 3px;
        }
    </style>

</head>

<body>

    <table class="grid">

        <tr>
            <td>@include('pdf.pet-form-single')</td>
            <td>@include('pdf.pet-form-single')</td>
        </tr>

        <tr>
            <td>@include('pdf.pet-form-single')</td>
            <td>@include('pdf.pet-form-single')</td>
        </tr>

    </table>

</body>

</html>