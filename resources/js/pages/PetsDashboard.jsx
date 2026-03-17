import AppLayout from "@/layouts/app-layout";
import React from "react";
import { router, useForm, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import Select from "react-select";

export default function PetsDashboard() {
  const { pets, filters, summary, options, flash } = usePage().props;

  const [showForm, setShowForm] = React.useState(false);
const [breedMode, setBreedMode] = React.useState("select");
const [owner, setOwner] = React.useState(filters?.owner ?? "");
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

  // Filters
  const [search, setSearch] = React.useState(filters?.search ?? "");
  const [species, setSpecies] = React.useState(filters?.species ?? "");
  const [sort, setSort] = React.useState(filters?.sort ?? "newest");

  // ✅ Live search debounce
  React.useEffect(() => {
    const t = setTimeout(() => {
      applyFilters({ search });
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // function applyFilters(next = {}) {
  //   router.get(
  //     "/pets",
  //     { search, species, sort, ...next },
  //     { preserveState: true, replace: true }
  //   );
  // }

  // Add Pet form
 function applyFilters(next = {}) {
  router.get(
    "/pets",
    { search, species, sort, owner, ...next },
    { preserveState: true, replace: true }
  );
}
  const form = useForm({
    photo: null,
      remove_photo: false, 
    pet_name: "",
    pet_uid: "", // display only (auto)
    or_number: "",
    registration_no: "", // display only (auto)
    species: "",
    breed: "",
    

  age: "",        // backend field
  age_value: "",  // input number
  age_unit: "Years", // default
 sterilized: "",
    gender: "",
    color: "",
    markings: "",
    confinement_status: "",
    owner_id: null,
  });

  const [previewImage, setPreviewImage] = React.useState(null);
  const [viewImage, setViewImage] = React.useState(null);

const [editingPet, setEditingPet] = React.useState(null); // null = add mode, object = edit mode
function openEditForm(p) {
  setEditingPet(p);
  form.clearErrors();

  const parsed = parseAgeForEdit(p.age);

  form.setData({
    photo: null,
    remove_photo: false,

    pet_name: p.pet_name ?? "",
    pet_uid: p.pet_uid ?? "",
    or_number: p.or_number ?? "",
    registration_no: p.registration_no ?? "",
    species: p.species ?? "",
    breed: p.breed ?? "",
sterilized: p.sterilized ?? "",
    // ✅ keep original string (optional)
    age: p.age ?? "",

    // ✅ THIS MAKES EDIT INPUTS SHOW VALUE
    age_value: parsed.age_value,
    age_unit: parsed.age_unit,

    gender: p.gender ?? "",
    color: p.color ?? "",
    markings: p.markings ?? "",
    confinement_status: p.confinement_status ?? "",
    owner_id: p.owner?.id ?? p.owner_id ?? null,
  });

  setPreviewImage((old) => {
    if (old?.startsWith("blob:")) URL.revokeObjectURL(old);
    return p.photo_path ? `/storage/${p.photo_path}` : null;
  });

  setShowForm(true);
  scrollToPetForm();
}
function openAddForm() {
  setEditingPet(null);
  form.reset();
  form.setData("age_unit", "Years");
  form.clearErrors();

  setPreviewImage((old) => {
    if (old?.startsWith("blob:")) URL.revokeObjectURL(old);
    return null;
  });

  setShowForm(true);

  scrollToPetForm(); // ✅ ADD THIS
  setBreedMode("select");
}
  // =========================
  // ✅ CAMERA (LIVE VIEW LIKE OWNERS DASHBOARD)
  // =========================
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const streamRef = React.useRef(null);
const petFormRef = React.useRef(null);
  const [cameraOpen, setCameraOpen] = React.useState(false);
  const [startingCamera, setStartingCamera] = React.useState(false);
  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);

const [cameraFacing, setCameraFacing] = React.useState(
  isMobile ? "environment" : "user"
);
const [previewIds, setPreviewIds] = React.useState({ pet_uid: "", registration_no: "" });
const [loadingPreview, setLoadingPreview] = React.useState(false);
async function loadPreviewId(nextSpecies) {
  if (!nextSpecies) {
    setPreviewIds({ pet_uid: "", registration_no: "" });
    return;
  }

  try {
    setLoadingPreview(true);

    const res = await fetch(`/pets/preview-id?species=${encodeURIComponent(nextSpecies)}`, {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) throw new Error("Failed to fetch preview id");

    const data = await res.json();

    setPreviewIds({
      pet_uid: data.pet_uid ?? "",
      registration_no: data.registration_no ?? "",
    });
  } catch (e) {
    console.log("preview id error:", e);
    setPreviewIds({ pet_uid: "", registration_no: "" });
  } finally {
    setLoadingPreview(false);
  }
}


function scrollToPetForm() {
  setTimeout(() => {
    petFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 50);
}
  function openCamera() {
    setCameraOpen(true);
  }

  function stopCamera() {
    const stream = streamRef.current;
    if (stream) stream.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    if (videoRef.current) videoRef.current.srcObject = null;

    setCameraOpen(false);
    setStartingCamera(false);
  }
// React.useEffect(() => {
//   if (showForm && petFormRef.current) {
//     petFormRef.current.scrollIntoView({
//       behavior: "smooth",
//       block: "start",
//     });
//   }
// }, [showForm]);
  React.useEffect(() => {
    let cancelled = false;

    async function attachStream() {
      if (!cameraOpen) return;

      try {
        setStartingCamera(true);
  if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: cameraFacing, // try back cam if available (PC will ignore)
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;

        const video = videoRef.current;
        if (!video) return;

        video.srcObject = stream;

        await new Promise((resolve) => {
          video.onloadedmetadata = () => resolve();
        });

        await video.play();
      } catch (err) {
        console.log(err?.name, err?.message, err);
        stopCamera();
        Swal.fire({
          icon: "error",
          title: "Camera Error",
          text: "Camera blocked. Use HTTPS (Herd secure) or localhost, then allow permission.",
        });
      } finally {
        if (!cancelled) setStartingCamera(false);
      }
    }

    attachStream();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },  [cameraOpen, cameraFacing]);

//   function capturePhoto() {
//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     if (!video || !canvas) return;

//     const w = video.videoWidth || 640;
//     const h = video.videoHeight || 480;

//     canvas.width = w;
//     canvas.height = h;

//     const ctx = canvas.getContext("2d");
//     ctx.drawImage(video, 0, 0, w, h);

//     canvas.toBlob(
//       (blob) => {
//         if (!blob) return;

//         const file = new File([blob], "pet_photo.jpg", { type: "image/jpeg" });
//         form.setData("photo", file);
// form.setData("remove_photo", false); // ✅ ADD


//         setPreviewImage((old) => {
//           if (old?.startsWith("blob:")) URL.revokeObjectURL(old);
//           return URL.createObjectURL(file);
//         });

//         stopCamera();
//       },
//       "image/jpeg",
//       0.9
//     );
//   }

  // Close camera when form closes/unmounts
   function capturePhoto() {
  const video = videoRef.current;
  const canvas = canvasRef.current;
  if (!video || !canvas) return;

  const w = video.videoWidth || 640;
  const h = video.videoHeight || 480;

  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");

  // ✅ Flip back before drawing (so saved image is NOT inverted)
 if (cameraFacing === "user") {
  ctx.translate(w, 0);
  ctx.scale(-1, 1);
}
  ctx.drawImage(video, 0, 0, w, h);

  canvas.toBlob(
    (blob) => {
      if (!blob) return;

      const file = new File([blob], "pet_photo.jpg", { type: "image/jpeg" });
      form.setData("photo", file);
      form.setData("remove_photo", false);

      setPreviewImage((old) => {
        if (old) URL.revokeObjectURL(old);
        return URL.createObjectURL(file);
      });

      stopCamera();
    },
    "image/jpeg",
    0.9
  );
}
  React.useEffect(() => {
    if (!showForm) stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showForm]);

  React.useEffect(() => {
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

function closeForm() {
  stopCamera(); // if you already added camera
  form.reset();
  form.clearErrors();
  setEditingPet(null);

  setPreviewImage((old) => {
    if (old?.startsWith("blob:")) URL.revokeObjectURL(old);
    return null;
  });

  setShowForm(false);
}


// function submitPet(e) {
//   e.preventDefault();

//   const ageValue = Number(form.data.age_value);
//   const ageUnit = form.data.age_unit ?? "Years";

//   let finalAge = null;

//   if (!isNaN(ageValue) && form.data.age_value !== "") {
//     if (ageUnit === "Months") {
//       if (ageValue >= 12) {
//         const years = Math.floor(ageValue / 12);
//         const months = ageValue % 12;

//         finalAge =
//           months === 0
//             ? `${years} Year${years > 1 ? "s" : ""} Old`
//             : `${years} Year${years > 1 ? "s" : ""} ${months} Month${months > 1 ? "s" : ""} Old`;
//       } else {
//         finalAge = `${ageValue} Month${ageValue > 1 ? "s" : ""} Old`;
//       }
//     } else {
//       finalAge = `${ageValue} Year${ageValue > 1 ? "s" : ""} Old`;
//     }
//   }

//   // ✅ UPDATE FORM STATE FIRST (SYNC STYLE)
//   form.transform((data) => ({
//     ...data,
//     age: finalAge,
//   }));

//   if (!editingPet) {
//     form.post("/pets", {
//       forceFormData: true,
//       onSuccess: () => closeForm(),
//     });
//   } else {
//     form.put(`/pets/${editingPet.id}`, {
//       forceFormData: true,
//       onSuccess: () => closeForm(),
//     });
//   }
// }
function submitPet(e) {
  e.preventDefault();

  const ageValue = Number(form.data.age_value);
  const ageUnit = form.data.age_unit ?? "Years";

  let finalAge = null;

  if (!isNaN(ageValue) && form.data.age_value !== "") {
    if (ageUnit === "Months") {
      if (ageValue >= 12) {
        const years = Math.floor(ageValue / 12);
        const months = ageValue % 12;

        finalAge =
          months === 0
            ? `${years} Year${years > 1 ? "s" : ""} Old`
            : `${years} Year${years > 1 ? "s" : ""} ${months} Month${months > 1 ? "s" : ""} Old`;
      } else {
        finalAge = `${ageValue} Month${ageValue > 1 ? "s" : ""} Old`;
      }
    } else {
      finalAge = `${ageValue} Year${ageValue > 1 ? "s" : ""} Old`;
    }
  }

  // ✅ APPLY TRANSFORM FIRST (DO NOT CHAIN)
  if (!editingPet) {
    form.transform((data) => ({
      ...data,
      age: finalAge,
    }));

    form.post("/pets", {
      forceFormData: true,
      onSuccess: () => closeForm(),
    });
  } else {
    form.transform((data) => ({
      ...data,
      age: finalAge,
      _method: "put", // ✅ IMPORTANT FOR UPDATE
    }));

    form.post(`/pets/${editingPet.id}`, {
      forceFormData: true,
      onSuccess: () => closeForm(),
    });
  }
}
function confirmDelete(p) {
  Swal.fire({
    icon: "warning",
    title: "Delete pet?",
    text: `This will delete ${p.pet_name} (${p.pet_uid}).`,
    showCancelButton: true,
    confirmButtonText: "Yes, delete",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      router.delete(`/pets/${p.id}`);
    }
  });
}


  // ✅ Age label: "6 months" / "12 months" / "1 year 2 months"
  // function displayAge(ageMonths) {
  //   if (ageMonths == null) return "—";
  //   const m = Math.max(0, Math.floor(ageMonths));
  //   if (m < 12) return `${m} months`;

  //   const years = Math.floor(m / 12);
  //   const rem = m % 12;

  //   if (rem === 0) return `${years} year${years > 1 ? "s" : ""}`;
  //   return `${years} year${years > 1 ? "s" : ""} ${rem} months`;
  // }

  // ✅ Pagination supports both shapes (pets.links OR pets.meta.links)
  const hasPets = (pets?.data?.length ?? 0) > 0;
  const links = pets?.links ?? pets?.meta?.links ?? [];
  const meta = pets?.meta ?? pets ?? {};
  const hasMultiplePages = links.length > 3;

  // ✅ Row offset continues across pages (reliable)
  const startIndex = meta?.from ? meta.from - 1 : 0;
const capitalizeWords = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};
function parseAgeForEdit(ageStr) {
  if (!ageStr) return { age_value: "", age_unit: "Years" };

  const s = String(ageStr).toLowerCase().replace("old", "").trim();

  // Matches:
  // "2 years"
  // "1 year 1 month"
  // "6 months"
  const yearMatch = s.match(/(\d+)\s*year/);
  const monthMatch = s.match(/(\d+)\s*month/);

  const years = yearMatch ? parseInt(yearMatch[1], 10) : 0;
  const months = monthMatch ? parseInt(monthMatch[1], 10) : 0;

  // If it contains years (even with months), show YEARS in edit input
  if (years > 0) {
    return { age_value: String(years), age_unit: "Years" };
  }

  // Otherwise show MONTHS
  if (months > 0) {
    return { age_value: String(months), age_unit: "Months" };
  }

  return { age_value: "", age_unit: "Years" };
}
  return (
    <AppLayout>
      {/* MINIMAL SQUARE IMAGE POPUP */}
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
        {/* SUMMARY */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="text-muted fw-bold">Total Pets</div>
                <div className="fs-3 fw-bold">{summary?.totalPets ?? 0}</div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="text-muted fw-bold">Total Dogs</div>
                <div className="fs-3 fw-bold">{summary?.totalDogs ?? 0}</div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="text-muted fw-bold">Total Cats</div>
                <div className="fs-3 fw-bold">{summary?.totalCats ?? 0}</div>
              </div>
            </div>
          </div>
        </div>

        {/* TOP CONTROLS */}
        <div className="card shadow-sm mb-3">
          <div className="card-body">
           <div className="row g-2 align-items-end">

  {/* SEARCH */}
  <div className="col-12 col-md-4">
    <label className="form-label">Search by Name / Pet ID / Breed</label>
    <input
      className="form-control"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Type Pet Name, DOG-2026-00001, Breed..."
    />
  </div>

  {/* SPECIES */}
  <div className="col-12 col-md-2">
    <label className="form-label">Filter</label>
    <select
      className="form-select"
      value={species}
      onChange={(e) => {
        setSpecies(e.target.value);
        setTimeout(() => applyFilters({ species: e.target.value }), 0);
      }}
    >
      <option value="">All</option>
      <option value="Dog">Dog</option>
      <option value="Cat">Cat</option>
    </select>
  </div>

  {/* SORT */}
  <div className="col-12 col-md-2">
    <label className="form-label">Sort</label>
    <select
      className="form-select"
      value={sort}
      onChange={(e) => {
        setSort(e.target.value);
        setTimeout(() => applyFilters({ sort: e.target.value }), 0);
      }}
    >
      <option value="newest">Newest</option>
      <option value="oldest">Oldest</option>
    </select>
  </div>

 {/* OWNER FILTER */}
<div className="col-12 col-md-3">
  <label className="form-label">Owner</label>

  <Select
    placeholder="Filter owner..."
    isSearchable
    isClearable
    options={options?.owners ?? []}
    value={
      owner
        ? (options?.owners ?? []).find((o) => String(o.id) === String(owner)) ?? null
        : null
    }
    getOptionLabel={(o) => o.label}
    getOptionValue={(o) => String(o.id)}
    onChange={(selected) => {
      const val = selected?.id ?? "";
      setOwner(val);
      setTimeout(() => applyFilters({ owner: val }), 0);
    }}
    styles={{
      control: (base) => ({
        ...base,
        minHeight: "38px",
      }),
    }}
  />
</div>

  {/* ADD BUTTON */}
  <div className="col-12 col-md-1 d-grid">
    <button
      className="btn btn-primary h-100"
      onClick={openAddForm}
    >
      + Add
    </button>
  </div>

</div>
          </div>
        </div>

        {/* ADD PET FORM */}
        {showForm && (
  <div ref={petFormRef} className="card shadow-sm mb-3">
           {/* <div className="card-header fw-bold">{editingPet ? "Edit Pet" : "Add Pet"}</div> */}
<div className="card-header fw-bold d-flex justify-content-between align-items-center">

  <span>
    {editingPet ? "Edit Pet" : "Add Pet"}
  </span>

  <button
    type="button"
    className="btn btn-success btn-sm"
    onClick={() => window.open('/pets/coupon/download')}
  >
    Download Form
  </button>

</div>
            <div className="card-body">
              <form onSubmit={submitPet}>
                <div className="row g-4">
                  {/* LEFT PHOTO */}
                  <div className="col-12 col-md-4">
                    <label className="form-label">Pet Photo</label>

                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        {/* Upload */}
                        <div className="mb-2">
                          <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0] ?? null;

                              if (file && !file.type.startsWith("image/")) {
                                Swal.fire({
                                  icon: "error",
                                  title: "Invalid file",
                                  text: "Image only.",
                                });
                                e.target.value = "";
                                form.setData("photo", null);
                                return;
                              }

                              form.setData("photo", file);
form.setData("remove_photo", false);

                              setPreviewImage((old) => {
                                if (old?.startsWith("blob:")) URL.revokeObjectURL(old);
                                return file ? URL.createObjectURL(file) : null;
                              });
                            }}
                          />
                          <small className="text-muted d-block mt-1">
                            Upload image (JPG/PNG) or use camera.
                          </small>
                        </div>

                        <div className="d-flex align-items-center gap-2 my-2">
                          <div className="flex-grow-1 border-top" />
                          <span className="text-muted small">OR</span>
                          <div className="flex-grow-1 border-top" />
                        </div>

                        {/* Camera Buttons */}
                        <div className="d-grid gap-2">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={openCamera}
                            disabled={startingCamera}
                          >
                            {startingCamera ? "Opening Camera..." : "Open Camera"}
                          </button>

                          {previewImage && (
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => {
  form.setData("photo", null);
  form.setData("remove_photo", true); // ✅ IMPORTANT

  setPreviewImage((old) => {
    if (old?.startsWith("blob:")) URL.revokeObjectURL(old);
    return null;
  });
}}

                            >
                              Remove Photo
                            </button>
                          )}
                        </div>

                        {/* Preview */}
                        <div className="mt-3 d-flex justify-content-center">
                          {previewImage ? (
                            <img
                              src={previewImage}
                              alt="preview"
                              style={{
                                width: 190,
                                height: 190,
                                objectFit: "cover",
                                borderRadius: 16,
                                border: "1px solid #e5e5e5",
                              }}
                            />
                          ) : (
                            <div
                              className="d-flex flex-column justify-content-center align-items-center text-muted"
                              style={{
                                width: 190,
                                height: 190,
                                borderRadius: 16,
                                border: "1px dashed #cfcfcf",
                              }}
                            >
                              <div className="fw-semibold">No Photo</div>
                              <div className="small">Upload or Camera</div>
                            </div>
                          )}
                        </div>

                        {form.errors.photo && (
                          <div className="text-danger small mt-2">{form.errors.photo}</div>
                        )}

                        <canvas ref={canvasRef} style={{ display: "none" }} />

                        {/* ✅ Camera Modal */}
                        {cameraOpen && (
                          <div
                            className="position-fixed top-0 start-0 w-100 h-100"
                            style={{ background: "rgba(0,0,0,0.6)", zIndex: 2000 }}
                            onClick={stopCamera}
                          >
                            <div
                              className="position-absolute top-50 start-50 translate-middle bg-white rounded-4 shadow"
                              style={{ width: "min(92vw, 520px)" }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
                                <div className="fw-bold">Camera Preview</div>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={stopCamera}
                                >
                                  ✕
                                </button>
                              </div>

                              <div className="p-3">
                                <video
                                  ref={videoRef}
                                  autoPlay
                                  playsInline
                                  muted
                                  style={{
                                    width: "100%",
                                    borderRadius: 16,
                                    background: "#000",
                                    maxHeight: 360,
                                    objectFit: "cover",
                                    transform: cameraFacing === "user" ? "scaleX(-1)" : "none",
                                  }}
                                />

                                <div className="d-flex gap-2 mt-3">
                                  <button
                                    type="button"
                                    className="btn btn-success w-100"
                                    onClick={capturePhoto}
                                    disabled={startingCamera}
                                  >
                                    {startingCamera ? "Loading..." : "Capture Photo"}
                                  </button>
                                  {isMobile && (
  <button
    type="button"
    className="btn btn-warning w-100"
    onClick={() => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }

      setCameraFacing(prev =>
        prev === "user" ? "environment" : "user"
      );

      setCameraOpen(false);
      setTimeout(() => setCameraOpen(true), 200);
    }}
  >
    Switch Camera
  </button>
)}
                                  <button
                                    type="button"
                                    className="btn btn-secondary w-100"
                                    onClick={stopCamera}
                                  >
                                    Cancel
                                  </button>
                                </div>

                                <small className="text-muted d-block mt-2">
                                  Tip: click outside the modal to close camera.
                                </small>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT INPUTS */}
                  <div className="col-12 col-md-8">
                    <div className="row g-3">
                     <div className="col-12 col-md-6">
  <label className="form-label">Pet Name</label>

  <input
    className={`form-control ${form.errors.pet_name ? "is-invalid" : ""}`}
    value={form.data.pet_name}
    onChange={(e) => form.setData("pet_name", e.target.value)}
  />

  {form.errors.pet_name && (
    <div className="invalid-feedback d-block">
      {form.errors.pet_name}
    </div>
  )}
</div>

                      <div className="col-12 col-md-6">
  <label className="form-label">Paid Under OR No.</label>

  <input
    className={`form-control ${form.errors.or_number ? "is-invalid" : ""}`}
    value={form.data.or_number}
    onChange={(e) => form.setData("or_number", e.target.value)}
  />

  {form.errors.or_number && (
    <div className="invalid-feedback d-block">
      {form.errors.or_number}
    </div>
  )}
</div>

                      <div className="col-12">
                        <div className="alert alert-light border mb-0">
                          <div className="alert alert-light border mb-0">
 <div className="small">
  <b>Pet ID:</b>{" "}
  <b className="ms-1">
    {loadingPreview ? "Loading..." : (previewIds.pet_uid || "Select species...")}
  </b>
  <br />
  <b>Registration No.:</b>{" "}
  <b>
    {loadingPreview ? "Loading..." : (previewIds.registration_no || "—")}
  </b>
</div>

</div>

                        </div>
                      </div>

                      <div className="col-12 col-md-6">
  <label className="form-label">Species</label>

  <select
    className={`form-select ${form.errors.species ? "is-invalid" : ""}`}
    value={form.data.species}
    onChange={(e) => {
      const val = e.target.value;
      form.setData("species", val);
      loadPreviewId(val);
    }}
  >
    <option value="">Select Species</option>
    <option value="Dog">Dog</option>
    <option value="Cat">Cat</option>
  </select>

  {form.errors.species && (
    <div className="invalid-feedback d-block">
      {form.errors.species}
    </div>
  )}
</div>
<div className="col-12 col-md-6">
  <label className="form-label">Breed</label>

  <div className="position-relative">
    {breedMode === "select" ? (
      <select
        className={`form-select ${form.errors.breed ? "is-invalid" : ""}`}
        value={form.data.breed}
        onChange={(e) => {
          const val = e.target.value;

          if (val === "Other") {
            setBreedMode("custom");
            form.setData("breed", "");
          } else {
            form.setData("breed", val);
          }
        }}
      >
        <option value="">Select Breed</option>
        <option value="Puspin">Puspin</option>
        <option value="Aspin">Aspin</option>
        <option value="Other">Other</option>
      </select>
    ) : (
      <>
        <input
          type="text"
          className={`form-control pe-5 ${form.errors.breed ? "is-invalid" : ""}`}
          placeholder="Enter breed"
          value={form.data.breed}
          onChange={(e) => form.setData("breed", e.target.value)}
        />

        <button
          type="button"
          onClick={() => {
            setBreedMode("select");
            form.setData("breed", "");
          }}
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            border: "none",
            background: "transparent",
            fontSize: 18,
            cursor: "pointer",
            color: "#999",
          }}
        >
          ✕
        </button>
      </>
    )}
  </div>

  {form.errors.breed && (
    <div className="invalid-feedback d-block">
      {form.errors.breed}
    </div>
  )}
</div>

                 <div className="col-12 col-md-6">
  <label className="form-label">Age</label>

  <div className="input-group">
    {/* Number */}
    <input
      type="number"
      min="0"
      className="form-control"
      placeholder="Enter age"
      value={form.data.age_value || ""}
      onChange={(e) => form.setData("age_value", e.target.value)}
    />

    {/* Unit */}
   <select
  className="form-select"
  style={{ maxWidth: "140px" }}
  value={form.data.age_unit ?? "Years"}
  onChange={(e) => form.setData("age_unit", e.target.value)}
>
  <option value="Years">Years</option>
  <option value="Months">Months</option>
</select>
  </div>

  {form.errors.age_value && (
    <div className="text-danger small">{form.errors.age_value}</div>
  )}
</div>

<div className="col-12 col-md-6">
  <label className="form-label">
    Gender <span className="text-danger">*</span>
  </label>

  <select
    className={`form-select ${form.errors.gender ? "is-invalid" : ""}`}
    value={form.data.gender}
    onChange={(e) => form.setData("gender", e.target.value)}
  >
    <option value="">Select Gender</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
  </select>

  {form.errors.gender && (
    <div className="invalid-feedback d-block">
      {form.errors.gender}
    </div>
  )}
</div>
<div className="col-12 col-md-6">
  <label className="form-label">Sterilized</label>

  <select
    className="form-select"
    value={form.data.sterilized}
    onChange={(e) => form.setData("sterilized", e.target.value)}
  >
    <option value="">Select</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>

                     <div className="col-12 col-md-6">
  <label className="form-label">Color</label>

  <input
    className={`form-control ${form.errors.color ? "is-invalid" : ""}`}
    value={form.data.color}
    onChange={(e) => form.setData("color", e.target.value)}
  />

  {form.errors.color && (
    <div className="invalid-feedback d-block">
      {form.errors.color}
    </div>
  )}
</div>

                      <div className="col-12 col-md-6">
                        <label className="form-label">Markings</label>
                        <input
                          className="form-control"
                          value={form.data.markings}
                          onChange={(e) => form.setData("markings", e.target.value)}
                        />
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="form-label">Confinement Status</label>
                        <select
                          className="form-select"
                          value={form.data.confinement_status}
                          onChange={(e) => form.setData("confinement_status", e.target.value)}
                        >
                          <option value="">Select Status</option>
                          <option value="Bound">Bound</option>
                          <option value="Sometimes">Sometimes</option>
                          <option value="Free">Free</option>
                        </select>
                      </div>

                      {/* OWNER SEARCHABLE */}
                     <div className="col-12 col-md-6">
  <label className="form-label">Owner (Searchable)</label>

  <Select
    isSearchable
    isClearable
    placeholder="Search owner..."
    value={
      form.data.owner_id
        ? (options?.owners ?? []).find((x) => x.id === form.data.owner_id) ?? null
        : null
    }
    options={options?.owners ?? []}
    getOptionLabel={(o) => o.label}
    getOptionValue={(o) => String(o.id)}
    onChange={(selected) =>
      form.setData("owner_id", selected?.id ?? null)
    }
    styles={{
      control: (base, state) => ({
        ...base,
        minHeight: "38px",
        borderColor: form.errors.owner_id
          ? "#dc3545" // red
          : base.borderColor,
        boxShadow: form.errors.owner_id
          ? "0 0 0 1px #dc3545"
          : base.boxShadow,
        "&:hover": {
          borderColor: form.errors.owner_id
            ? "#dc3545"
            : base.borderColor,
        },
      }),
    }}
  />

  {form.errors.owner_id && (
    <div className="invalid-feedback d-block">
      {form.errors.owner_id}
    </div>
  )}
</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 d-flex gap-2">
                  <button className="btn btn-success" disabled={form.processing}>
  {editingPet ? "Update Pet" : "Save Pet"}
</button>

                  <button type="button" className="btn btn-secondary" onClick={closeForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* PETS TABLE */}
        <div className="card shadow-sm">
          <div className="card-header fw-bold">Pets</div>
          <div className="card-body p-0">
            <div className="table-responsive">
             <table className="table table-hover mb-0 align-middle text-center">
                <thead>
                  <tr>
                    <th style={{ width: 60 }}>#</th>
                    <th style={{ width: 90 }}>Photo</th>
                    <th>Pet ID</th>
                    <th>Reg No</th>
                    <th>Pet Name</th>
                    <th>Date Registered</th>
                    <th>Species</th>
                    <th>Breed</th>
                    <th>Age</th>
                    <th>Sterilized</th>
                    <th style={{ width: 120 }}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {hasPets ? (
                    pets.data.map((p, idx) => (
                      <tr key={p.id}>
                        <td className="fw-semibold">{startIndex + idx + 1}</td>

                        <td>
                          {p.photo_path ? (

//                               <img
//   src={`/storage/${p.photo_path}`}
//   alt="pet"
//   style={{
//     width: 56,
//     height: 56,
//     borderRadius: 14,
//     objectFit: "cover",
//     border: "1px solid #eee",
//     cursor: "pointer"
//   }}
//   onClick={() => setViewImage(`/storage/${p.photo_path}`)}
// />
  <img
    src={
      p.photo_path.startsWith("http")
        ? p.photo_path
        : `/storage/${p.photo_path}`
    }
    alt="pet"
    style={{
      width: 56,
      height: 56,
      borderRadius: 14,
      objectFit: "cover",
      border: "1px solid #eee",
      cursor: "pointer"
    }}
    onClick={() =>
      setViewImage(
        p.photo_path.startsWith("http")
          ? p.photo_path
          : `/storage/${p.photo_path}`
      )
    }
  />
) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>

                        <td className="fw-semibold">{p.pet_uid}</td>
                        <td>{p.registration_no}</td>
                        <td>{capitalizeWords(p.pet_name)}</td>
                        <td>{p.date_registered ?? "—"}</td>
                        <td>{p.species}</td>
                        <td>{capitalizeWords(p.breed ?? "—")}</td>
                        <td>{capitalizeWords(p.age ?? "—")}</td>
  <td>
              
                      {p.sterilized}
                
                </td>
                        <td>
  <div className="d-flex gap-2">
    <button className="btn btn-warning btn-sm" onClick={() => openEditForm(p)}>
      Edit
    </button>

    <button
  type="button"
  className="btn btn-primary btn-sm"
  onClick={() => router.get(`/pets/${p.id}`)}
>
  View
</button>


    <button className="btn btn-danger btn-sm" onClick={() => confirmDelete(p)}>
      Delete
    </button>
  </div>
</td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="text-center p-4 text-muted">
                        No pets found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ✅ Pagination (supports both links shapes) */}
            {hasPets && hasMultiplePages && (
              <div className="p-3 d-flex justify-content-end gap-2">
                {links.map((l, i) => (
                  <button
                    key={i}
                    className={`btn btn-sm ${l.active ? "btn-primary" : "btn-outline-primary"}`}
                    disabled={!l.url}
                    onClick={() => l.url && router.get(l.url, {}, { preserveState: true })}
                    dangerouslySetInnerHTML={{ __html: l.label }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
