
// import AppLayout from "@/layouts/app-layout";
// import React from "react";

// import { router, useForm, usePage } from "@inertiajs/react";
// import Swal from "sweetalert2";
// import Select from "react-select";

// export default function OwnersDashboard() {
//   const { owners, filters, summary, options, flash } = usePage().props;

//   const [showForm, setShowForm] = React.useState(false);

//   React.useEffect(() => {
//     if (flash?.success) {
//       Swal.fire({
//         icon: "success",
//         title: flash.success,
//         timer: 1400,
//         showConfirmButton: false,
//       });
//     }
//   }, [flash]);

//   // Filters state
//   const [search, setSearch] = React.useState(filters?.search ?? "");
//   const [barangay, setBarangay] = React.useState(filters?.barangay ?? "");
//   const [sort, setSort] = React.useState(filters?.sort ?? "newest");

//   // ✅ Live search debounce (auto apply while typing)
//   React.useEffect(() => {
//     const t = setTimeout(() => {
//       applyFilters({ search });
//     }, 400);

//     return () => clearTimeout(t);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [search]);

//   function applyFilters(next = {}) {
//     router.get(
//       "/owners",
//       {
//         search,
//         barangay,
//         sort,
//         ...next,
//       },
//       { preserveState: true, replace: true }
//     );
//   }

//   // Add Owner form
//   const form = useForm({
//     photo: null,
//     first_name: "",
//     middle_name: "",
//     last_name: "",
//     address: "",
//     barangay: "",
//     civil_status: "",
//     sex: "",
//     contact_number: "",
//   });

//   function submitOwner(e) {
//     e.preventDefault();
//     form.post("/owners", {
//       forceFormData: true,
//       onSuccess: () => {
//         form.reset();
//         setShowForm(false);
//       },
//     });
//   }

//   function confirmDelete(owner) {
//     Swal.fire({
//       icon: "warning",
//       title: "Delete owner?",
//       text: `This will delete ${owner.first_name} ${owner.last_name}.`,
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete",
//       cancelButtonText: "Cancel",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         router.delete(`/owners/${owner.id}`);
//       }
//     });
//   }

//   // ✅ photo styles (circle + bigger)
//   const photoSize = 56; // change size here (px)
//   const photoStyle = {
//     width: photoSize,
//     height: photoSize,
//     objectFit: "cover",
//     borderRadius: "50%",
//     display: "block",
//   };

//   const hasOwners = (owners?.data?.length ?? 0) > 0;
//   const hasMultiplePages = (owners?.links?.length ?? 0) > 3; // typical: Prev + pages + Next

//   return (
//     <AppLayout>
//       <div className="container-fluid p-4">

    
//         {/* SUMMARY CARDS */}
//         <div className="row g-3 mb-4">
//           <div className="col-12 col-md-3">
//             <div className="card shadow-sm">
//               <div className="card-body">
//                 <div className="text-muted">Total Owners</div>
//                 <div className="fs-3 fw-bold">{summary?.totalOwners ?? 0}</div>
//               </div>
//             </div>
//           </div>
//           <div className="col-12 col-md-3">
//             <div className="card shadow-sm">
//               <div className="card-body">
//                 <div className="text-muted">Total Pets</div>
//                 <div className="fs-3 fw-bold">{summary?.totalPets ?? 0}</div>
//               </div>
//             </div>
//           </div>
//           <div className="col-12 col-md-3">
//             <div className="card shadow-sm">
//               <div className="card-body">
//                 <div className="text-muted">Total Dogs</div>
//                 <div className="fs-3 fw-bold">{summary?.totalDogs ?? 0}</div>
//               </div>
//             </div>
//           </div>
//           <div className="col-12 col-md-3">
//             <div className="card shadow-sm">
//               <div className="card-body">
//                 <div className="text-muted">Total Cats</div>
//                 <div className="fs-3 fw-bold">{summary?.totalCats ?? 0}</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* FILTERS */}
//         <div className="card shadow-sm mb-3">
//           <div className="card-body">
//             <div className="row g-2 align-items-end">
//               <div className="col-12 col-md-4">
//                 <label className="form-label">Search by Owner Name / Owner ID</label>
//                 <input
//                   className="form-control"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   placeholder="Type name or OWNER-YYYY-00001"
//                 />
//               </div>

