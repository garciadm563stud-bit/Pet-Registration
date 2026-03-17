import AppLayout from "@/layouts/app-layout";
import React from "react";
import { router, useForm, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import CreatableSelect from "react-select/creatable";
// const VACCINE_OPTIONS = [
//   "Anti-Rabies",
//   "5-in-1 (DHPP)",
//   "6-in-1 (DHPPiL)",
//   "Parvo",
//   "Distemper",
//   "Bordetella (Kennel Cough)",
//   "Leptospirosis",
//   "Feline 3-in-1 (FVRCP)",
//   "Feline Leukemia (FeLV)",
//   "Deworming",
//   "Tick/Flea Prevention",
//   "Other",
// ];
const VACCINE_OPTIONS = [
  { value: "Anti-Rabies", label: "Anti-Rabies" },
  { value: "5-in-1 (DHPP)", label: "5-in-1 (DHPP)" },
  { value: "6-in-1 (DHPPiL)", label: "6-in-1 (DHPPiL)" },
  { value: "Parvo", label: "Parvo" },
  { value: "Distemper", label: "Distemper" },
  { value: "Bordetella", label: "Bordetella" },
  { value: "Leptospirosis", label: "Leptospirosis" },
  { value: "FVRCP", label: "Feline 3-in-1 (FVRCP)" },
  { value: "FeLV", label: "Feline Leukemia (FeLV)" },
  { value: "Deworming", label: "Deworming" },
  { value: "Tick/Flea", label: "Tick/Flea Prevention" },
];

const VACCINE_BRANDS = [
  { value: "Nobivac", label: "Nobivac" },
  { value: "Defensor", label: "Defensor" },
  { value: "Rabisin", label: "Rabisin" },
  { value: "Rabigen", label: "Rabigen" },
  { value: "Vanguard", label: "Vanguard" },
  { value: "Duramune", label: "Duramune" },
];
export default function ShowPetDetails({ owner, pet, vaccines }) {
  const { flash } = usePage().props;

  const [viewImage, setViewImage] = React.useState(null);

  // ✅ inline form state
  const [showVaxForm, setShowVaxForm] = React.useState(false);
  const [editingVax, setEditingVax] = React.useState(null);

  // ✅ show SweetAlert on any success from backend
  React.useEffect(() => {
    if (flash?.success) {
      Swal.fire({
        icon: "success",
        title: flash.success,
        timer: 1400,
        showConfirmButton: false,
      });
    }
  }, [flash]);

  // const ownerPhoto = owner?.photo_path ? `/storage/${owner.photo_path}` : null;
  // const petPhoto = pet?.photo_path ? `/storage/${pet.photo_path}` : null;
const ownerPhoto = owner?.photo_path
  ? owner.photo_path.startsWith("http")
    ? owner.photo_path
    : `/storage/${owner.photo_path}`
  : null;

const petPhoto = pet?.photo_path
  ? pet.photo_path.startsWith("http")
    ? pet.photo_path
    : `/storage/${pet.photo_path}`
  : null;
  const age = pet?.age ?? "—";

  const hasVaccines = (vaccines?.data?.length ?? 0) > 0;
  const hasVaxMultiplePages = (vaccines?.links?.length ?? 0) > 3;
const vaccineFormRef = React.useRef(null);

  // ✅ Vaccine Form (inline)
  const vaxForm = useForm({
    date_administered: "",
    vaccine_choice: "",
    custom_vaccine_name: "",
    lot_batch_no: "",
    next_schedule: "",
    administering_personnel: "",
    vaccine_brand: "",
    
  });

  function openAddVaccine() {
    setEditingVax(null);
    vaxForm.reset();
    vaxForm.clearErrors();
    setShowVaxForm(true);
  }

  function openEditVaccine(v) {
    setEditingVax(v);
    vaxForm.clearErrors();
    vaxForm.setData({
      date_administered: v.date_administered ?? "",
      vaccine_choice: v.vaccine_choice ?? "",
      custom_vaccine_name: v.custom_vaccine_name ?? "",
       vaccine_brand: v.vaccine_brand ?? "",
      lot_batch_no: v.lot_batch_no ?? "",
      next_schedule: v.next_schedule ?? "",
      administering_personnel: v.administering_personnel ?? "",
    });
    setShowVaxForm(true);

    // ✅ scroll to form
    setTimeout(() => {
      const el = document.getElementById("vaccine-form");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  function closeVaxForm() {
    setShowVaxForm(false);
    setEditingVax(null);
    vaxForm.reset();
    vaxForm.clearErrors();
  }

  function submitVaccine(e) {
    e.preventDefault();

    // ✅ Add
    if (!editingVax) {
      vaxForm.post(`/pets/${pet.id}/vaccines`, {
        preserveScroll: true,
        onSuccess: () => {
          // ✅ Immediately show in table: Inertia will re-render props from backend
          closeVaxForm();
        },
      });
      return;
    }

    // ✅ Update
    vaxForm.put(`/vaccines/${editingVax.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        closeVaxForm();
      },
    });
  }
React.useEffect(() => {
  if (showVaxForm && vaccineFormRef.current) {
    vaccineFormRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}, [showVaxForm]);

  function confirmDeleteVaccine(v) {
    Swal.fire({
      icon: "warning",
      title: "Delete vaccine?",
      text: `This will delete "${v.vaccine_name}".`,
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    }).then((res) => {
      if (res.isConfirmed) {
        router.delete(`/vaccines/${v.id}`, {
          preserveScroll: true,
          replace: true,
        });
      }
    });
  }
// ✅ Date limits (PH timezone safe enough for UI)
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");
const todayStr = `${yyyy}-${mm}-${dd}`;

const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const tyyyy = tomorrow.getFullYear();
const tmm = String(tomorrow.getMonth() + 1).padStart(2, "0");
const tdd = String(tomorrow.getDate()).padStart(2, "0");
const tomorrowStr = `${tyyyy}-${tmm}-${tdd}`;
const capitalizeWords = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};
  return (
    <AppLayout>
      {/* SQUARE IMAGE POPUP */}
      {viewImage && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.75)", zIndex: 3000 }}
          onClick={() => setViewImage(null)}
        >
          <div
            className="bg-white rounded-3 shadow position-relative d-flex align-items-center justify-content-center"
            onClick={(e) => e.stopPropagation()}
            style={{ width: 320, height: 320 }}
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
    {/* HEADER */}
    <div className="d-flex justify-content-end mb-3">
        <button
            className="btn btn-success"
            onClick={() => window.open(`/pets/${pet.id}/certificate`, "_blank")}
        >
            Download Certificate PDF
        </button>
    </div>

        {/* OWNER DETAILS */}
        <div className="card shadow-sm mb-4">
  <div className="card-header fw-bold text-center fs-5">Owner Information</div>

  <div className="card-body">
    <div className="row g-4 align-items-center">
      {/* LEFT PHOTO */}
      <div className="col-12 col-md-3 d-flex justify-content-center align-items-center">
        {ownerPhoto ? (
          // <img
          //   src={ownerPhoto}
          //   alt="owner"
          //   onClick={() => setViewImage(ownerPhoto)}
          //   title="Click to enlarge"
          //    style={{
          //             width: 170,
          //             height: 170,
          //             objectFit: "cover",
          //             borderRadius: 16,
          //             border: "1px solid #eee",
          //             cursor: "pointer",
          //           }}
          // />
          <img
  src={ownerPhoto}
  onError={(e) => (e.target.src = "/images/no-image.png")}
  alt="owner"
  onClick={() => setViewImage(ownerPhoto)}
  title="Click to enlarge"
  style={{
    width: 170,
    height: 170,
    objectFit: "cover",
    borderRadius: 16,
    border: "1px solid #eee",
    cursor: "pointer",
  }}
/>
        ) : (
          <div
            className="d-flex align-items-center justify-content-center text-muted"
            style={{
              width: 150,
              height: 150,
              borderRadius: 18,
              border: "1px dashed #cfcfcf",
            }}
          >
            No Photo
          </div>
        )}
      </div>

      {/* RIGHT INFO */}
      <div className="col-12 col-md-9">
        <div className="fw-bold fs-4 mb-3">
          {capitalizeWords(owner.first_name)}{" "}
{owner.middle_name ? capitalizeWords(owner.middle_name) : ""}{" "}
{capitalizeWords(owner.last_name)}
        </div>

        <div className="row g-3">
          {/* LEFT COLUMN */}
          <div className="col-12 col-md-6">
            <div className="mb-3">
              <div className="text-muted small">Address</div>
              <div className="fw-semibold"> {capitalizeWords(owner.address ?? "—")}</div>
            </div>

            <div className="mb-3">
              <div className="text-muted small">Civil Status</div>
              <div className="fw-semibold">{owner.civil_status ?? "—"}</div>
            </div>

            <div>
              <div className="text-muted small">Contact Number</div>
              <div className="fw-semibold">{owner.contact_number ?? "—"}</div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-12 col-md-6">
            <div className="mb-3">
              <div className="text-muted small">Barangay</div>
              <div className="fw-semibold">{owner.barangay ?? "—"}</div>
            </div>

            <div className="mb-3">
              <div className="text-muted small">Sex</div>
              <div className="fw-semibold">{owner.sex ?? "—"}</div>
            </div>

            <div>
              <div className="text-muted small">Owner ID</div>
              <div className="fw-semibold">{owner.owner_uid ?? "—"}</div>
            </div>
          </div>
        </div>
      </div>
      {/* END RIGHT INFO */}
    </div>
  </div>
</div>


        {/* PET DETAILS */}
        <div className="card shadow-sm mb-4">
          <div className="card-header fw-bold text-center fs-5">Pet Information</div>

          <div className="card-body">
            <div className="row g-4 align-items-center">

              <div className="col-12 col-md-3 d-flex justify-content-center">
                {petPhoto ? (
                  // <img
                  //   src={petPhoto}
                  //   alt="pet"
                  //   onClick={() => setViewImage(petPhoto)}
                  //   title="Click to enlarge"
                  //   style={{
                  //     width: 170,
                  //     height: 170,
                  //     objectFit: "cover",
                  //     borderRadius: 16,
                  //     border: "1px solid #eee",
                  //     cursor: "pointer",
                  //   }}
                  // />
                  <img
  src={petPhoto}
  onError={(e) => (e.target.src = "/images/no-image.png")}
  alt="pet"
  onClick={() => setViewImage(petPhoto)}
  title="Click to enlarge"
  style={{
    width: 170,
    height: 170,
    objectFit: "cover",
    borderRadius: 16,
    border: "1px solid #eee",
    cursor: "pointer",
  }}
/>
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center text-muted"
                    style={{
                      width: 170,
                      height: 170,
                      borderRadius: 16,
                      border: "1px dashed #cfcfcf",
                    }}
                  >
                    No Photo
                  </div>
                )}
              </div>

            <div className="col-12 col-md-9">
  <div className="fw-bold fs-5 mb-3">
    
    {capitalizeWords(pet.pet_name ?? "—")}
  </div>

  <div className="row small">

    {/* LEFT COLUMN */}
    <div className="col-12 col-md-6">
      <div className="mb-2">
        <span className="text-muted">Pet ID:</span>{" "}
        <span className="fw-semibold">{pet.pet_uid ?? "—"}</span>
      </div>

      <div className="mb-2">
        <span className="text-muted">Registration No:</span>{" "}
        <span className="fw-semibold">{pet.registration_no ?? "—"}</span>
      </div>

      <div className="mb-2">
        <span className="text-muted">Paid OR No:</span>{" "}
        <span className="fw-semibold">{pet.or_number ?? "—"}</span>
      </div>

      <div className="mb-2">
        <span className="text-muted">Species:</span>{" "}
        <span className="fw-semibold">{pet.species ?? "—"}</span>
      </div>

      <div className="mb-2">
        <span className="text-muted">Breed:</span>{" "}
        <span className="fw-semibold">{capitalizeWords(pet.breed ?? "—")}</span>
      </div>

      <div className="mb-2">
        <span className="text-muted">Age:</span>{" "}
        <span className="fw-semibold">{capitalizeWords(pet.age ?? "—")}</span>
      </div>
    </div>

    {/* RIGHT COLUMN */}
    <div className="col-12 col-md-6">
      <div className="mb-2">
        <span className="text-muted">Gender:</span>{" "}
        <span className="fw-semibold">{pet.gender ?? "—"}</span>
      </div>

      <div className="mb-2">
        <span className="text-muted">Color:</span>{" "}
        <span className="fw-semibold">{capitalizeWords(pet.color ?? "—")}</span>
      </div>

      <div className="mb-2">
        <span className="text-muted">Registered:</span>{" "}
        <span className="fw-semibold">
          {pet.created_at
            ? new Date(pet.created_at).toISOString().slice(0, 10)
            : "—"}
        </span>
      </div>

      <div className="mb-2">
        <span className="text-muted">Markings:</span>{" "}
        <span className="fw-semibold">{capitalizeWords(pet.markings ?? "—")}</span>
      </div>

      <div className="mb-2">
        <span className="text-muted">Confinement:</span>{" "}
        <span className="fw-semibold">
          {pet.confinement_status ?? "—"}
        </span>
      </div>

         <div className="mb-2">
        <span className="text-muted">Sterilized:</span>{" "}
        <span className="fw-semibold">
          {pet.sterilized ?? "—"}
        </span>
      </div>
    </div>

  </div>
</div>
            </div>
          </div>
        </div>

        {/* VACCINES HEADER */}
    {/* VACCINES SECTION */}
{/* <div className="card shadow-sm mb-4">
  <div className="card-header fw-bold text-center position-relative fs-5">
    Vaccination Service Rendered

    
    <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>
      {!showVaxForm ? (
        <button className="btn btn-primary btn-sm" onClick={openAddVaccine}>
          + Add Vaccine
        </button>
      ) : (
        <button className="btn btn-outline-secondary btn-sm" onClick={closeVaxForm}>
          Close Form
        </button>
      )}
    </div>
  </div> */}
  <div className="card-header fw-bold fs-5">
  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">

    {/* LEFT (empty spacer for perfect center balance) */}
    <div style={{ width: 120 }} />

    {/* CENTER TITLE */}
    <div className="text-center flex-grow-1">
      Vaccination Service Rendered
    </div>

    {/* RIGHT BUTTON */}
    <div>
      {!showVaxForm ? (
        <button className="btn btn-primary btn-sm">
          + Add Vaccine
        </button>
      ) : (
        <button className="btn btn-outline-secondary btn-sm">
          Close Form
        </button>
      )}
    </div>

  </div>
</div>

  <div className="card-body">
    {/* ✅ INLINE ADD/EDIT VACCINE FORM */}
    {showVaxForm && (
      <div ref={vaccineFormRef}  className="card shadow-sm mb-3" id="vaccine-form">
        <div className="card-header fw-bold d-flex align-items-center justify-content-between">
          <div>{editingVax ? "Edit Vaccine" : "Add Vaccine"}</div>

          {editingVax && <span className="badge text-bg-warning">Editing</span>}
        </div>

        <div className="card-body">
          <form onSubmit={submitVaccine}>
            <div className="row g-3">
              <div className="col-12 col-md-4">
                <label className="form-label">Date Administered</label>
               <input
  type="date"
  className="form-control"
  value={vaxForm.data.date_administered}
  max={todayStr}                 // ✅ blocks tomorrow/future
  onChange={(e) => vaxForm.setData("date_administered", e.target.value)}
/>

                {vaxForm.errors.date_administered && (
                  <div className="text-danger small">{vaxForm.errors.date_administered}</div>
                )}
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label">Vaccine (Common)</label>
                <CreatableSelect
  placeholder="Select or type vaccine..."
  options={VACCINE_OPTIONS}
  isClearable
  value={
    vaxForm.data.vaccine_choice
      ? { label: vaxForm.data.vaccine_choice, value: vaxForm.data.vaccine_choice }
      : null
  }
  onChange={(selected) =>
    vaxForm.setData("vaccine_choice", selected?.value ?? "")
  }
/>
                {vaxForm.errors.vaccine_choice && (
                  <div className="text-danger small">{vaxForm.errors.vaccine_choice}</div>
                )}
              </div>
<div className="col-12 col-md-4">
  <label className="form-label">Vaccine Brand</label>

  <CreatableSelect
    placeholder="Select or type brand..."
    options={VACCINE_BRANDS}
    isClearable
    value={
      vaxForm.data.vaccine_brand
        ? { label: vaxForm.data.vaccine_brand, value: vaxForm.data.vaccine_brand }
        : null
    }
    onChange={(selected) =>
      vaxForm.setData("vaccine_brand", selected?.value ?? "")
    }
  />

  {vaxForm.errors.vaccine_brand && (
    <div className="text-danger small">
      {vaxForm.errors.vaccine_brand}
    </div>
  )}
</div>
              <div className="col-12 col-md-4">
                <label className="form-label">Lot / Batch No.</label>
                <input
                  className="form-control"
                  value={vaxForm.data.lot_batch_no}
                  onChange={(e) => vaxForm.setData("lot_batch_no", e.target.value)}
                />
              </div>

              {vaxForm.data.vaccine_choice === "Other" && (
                <div className="col-12">
                  <label className="form-label">Custom Vaccine Name</label>
                  <input
                    className="form-control"
                    value={vaxForm.data.custom_vaccine_name}
                    onChange={(e) => vaxForm.setData("custom_vaccine_name", e.target.value)}
                    placeholder="Type vaccine name..."
                  />
                  {vaxForm.errors.custom_vaccine_name && (
                    <div className="text-danger small">{vaxForm.errors.custom_vaccine_name}</div>
                  )}
                </div>
              )}

              <div className="col-12 col-md-4">
                <label className="form-label">Next Schedule</label>
                <input
  type="date"
  className="form-control"
  value={vaxForm.data.next_schedule}
  min={tomorrowStr}              // ✅ blocks past + today
  onChange={(e) => vaxForm.setData("next_schedule", e.target.value)}
/>

              </div>

              {/* <div className="col-12 col-md-8">
                <label className="form-label">Administering Personnel</label>
                <input
                  className="form-control"
                  value={vaxForm.data.administering_personnel}
                  onChange={(e) =>
                    vaxForm.setData("administering_personnel", e.target.value)
                  }
                />
              </div> */}
              <div className="col-12 col-md-8">
  <label className="form-label">
    Administering Personnel <span className="text-danger">*</span>
  </label>

  <input
    className="form-control"
   
    type="text"
    value={vaxForm.data.administering_personnel}
    onChange={(e) =>
      vaxForm.setData("administering_personnel", e.target.value)
    }
  />

  {vaxForm.errors.administering_personnel && (
    <div className="text-danger small">
      {vaxForm.errors.administering_personnel}
    </div>
  )}
</div>

            </div>

            <div className="mt-3 d-flex gap-2">
              <button className="btn btn-success" disabled={vaxForm.processing}>
                {editingVax ? "Update Vaccine" : "Save Vaccine"}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeVaxForm}
                disabled={vaxForm.processing}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* ✅ VACCINES TABLE */}
    <div className="card shadow-sm">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0 align-middle">
            <thead>
              <tr>
                <th>Date Administered</th>
                <th>Vaccine Name</th>
                <th>Vaccine Brand</th>
                <th>Lot/Batch No</th>
                <th>Next Schedule</th>
                <th>Administering Personnel</th>
                <th style={{ width: 160 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {hasVaccines ? (
                vaccines.data.map((v) => (
                  <tr key={v.id}>
                    <td>{v.date_administered ?? "—"}</td>
                    <td> {capitalizeWords(v.vaccine_name ?? "—")}</td>
                    <td>{capitalizeWords(v.vaccine_brand ?? "—")}</td>
                    <td>{v.lot_batch_no ?? "—"}</td>
                    <td>{v.next_schedule ?? "—"}</td>
                    <td>{capitalizeWords(v.administering_personnel ?? "—")}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn btn-warning btn-sm" onClick={() => openEditVaccine(v)}>
                          Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => confirmDeleteVaccine(v)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted p-4">
                    No vaccine records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Pagination */}
        {hasVaxMultiplePages && (
          <div className="p-3 d-flex justify-content-end gap-2">
            {vaccines.links.map((l, i) => (
              <button
                key={i}
                className={`btn btn-sm ${l.active ? "btn-primary" : "btn-outline-primary"}`}
                disabled={!l.url}
                onClick={() =>
                  l.url && router.get(l.url, {}, { preserveState: true, replace: true })
                }
                dangerouslySetInnerHTML={{ __html: l.label }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
</div>
</div>
    </AppLayout>
  );
}
