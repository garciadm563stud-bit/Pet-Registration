import AppLayout from "@/layouts/app-layout";
import React from "react";
import { router } from "@inertiajs/react";

export default function ShowOwnerDetails({ owner, pets }) {
  const [viewImage, setViewImage] = React.useState(null);

  // const ownerPhoto = owner?.photo_path ? `/storage/${owner.photo_path}` : null;
const ownerPhoto = owner?.photo_path
  ? owner.photo_path.startsWith("http")
    ? owner.photo_path
    : `/storage/${owner.photo_path}`
  : null;
  const hasPets = (pets?.data?.length ?? 0) > 0;
  const hasMultiplePages = (pets?.links?.length ?? 0) > 3;
const capitalizeWords = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};
  return (
    <AppLayout>
      {/* IMAGE POPUP MODAL */}
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
        <div className="d-flex align-items-center justify-content-between mb-3">
       

          
        </div>

        {/* OWNER INFO CARD */}
        {/* <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-start">
              <div className="col-12 col-md-3 d-flex justify-content-center">
                {ownerPhoto ? (
                  <img
                    src={ownerPhoto}
                    alt="owner"
                    onClick={() => setViewImage(ownerPhoto)}
                    title="Click to enlarge"
                    style={{
                      width: 170,
                      height: 170,
                      objectFit: "cover",
                      borderRadius: 18,
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
                      borderRadius: 18,
                      border: "1px dashed #cfcfcf",
                    }}
                  >
                    No Photo
                  </div>
                )}
              </div>

              <div className="col-12 col-md-9">
                <div className="fw-bold fs-5 mb-2">
                  {owner.first_name} {owner.middle_name ?? ""} {owner.last_name}
                </div>

                <div className="row g-2">
                  <div className="col-12 col-md-6">
                    <div className="text-muted small">Address</div>
                    <div className="fw-semibold">{owner.address ?? "—"}</div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="text-muted small">Barangay</div>
                    <div className="fw-semibold">{owner.barangay ?? "—"}</div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="text-muted small">Civil Status</div>
                    <div className="fw-semibold">{owner.civil_status ?? "—"}</div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="text-muted small">Sex</div>
                    <div className="fw-semibold">{owner.sex ?? "—"}</div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="text-muted small">Contact Number</div>
                    <div className="fw-semibold">{owner.contact_number ?? "—"}</div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="text-muted small">Owner ID</div>
                    <div className="fw-semibold">{owner.owner_uid ?? "—"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
<div className="card shadow-sm mb-4">
  <div className="card-header fw-bold text-center fs-5">Owner Details</div>

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
  src={ownerPhoto}
  onError={(e) => (e.target.src = "/images/no-image.png")}
  alt="owner"
  onClick={() => setViewImage(ownerPhoto)}
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

        {/* PETS SECTION */}
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="fw-bold">Registered Pets</div>
          <div className=" small fw-bold">{pets?.total ?? 0} Total</div>
        </div>

        {hasPets ? (
          <>
            <div className="row g-3">
              {pets.data.map((pet) => {
                // const petPhoto = pet.photo_path ? `/storage/${pet.photo_path}` : null;
const petPhoto = pet.photo_path
  ? pet.photo_path.startsWith("http")
    ? pet.photo_path
    : `/storage/${pet.photo_path}`
  : null;
                return (
                  <div className="col-12 col-md-6 col-lg-4" key={pet.id}>
                    <div className="card shadow-sm h-100" style={{ borderRadius: 18 }}>
                      <div className="card-body">
                        <div className="d-flex gap-3">
                          {/* LEFT SIDE - PHOTO */}
                          <div>
                            {petPhoto ? (
                              // <img
                              //   src={petPhoto}
                              //   alt="pet"
                              //   onClick={() => setViewImage(petPhoto)}
                              //   title="Click to enlarge"
                              //   style={{
                              //     width: 120,
                              //     height: 120,
                              //     objectFit: "cover",
                              //     borderRadius: 14,
                              //     border: "1px solid #eee",
                              //     cursor: "pointer",
                              //   }}
                              // />
                              <img
  src={petPhoto}
  onError={(e) => (e.target.src = "/images/no-image.png")}
  alt="pet"
  onClick={() => setViewImage(petPhoto)}
  style={{
    width: 120,
    height: 120,
    objectFit: "cover",
    borderRadius: 14,
    border: "1px solid #eee",
    cursor: "pointer",
  }}
/>
                            ) : (
                              <div
                                className="d-flex align-items-center justify-content-center text-muted"
                                style={{
                                  width: 120,
                                  height: 120,
                                  borderRadius: 14,
                                  border: "1px dashed #cfcfcf",
                                }}
                              >
                                No Photo
                              </div>
                            )}
                          </div>

                          {/* RIGHT SIDE - INFO */}
                          <div className="flex-grow-1">
                            <div className="fw-bold text-uppercase fs-6 mb-1">
                              {pet.pet_name ?? "—"}
                            </div>

                            <div className="small">
                              <div>
                                <span className="text-muted">Pet ID:</span>{" "}
                                <span className="fw-semibold">{pet.pet_uid ?? "—"}</span>
                              </div>

                              <div>
                                <span className="text-muted">Reg No:</span>{" "}
                                <span className="fw-semibold">{pet.registration_no ?? "—"}</span>
                              </div>

                              <div>
                                <span className="text-muted">Species:</span>{" "}
                                <span className="fw-semibold">{pet.species ?? "—"}</span>
                              </div>

                              <div>
                                <span className="text-muted">Breed:</span>{" "}
                                <span className="fw-semibold">{capitalizeWords(pet.breed ?? "—")}</span>
                              </div>
                            </div>

                            <button
                              className="btn btn-outline-primary btn-sm mt-2 w-100"
                              onClick={() => router.get(`/pets/${pet.id}`)}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ✅ Pagination (same style as OwnersDashboard) */}
            {hasMultiplePages && (
              <div className="pt-3 d-flex justify-content-end gap-2">
                {pets.links.map((l, i) => (
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
          </>
        ) : (
          <div className="card shadow-sm">
            <div className="card-body text-center text-muted p-4">
              No pets registered for this owner.
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