//               {/* <div className="col-12 col-md-3">
//                 <label className="form-label">Filter by Barangay</label>
//                 <select
//                   className="form-select"
//                   value={barangay}
//                   onChange={(e) => {
//                     setBarangay(e.target.value);
//                     setTimeout(() => applyFilters({ barangay: e.target.value }), 0);
//                   }}
//                 >
//                   <option value="">All</option>
//                   {options?.barangay?.map((b) => (
//                     <option key={b} value={b}>
//                       {b}
//                     </option>
//                   ))}
//                 </select>
//               </div> */}
// <div className="col-12 col-md-3">
//   <label className="form-label">Filter by Barangay</label>

//   <Select
//     isClearable
//     isSearchable
//     placeholder="All barangay..."
//     value={barangay ? { value: barangay, label: barangay } : null}
//     options={(options?.barangay ?? []).map((b) => ({ value: b, label: b }))}
//     onChange={(selected) => {
//       const val = selected?.value ?? "";
//       setBarangay(val);
//       setTimeout(() => applyFilters({ barangay: val }), 0);
//     }}
//     styles={{
//       control: (base) => ({
//         ...base,
//         minHeight: "38px", // match bootstrap height
//       }),
//     }}
//   />
// </div>

//               <div className="col-12 col-md-3">
//                 <label className="form-label">Sort</label>
//                 <select
//                   className="form-select"
//                   value={sort}
//                   onChange={(e) => {
//                     setSort(e.target.value);
//                     setTimeout(() => applyFilters({ sort: e.target.value }), 0);
//                   }}
//                 >
//                   <option value="newest">Newest</option>
//                   <option value="oldest">Oldest</option>
//                 </select>
//               </div>

//               <div className="col-12 col-md-2 d-grid">
//                 <button className="btn btn-primary" onClick={() => setShowForm(true)}>
//                   + Add Owner
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ADD OWNER FORM */}
//         {showForm && (
//           <div className="card shadow-sm mb-3">
//             <div className="card-header fw-bold">Add Owner</div>
//             <div className="card-body">
//               <form onSubmit={submitOwner}>
//                 <div className="row g-3">
//                   <div className="col-12 col-md-4">
//                     <label className="form-label">Owner Photo</label>
//                     <input
//                       type="file"
//                       className="form-control"
//                       accept="image/*" // ✅ images only (no video)
//                       required // ✅ required on browser-level
//                       onChange={(e) => {
//                         const file = e.target.files?.[0] ?? null;

//                         // extra safety: block non-image
//                         if (file && !file.type.startsWith("image/")) {
//                           Swal.fire({
//                             icon: "error",
//                             title: "Invalid file",
//                             text: "Please upload an image only (jpg, png, etc).",
//                           });
//                           e.target.value = "";
//                           form.setData("photo", null);
//                           return;
//                         }

//                         form.setData("photo", file);
//                       }}
//                     />
//                     {/* ✅ required validation (server-side) */}
//                     {form.errors.photo && <div className="text-danger small">{form.errors.photo}</div>}
//                     {!form.errors.photo && (
//                       <div className="text-muted small mt-1">Accepted: JPG, PNG, WEBP</div>
//                     )}
//                   </div>

//                   <div className="col-12 col-md-4">
//                     <label className="form-label">First Name</label>
//                     <input
//                       className="form-control"
//                       value={form.data.first_name}
//                       onChange={(e) => form.setData("first_name", e.target.value)}
//                     />
//                     {form.errors.first_name && (
//                       <div className="text-danger small">{form.errors.first_name}</div>
//                     )}
//                   </div>

//                   <div className="col-12 col-md-4">
//                     <label className="form-label">Middle Name</label>
//                     <input
//                       className="form-control"
//                       value={form.data.middle_name}
//                       onChange={(e) => form.setData("middle_name", e.target.value)}
//                     />
//                   </div>

//                   <div className="col-12 col-md-4">
//                     <label className="form-label">Last Name</label>
//                     <input
//                       className="form-control"
//                       value={form.data.last_name}
//                       onChange={(e) => form.setData("last_name", e.target.value)}
//                     />
//                     {form.errors.last_name && (
//                       <div className="text-danger small">{form.errors.last_name}</div>
//                     )}
//                   </div>

