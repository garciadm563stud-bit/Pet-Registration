import AppLayout from "@/layouts/app-layout";
import { usePage, router } from "@inertiajs/react";
import Select from "react-select";
import { useEffect, useState } from "react";

export default function VaccineDashboard() {

const {
totalPets,
totalDogs,
totalCats,
totalOwners,
rankings,
records,
filters,
barangays,
vaccines,
currentYear
} = usePage().props;
const [viewImage, setViewImage] = useState(null);

// AUTO RELOAD DASHBOARD EVERY 5 SECONDS
useEffect(() => {

const interval = setInterval(() => {

router.reload({
only:[
"records",
"rankings",
"totalPets",
"totalDogs",
"totalCats",
"totalOwners"
],
preserveState:true
});

},5000);

return () => clearInterval(interval);

},[]);


// PHILIPPINE TIME CLOCK





// Generate current year + next 5 years
const years = [];

for(let i=0;i<=5;i++){
years.push(currentYear + i);
}

const capitalizeWords = (text) => {
if (!text) return "__________";
return text
.toLowerCase()
.replace(/\b\w/g, char => char.toUpperCase());
};
return (

<AppLayout title="Vaccination Statistics">
{viewImage && (
  <div
    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
    style={{ background: "rgba(0,0,0,0.75)", zIndex: 3000 }}
    onClick={() => setViewImage(null)}
  >
    <div
      className="bg-white rounded-3 shadow position-relative d-flex align-items-center justify-content-center"
      onClick={(e) => e.stopPropagation()}
      style={{
        width: 320,
        height: 320,
      }}
    >
      <button
        type="button"
        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
        onClick={() => setViewImage(null)}
      >
        ✕
      </button>

      <img
        src={viewImage}
        alt="preview"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: 10,
        }}
      />
    </div>
  </div>
)}

<div className="container-fluid p-4">


{/* FILTER BAR */}

<div className="card shadow-sm mb-3">

<div className="card-body">

<div className="row g-2 align-items-end">


{/* YEAR */}

<div className="col-md-2">

<label className="form-label">Year</label>

<select
className="form-select"
value={filters.year ?? currentYear}
onChange={(e)=>
router.get('/vaccine-dashboard',
{...filters,year:e.target.value},
{preserveState:false})
}
>

{years.map(y=>(
<option key={y} value={y}>{y}</option>
))}

</select>

</div>


{/* BARANGAY */}

<div className="col-md-3">

<label className="form-label">Barangay</label>

<Select
options={barangays}
placeholder="Select Barangay"
value={barangays.find(b => b.value === filters.barangay) || null}
onChange={(selected)=>
router.get('/vaccine-dashboard',
{...filters,barangay:selected?.value},
{preserveState:false})
}
isClearable
/>

</div>


{/* SPECIES */}

<div className="col-md-2">

<label className="form-label">Species</label>

<select
className="form-select"
value={filters.species ?? ""}
onChange={(e)=>
router.get('/vaccine-dashboard',
{...filters,species:e.target.value},
{preserveState:false})
}
>

<option value="">All Species</option>
<option value="Dog">Dog</option>
<option value="Cat">Cat</option>

</select>

</div>


{/* VACCINE */}

<div className="col-md-3">

<label className="form-label">Vaccine</label>

<Select
options={vaccines}
placeholder="Select Vaccine"
value={vaccines.find(v => v.value === filters.vaccine) || null}
onChange={(selected)=>
router.get('/vaccine-dashboard',
{...filters,vaccine:selected?.value},
{preserveState:false})
}
isClearable
/>

</div>





</div>

</div>

</div>



{/* SUMMARY */}

<div className="row g-3 mb-3">

<div className="col-md-3">

<div className="card shadow-sm">

<div className="card-body">

<div className="text-muted fw-bold">Total Pets</div>

<div className="fs-3 fw-bold">{totalPets}</div>

</div>

</div>

</div>


<div className="col-md-3">

<div className="card shadow-sm">

<div className="card-body">

<div className="text-muted fw-bold">Total Dogs</div>

<div className="fs-3 fw-bold">{totalDogs}</div>

</div>

</div>

</div>


<div className="col-md-3">

<div className="card shadow-sm">

<div className="card-body">

<div className="text-muted fw-bold">Total Cats</div>

<div className="fs-3 fw-bold">{totalCats}</div>

</div>

</div>

</div>


<div className="col-md-3">

<div className="card shadow-sm">

<div className="card-body">

<div className="text-muted fw-bold">Total Owners</div>

<div className="fs-3 fw-bold">{totalOwners}</div>

</div>

</div>

</div>

</div>



{/* BARANGAY RANKINGS */}

<div className="card shadow-sm mb-3">

<div className="card-header d-flex justify-content-between align-items-center">

<span className="fw-bold">Barangay Rankings</span>
<button
className="btn btn-success btn-sm"
onClick={() => {

const params = new URLSearchParams({
year: filters.year ?? currentYear,
barangay: filters.barangay ?? "",
species: filters.species ?? "",
vaccine: filters.vaccine ?? ""
});


window.location.href = `/vaccine-ranking-export?${params.toString()}`;

}}
>
Download Excel
</button>
</div>


<div className="card-body p-0">

<div className="table-responsive">

<table className="table table-hover align-middle text-center mb-0">

