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

        /* GRID */
        .grid {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }

        .grid td {

            width: 50%;

            padding: 6mm;

            vertical-align: top;

            box-sizing: border-box;
        }

        /* FORM */
        .coupon {

            width: 100%;

            height: 113mm;

            border: 2px solid #2E7D32;

            border-radius: 10px;

            padding: 16px 18px;

            box-sizing: border-box;

            position: relative;
        }

        /* WATERMARK */
        .watermark {

            position: absolute;

            width: 160px;
            /* ✅ increase size (adjust as needed) */

            height: 160px;
            /* keep proportional */

            top: 55%;
            left: 50%;

            transform: translate(-50%, -50%);

            opacity: 0.06;
            /* lighter watermark */

            z-index: 0;
            /* behind form */

        }

        /* HEADER */
        .header {
            text-align: center;
        }

        .logo {
            width: 50px;
        }

        .header-main {
            font-size: 12px;
            font-weight: bold;
        }

        .header-sub {
            font-size: 10px;
        }

        .header-title {
            font-size: 13px;
            font-weight: bold;
            color: #2E7D32;
            margin-bottom: 6px;
        }

        /* FORM */
        /* FIELD LABEL */
        .label {

            font-size: 10px;

            margin-top: 8px;
            /* space above label */

            margin-bottom: 2px;
            /* space before line */
        }

        /* LINE */
        .line {

            border-bottom: 1px solid black;

            height: 16px;

            width: 100%;

            margin-bottom: 6px;
            /* space after line */
        }

        /* ROW (Barangay + Contact, Civil Status + Sex) */
        .row {

            width: 100%;

            margin-top: 6px;

            margin-bottom: 6px;
        }


        .col {
            width: 48%;
            display: inline-block;
        }

        .col.right {
            float: right;
        }

        /* SIGNATURE FIXED */
        .signature {

            margin-top: 22px;

            text-align: center;
            /* ✅ centers everything */

        }


        .signature-line {

            border-bottom: 1px solid black;

            width: 60%;

            margin: 0 auto;
            /* ✅ centers the line */

        }


        .signature-text {

            font-size: 10px;

            margin-top: 4px;

            text-align: center;
            /* ✅ centers text */

        }
    </style>

</head>

<body>

    <table class="grid">

        <tr>

            <td>
                @include('pdf.owner-form-single')
            </td>

            <td>
                @include('pdf.owner-form-single')
            </td>

        </tr>

        <tr>

            <td>
                @include('pdf.owner-form-single')
            </td>

            <td>
                @include('pdf.owner-form-single')
            </td>

        </tr>

    </table>

</body>

</html>