//                   <div className="col-12 col-md-8">
//                     <label className="form-label">Address</label>
//                     <input
//                       className="form-control"
//                       value={form.data.address}
//                       onChange={(e) => form.setData("address", e.target.value)}
//                     />
//                     {form.errors.address && <div className="text-danger small">{form.errors.address}</div>}
//                   </div>

//                   {/* Dropdowns */}
//                   {/* <div className="col-12 col-md-4">
//                     <label className="form-label">Barangay</label>
//                     <select
//                       className="form-select"
//                       value={form.data.barangay}
//                       onChange={(e) => form.setData("barangay", e.target.value)}
//                     >
//                       <option value="">Select Barangay</option>
//                       {options?.barangay?.map((b) => (
//                         <option key={b} value={b}>
//                           {b}
//                         </option>
//                       ))}
//                     </select>
//                     {form.errors.barangay && <div className="text-danger small">{form.errors.barangay}</div>}
//                   </div> */}
// <div className="col-12 col-md-4">
//   <label className="form-label">Barangay</label>

//   <Select
//     isSearchable
//     placeholder="Select Barangay..."
//     value={
//       form.data.barangay
//         ? { value: form.data.barangay, label: form.data.barangay }
//         : null
//     }
//     options={(options?.barangay ?? []).map((b) => ({ value: b, label: b }))}
//     onChange={(selected) => form.setData("barangay", selected?.value ?? "")}
//     styles={{
//       control: (base) => ({
//         ...base,
//         minHeight: "38px",
//       }),
//     }}
//   />

//   {form.errors.barangay && (
//     <div className="text-danger small">{form.errors.barangay}</div>
//   )}
// </div>

//                   <div className="col-12 col-md-4">
//                     <label className="form-label">Civil Status</label>
//                     <select
//                       className="form-select"
//                       value={form.data.civil_status}
//                       onChange={(e) => form.setData("civil_status", e.target.value)}
//                     >
//                       <option value="">Select Civil Status</option>
//                       {options?.civilStatus?.map((c) => (
//                         <option key={c} value={c}>
//                           {c}
//                         </option>
//                       ))}
//                     </select>
//                     {form.errors.civil_status && (
//                       <div className="text-danger small">{form.errors.civil_status}</div>
//                     )}
//                   </div>

//                   <div className="col-12 col-md-4">
//                     <label className="form-label">Sex</label>
//                     <select
//                       className="form-select"
//                       value={form.data.sex}
//                       onChange={(e) => form.setData("sex", e.target.value)}
//                     >
//                       <option value="">Select Sex</option>
//                       {options?.sex?.map((s) => (
//                         <option key={s} value={s}>
//                           {s}
//                         </option>
//                       ))}
//                     </select>
//                     {form.errors.sex && <div className="text-danger small">{form.errors.sex}</div>}
//                   </div>