<thead className="table-light">

<tr>

<th>Rank</th>
<th>Barangay</th>
<th>Dogs</th>
<th>Cats</th>
<th>Total Pets</th>
<th>Owners</th>

</tr>

</thead>

<tbody>

{rankings.data.length === 0 ? (

<tr>

<td colSpan="6" className="text-center p-4 text-muted">

No data yet

</td>

</tr>

) : (

rankings.data.map((r,index)=>(

<tr key={index}>

<td>{(rankings.current_page - 1) * rankings.per_page + index + 1}</td>

<td>{r.barangay}</td>

<td>{r.dogs}</td>

<td>{r.cats}</td>

<td>{r.total}</td>

<td>{r.owners}</td>

</tr>

))

)}

</tbody>

</table>

</div>

</div>


{/* PAGINATION */}

{rankings.links && rankings.links.length > 3 && (

<div className="p-3 d-flex justify-content-end gap-2">

{rankings.links.map((link,index)=>(

<button
key={index}
className={`btn btn-sm ${link.active ? "btn-primary" : "btn-outline-primary"}`}
disabled={!link.url}
onClick={()=>link.url && router.get(link.url,{},{preserveState:true})}
dangerouslySetInnerHTML={{__html:link.label}}
/>

))}

</div>

)}

</div>



{/* VACCINATION RECORDS */}

<div className="card shadow-sm">

<div className="card-header d-flex justify-content-between align-items-center">

<span className="fw-bold">Vaccination Records</span>


<button
className="btn btn-success btn-sm"
onClick={() => {

// const params = new URLSearchParams({
// year: filters.year ?? currentYear,
// barangay: filters.barangay ?? "",
// species: filters.species ?? ""
// });
const params = new URLSearchParams({
year: filters.year ?? currentYear,
barangay: filters.barangay ?? "",
species: filters.species ?? "",
vaccine: filters.vaccine ?? ""
});
window.location.href = `/vaccine-records-export?${params.toString()}`;

}}
>

Download Excel

</button>

</div>



<div className="card-body p-0">

<div className="table-responsive">

<table className="table table-hover align-middle text-center mb-0">

<thead className="table-light">

<tr>

<th>Owner Pic</th>
<th>Owner</th>
<th>Contact</th>
<th>Brgy</th>
<th>Pet Pic</th>
<th>Pet Name</th>
<th>Species</th>
<th>Vaccine</th>
<th>Date</th>

</tr>

</thead>

<tbody className="text-center align-middle">

{records.data.length === 0 ? (

<tr>

<td colSpan="9" className="text-center p-4 text-muted">

No records yet

</td>

</tr>

) : (

records.data.map((v)=>(

<tr key={v.id}>


<td className="text-center">
  <div className="d-flex justify-content-center">
    <img
      src={
        v.pet?.owner?.photo_path
          ? (v.pet.owner.photo_path.startsWith("http")
              ? v.pet.owner.photo_path
              : `/storage/${v.pet.owner.photo_path}`)
          : "/images/no-image.png"
      }
      style={{
        width: 56,
        height: 56,
        borderRadius: 10,
        objectFit: "cover",
        cursor: "pointer",
        border: "1px solid #eee"
      }}
      onClick={() =>
        setViewImage(
          v.pet?.owner?.photo_path.startsWith("http")
            ? v.pet.owner.photo_path
            : `/storage/${v.pet.owner.photo_path}`
        )
      }
    />
  </div>
</td>


<td>
{capitalizeWords(v.pet?.owner?.first_name)} {capitalizeWords(v.pet?.owner?.last_name)}
</td>


<td>

{v.pet?.owner?.contact_number}

</td>


<td>

{v.pet?.owner?.barangay}

</td>


<td className="text-center">
  <div className="d-flex justify-content-center">
    <img
      src={
        v.pet?.photo_path
          ? (v.pet.photo_path.startsWith("http")
              ? v.pet.photo_path
              : `/storage/${v.pet.photo_path}`)
          : "/images/no-image.png"
      }
      style={{
        width: 56,
        height: 56,
        borderRadius: 10,
        objectFit: "cover",
        cursor: "pointer",
        border: "1px solid #eee"
      }}
      onClick={() =>
        setViewImage(
          v.pet?.photo_path.startsWith("http")
            ? v.pet.photo_path
            : `/storage/${v.pet.photo_path}`
        )
      }
    />
  </div>
</td>


<td>{capitalizeWords(v.pet?.pet_name)}</td>


<td>{v.pet?.species}</td>

<td>
    {capitalizeWords(v.vaccine_name ?? v.vaccine_choice)}
</td>

<td>{v.date_administered}</td>

</tr>

))

)}

</tbody>

</table>

</div>

</div>



{/* RECORD PAGINATION */}

{records.links && records.links.length > 3 && (

<div className="p-3 d-flex justify-content-end gap-2">

{records.links.map((link,index)=>(

<button
key={index}
className={`btn btn-sm ${link.active ? "btn-primary" : "btn-outline-primary"}`}
disabled={!link.url}
onClick={()=>link.url && router.get(link.url,{},{preserveState:true})}
dangerouslySetInnerHTML={{__html:link.label}}
/>

))}

</div>

)}

</div>

</div>

</AppLayout>

);
}