//                   <div className="col-12 col-md-4">
//                     <label className="form-label">Contact Number</label>
//                     <input
//                       className="form-control"
//                       value={form.data.contact_number}
//                       onChange={(e) => form.setData("contact_number", e.target.value)}
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-3 d-flex gap-2">
//                   <button className="btn btn-success" disabled={form.processing}>
//                     Save Owner
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-secondary"
//                     onClick={() => {
//                       form.reset();
//                       setShowForm(false);
//                     }}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* OWNERS TABLE */}
//         <div className="card shadow-sm">
//           <div className="card-header fw-bold">Owners</div>
//           <div className="card-body p-0">
//             <div className="table-responsive">
//               <table className="table table-striped table-hover mb-0 align-middle">
//                 <thead>
//                   <tr>
//                     <th style={{ width: 50 }}>#</th>
//                     <th>Owner ID</th>
//                     <th>Photo</th>
//                     <th>First Name</th>
//                     <th>Middle Name</th>
//                     <th>Last name</th>
//                     <th>Address</th>
//                     <th>Civil Status</th>
//                     <th>Barangay</th>
//                     <th>Sex</th>
//                     <th>Contact Number</th>
//                     <th>Pets</th>
//                     <th style={{ width: 160 }}>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {hasOwners ? (
//                     owners.data.map((o, idx) => (
//                       <tr key={o.id}>
//                         <td>{idx + 1}</td>
//                         <td className="fw-semibold">{o.owner_uid}</td>
//                         <td>
//                           {o.photo_path ? (
//                             <img
//                               src={`/storage/${o.photo_path}`}
//                               alt="owner"
//                               style={photoStyle} // ✅ circle + size
//                             />
//                           ) : (
//                             <span className="text-muted">—</span>
//                           )}
//                         </td>
//                         <td>{o.first_name}</td>
//                         <td>{o.middle_name ?? ""}</td>
//                         <td>{o.last_name}</td>
//                         <td>{o.address}</td>
//                         <td>{o.civil_status}</td>
//                         <td>{o.barangay}</td>
//                         <td>{o.sex}</td>
//                         <td>{o.contact_number ?? ""}</td>
//                         <td>{o.pets_count ?? 0}</td>
//                         <td>
//                           <div className="d-flex gap-2">
//                             <button className="btn btn-primary btn-sm">View</button>
//                             <button className="btn btn-danger btn-sm" onClick={() => confirmDelete(o)}>
//                               Delete
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="13" className="text-center p-4 text-muted">
//                         No owners found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* ✅ Pagination: hide if no owners / or only 1 page */}
//             {hasOwners && hasMultiplePages && (
//               <div className="p-3 d-flex justify-content-end gap-2">
//                 {owners?.links?.map((l, i) => (
//                   <button
//                     key={i}
//                     className={`btn btn-sm ${l.active ? "btn-primary" : "btn-outline-primary"}`}
//                     disabled={!l.url}
//                     onClick={() => l.url && router.get(l.url, {}, { preserveState: true })}
//                     dangerouslySetInnerHTML={{ __html: l.label }}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

      
//       </div>
//     </AppLayout>
//   );
// }


// import AppLayout from "@/components/app-layout";
import AppLayout from "@/layouts/app-layout";
import React from "react";

import { router, useForm, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import Select from "react-select";

export default function OwnersDashboard() {
  const { owners, filters, summary, options, flash } = usePage().props;

  const [showForm, setShowForm] = React.useState(false);

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

  // Filters state
  const [search, setSearch] = React.useState(filters?.search ?? "");
  const [barangay, setBarangay] = React.useState(filters?.barangay ?? "");
  const [sort, setSort] = React.useState(filters?.sort ?? "newest");

  // ✅ Live search debounce (auto apply while typing)
  React.useEffect(() => {
    const t = setTimeout(() => {
      applyFilters({ search });
    }, 400);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function applyFilters(next = {}) {
    router.get(
      "/owners",
      {
        search,
        barangay,
        sort,
        ...next,
      },
      { preserveState: true, replace: true }
    );
  }

  // Add Owner form
  const form = useForm({
    photo: null,
      remove_photo: false,
    first_name: "",
    middle_name: "",
    last_name: "",
    address: "",
    barangay: "",
    civil_status: "",
    sex: "",
    contact_number: "",
  });

function submitOwner(e) {
  e.preventDefault();

  // ✅ ADD
  if (!editingOwner) {
    form.post("/owners", {
      forceFormData: true,
      onSuccess: () => {
        Swal.fire({
          icon: "success",
          title: "Owner added successfully!",
          timer: 1400,
          showConfirmButton: false,
        });
        closeForm();
      },
    });
    return;
  }

  // ✅ UPDATE
  // form.put(`/owners/${editingOwner.id}`, {
  //   forceFormData: true,
  //   onSuccess: () => {
  //     Swal.fire({
  //       icon: "success",
  //       title: "Owner updated successfully!",
  //       timer: 1400,
  //       showConfirmButton: false,
  //     });
  //     closeForm();
  //   },
  // });
  form
  .transform((data) => ({
    ...data,
    _method: "put",
  }))
  .post(`/owners/${editingOwner.id}`, {
    forceFormData: true,
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Owner updated successfully!",
        timer: 1400,
        showConfirmButton: false,
      });
      closeForm();
    },
  });
}




  function confirmDelete(owner) {
    Swal.fire({
      icon: "warning",
      title: "Delete owner?",
      text: `This will delete ${owner.first_name} ${owner.last_name}.`,
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(`/owners/${owner.id}`);
      }
    });
  }

  // ✅ photo styles (circle + bigger)
  const photoSize = 56; // change size here (px)
  const photoStyle = {
    width: photoSize,
    height: photoSize,
    objectFit: "cover",
    borderRadius: "50%",
    display: "block",
  };

  const hasOwners = (owners?.data?.length ?? 0) > 0;
  const hasMultiplePages = (owners?.links?.length ?? 0) > 3; // typical: Prev + pages + Next

  // =========================
  // ✅ CAMERA (NO BLACK PREVIEW)
  // =========================
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const streamRef = React.useRef(null);
const ownerFormRef = React.useRef(null);
  const [cameraOpen, setCameraOpen] = React.useState(false);
  const [startingCamera, setStartingCamera] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState(null);
const [viewImage, setViewImage] = React.useState(null);

  // Open modal first (so <video> exists), then attach stream in effect
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
function scrollToOwnerForm() {
  setTimeout(() => {
    ownerFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, 50);
}
  React.useEffect(() => {
    let cancelled = false;

    async function attachStream() {
      if (!cameraOpen) return;

      try {
        setStartingCamera(true);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user", // change to "environment" for back cam (mobile)
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

        // wait for metadata then play
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
  }, [cameraOpen]);

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
  ctx.translate(w, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, w, h);

  canvas.toBlob(
    (blob) => {
      if (!blob) return;

      const file = new File([blob], "owner_photo.jpg", { type: "image/jpeg" });
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

  // Close camera when form closes/unmounts
  React.useEffect(() => {
    if (!showForm) stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showForm]);

  React.useEffect(() => {
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
const [editingOwner, setEditingOwner] = React.useState(null); // null = Add mode, object = Edit mode
function openEditForm(owner) {
  setEditingOwner(owner);
  form.clearErrors();

  form.setData({
    photo: null,
     remove_photo: false, //
    first_name: owner.first_name ?? "",
    middle_name: owner.middle_name ?? "",
    last_name: owner.last_name ?? "",
    address: owner.address ?? "",
    barangay: owner.barangay ?? "",
    civil_status: owner.civil_status ?? "",
    sex: owner.sex ?? "",
    contact_number: owner.contact_number ?? "",
  });

  // show existing photo in preview
  setPreviewImage((old) => {
    if (old && old.startsWith("blob:")) URL.revokeObjectURL(old);
    return owner.photo_path ? `/storage/${owner.photo_path}` : null;
  });

    setShowForm(true);
  scrollToOwnerForm(); 
}

function closeForm() {
  stopCamera();
  form.reset();
  form.clearErrors();
  setEditingOwner(null);

  setPreviewImage((old) => {
    if (old && old.startsWith("blob:")) URL.revokeObjectURL(old);
    return null;
  });

  setShowForm(false);
}
const capitalizeWords = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};
  return (
    <AppLayout>
      {/* IMAGE VIEW MODAL */}
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
        {/* SUMMARY CARDS */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="text-muted fw-bold">Total Owners</div>
                <div className="fs-3 fw-bold">{summary?.totalOwners ?? 0}</div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="text-muted fw-bold">Total Pets</div>
                <div className="fs-3 fw-bold">{summary?.totalPets ?? 0}</div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="text-muted fw-bold">Total Dogs</div>
                <div className="fs-3 fw-bold">{summary?.totalDogs ?? 0}</div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="text-muted fw-bold">Total Cats</div>
                <div className="fs-3 fw-bold">{summary?.totalCats ?? 0}</div>
              </div>
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="card shadow-sm mb-3">
          <div className="card-body">
            <div className="row g-2 align-items-end">
              <div className="col-12 col-md-4">
                <label className="form-label">Search by Owner Name / Owner ID</label>
                <input
                  className="form-control"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Type name or OWNER-YYYY-00001"
                />
              </div>

              <div className="col-12 col-md-3">
                <label className="form-label">Filter by Barangay</label>
                <Select
                  isClearable
                  isSearchable
                  placeholder="All barangay..."
                  value={barangay ? { value: barangay, label: barangay } : null}
                  options={(options?.barangay ?? []).map((b) => ({ value: b, label: b }))}
                  onChange={(selected) => {
                    const val = selected?.value ?? "";
                    setBarangay(val);
                    setTimeout(() => applyFilters({ barangay: val }), 0);
                  }}
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: "38px",
                    }),
                  }}
                />
              </div>

              <div className="col-12 col-md-3">
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

              <div className="col-12 col-md-2 d-grid">
                <button
  className="btn btn-primary"
  onClick={() => {
    setEditingOwner(null);
    form.reset();
    form.clearErrors();
    setPreviewImage((old) => {
      if (old && old.startsWith("blob:")) URL.revokeObjectURL(old);
      return null;
    });
  setShowForm(true);
scrollToOwnerForm();
  }}
>
  + Add Owner
</button>

              </div>
            </div>
          </div>
        </div>

        {/* ADD OWNER FORM */}
       {showForm && (
  <div ref={ownerFormRef} className="card shadow-sm mb-3">
          <div className="card-header fw-bold d-flex justify-content-between align-items-center">

  <span>
    {editingOwner ? "Edit Owner" : "Add Owner"}
  </span>

  <button
    type="button"
    className="btn btn-success btn-sm"
    onClick={() => window.open('/owners/coupon/download', '_blank')}
  >
    Download Form
  </button>

</div>

            <div className="card-body">
              <form onSubmit={submitOwner}>
                {/* ✅ LEFT PHOTO + RIGHT INPUTS */}
                <div className="row g-4">
                  {/* LEFT: PHOTO */}
                  <div className="col-12 col-md-4">
                    <label className="form-label">Owner Photo</label>

                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        {/* Upload */}
                        <div className="mb-3">
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
                                  text: "Please upload an image only.",
                                });
                                e.target.value = "";
                                form.setData("photo", null);
                                return;
                              }

                              form.setData("photo", file);
form.setData("remove_photo", false); // ✅ ADD

                              setPreviewImage((old) => {
                                if (old) URL.revokeObjectURL(old);
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
  form.setData("remove_photo", true); // ✅ IMPORTANT: forces required photo on save

  setPreviewImage((old) => {
    if (old && old.startsWith("blob:")) URL.revokeObjectURL(old);
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
                      </div>
                    </div>

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
                                transform: "scaleX(-1)",
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
                              <button type="button" className="btn btn-secondary w-100" onClick={stopCamera}>
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

                  {/* RIGHT: INPUTS */}
                  <div className="col-12 col-md-8">
                    <div className="row g-3">
                      <div className="col-12 col-md-6">
                        <label className="form-label">First Name</label>
                        <input
                          className="form-control"
                          value={form.data.first_name}
                          onChange={(e) => form.setData("first_name", e.target.value)}
                        />
                        {form.errors.first_name && (
                          <div className="text-danger small">{form.errors.first_name}</div>
                        )}
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="form-label">Middle Name</label>
                        <input
                          className="form-control"
                          value={form.data.middle_name}
                          onChange={(e) => form.setData("middle_name", e.target.value)}
                        />
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="form-label">Last Name</label>
                        <input
                          className="form-control"
                          value={form.data.last_name}
                          onChange={(e) => form.setData("last_name", e.target.value)}
                        />
                        {form.errors.last_name && (
                          <div className="text-danger small">{form.errors.last_name}</div>
                        )}
                      </div>

                      <div className="col-12">
                        <label className="form-label">Address</label>
                        <input
                          className="form-control"
                          value={form.data.address}
                          onChange={(e) => form.setData("address", e.target.value)}
                        />
                        {form.errors.address && (
                          <div className="text-danger small">{form.errors.address}</div>
                        )}
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="form-label">Barangay</label>
                        <Select
                          isSearchable
                          placeholder="Select Barangay..."
                          value={
                            form.data.barangay
                              ? { value: form.data.barangay, label: form.data.barangay }
                              : null
                          }
                          options={(options?.barangay ?? []).map((b) => ({ value: b, label: b }))}
                          onChange={(selected) => form.setData("barangay", selected?.value ?? "")}
                          styles={{
                            control: (base) => ({
                              ...base,
                              minHeight: "38px",
                            }),
                          }}
                        />
                        {form.errors.barangay && (
                          <div className="text-danger small">{form.errors.barangay}</div>
                        )}
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="form-label">Civil Status</label>
                        <select
                          className="form-select"
                          value={form.data.civil_status}
                          onChange={(e) => form.setData("civil_status", e.target.value)}
                        >
                          <option value="">Select Civil Status</option>
                          {options?.civilStatus?.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        {form.errors.civil_status && (
                          <div className="text-danger small">{form.errors.civil_status}</div>
                        )}
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="form-label">Sex</label>
                        <select
                          className="form-select"
                          value={form.data.sex}
                          onChange={(e) => form.setData("sex", e.target.value)}
                        >
                          <option value="">Select Sex</option>
                          {options?.sex?.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        {form.errors.sex && <div className="text-danger small">{form.errors.sex}</div>}
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="form-label">Contact Number</label>
                        <input
                          className="form-control"
                          value={form.data.contact_number}
                          onChange={(e) => form.setData("contact_number", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 d-flex gap-2">
                  <button className="btn btn-success" disabled={form.processing}>
  {editingOwner ? "Update Owner" : "Save Owner"}
</button>


                <button type="button" className="btn btn-secondary" onClick={closeForm}>
  Cancel
</button>

                </div>
              </form>
            </div>
          </div>
        )}

        {/* OWNERS TABLE */}
        <div className="card shadow-sm">
          <div className="card-header fw-bold">Owners</div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-striped table-hover mb-0 align-middle text-center">
                <thead>
                  <tr>
                    <th style={{ width: 50 }}>#</th>
                    <th>Owner ID</th>
                    <th>Photo</th>
                    <th>Full Name</th>
                    <th>Address</th>
                    <th>Civil Status</th>
                    <th>Barangay</th>
                    <th>Sex</th>
                    <th>Contact Number</th>
                    <th>Pets</th>
                    <th style={{ width: 160 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {hasOwners ? (
                    owners.data.map((o, idx) => (
                      <tr key={o.id}>
                        <td>{idx + 1}</td>
                        <td className="fw-semibold">{o.owner_uid}</td>
                        <td>

                          {/* style={photoStyle}  */}
                          {/* <td>  delete*/}
                            
{o.photo_path ? (

    //  <img
    //   src={`/storage/${o.photo_path}`}
    //   alt="owner"
    //   style={{
    //                             width: 56,
    //                             height: 56,
    //                             borderRadius: 14,
    //                             objectFit: "cover",
    //                             border: "1px solid #eee",
    //                             cursor: "pointer"
    //                           }}
    //   onClick={() => setViewImage(`/storage/${o.photo_path}`)}
    //   title="Click to enlarge"
    // />
  <img
    src={
      o.photo_path.startsWith("http")
        ? o.photo_path
        : `/storage/${o.photo_path}`
    }
    alt="owner"
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
        o.photo_path.startsWith("http")
          ? o.photo_path
          : `/storage/${o.photo_path}`
      )
    }
    title="Click to enlarge"
  />
) :(
    <span className="text-muted">—</span>
  )}
{/* </td> delete*/}

                          
                          
                        </td>
                      <td>
  {capitalizeWords(o.first_name)}{" "}
  {o.middle_name ? `${capitalizeWords(o.middle_name)[0]}. ` : ""}
  {capitalizeWords(o.last_name)}
</td>
                        <td>{capitalizeWords(o.address)}</td>
                        <td>{o.civil_status}</td>
                        <td>{o.barangay}</td>
                        <td>{o.sex}</td>
                        <td>{o.contact_number ?? ""}</td>
                        <td>{o.pets_count ?? 0}</td>
                        <td>
                          <div className="d-flex gap-2">
  <button className="btn btn-warning btn-sm" onClick={() => openEditForm(o)}>
    Edit
  </button>

<button
  className="btn btn-primary btn-sm"
  onClick={() => router.get(`/owners/${o.id}`)}
>
  View
</button>


  <button className="btn btn-danger btn-sm" onClick={() => confirmDelete(o)}>
    Delete
  </button>
</div>

                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="text-center p-4 text-muted">
                        No owners found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ✅ Pagination: hide if no owners / or only 1 page */}
            {hasOwners && hasMultiplePages && (
              <div className="p-3 d-flex justify-content-end gap-2">
                {owners?.links?.map((l, i) => (
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
