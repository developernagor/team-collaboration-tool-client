import React, { useEffect, useState } from "react";
import axios from "axios";
// import Lightbox from "yet-another-react-lightbox";
// import "yet-another-react-lightbox/styles.css";
// import Zoom from "yet-another-react-lightbox/plugins/zoom";
// import Download from "yet-another-react-lightbox/plugins/download";


import { auth } from "../../firebase/firebase.config";
import { onAuthStateChanged } from "firebase/auth";
import PasswordGate from "../PasswordGate";
import Gallery from "../Gallery/Gallery";

function PhotoSend() {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  // const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  // const [lightboxIndex, setLightboxIndex] = useState(-1);
 const [selectedYear, setSelectedYear] = useState("");
const [selectedMonth, setSelectedMonth] = useState("");

const [currentPage, setCurrentPage] = useState(1);

const photosPerPage = 10;

  // const isVideo =
  //   file?.type.startsWith("video");

  // Replace with your ImgBB API key
const imgbbKey = import.meta.env.VITE_IMGBB_KEY;
// console.log("IMG KEY =", imgbbKey);
// console.log("ENV =", import.meta.env);
  // =========================
  // CURRENT USER
  // =========================
  useEffect(() => {
    const unsub = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
      }
    );

    return () => unsub();
  }, []);

  // =========================
  // FETCH PHOTOS
  // =========================
  const fetchPhotos = async () => {
  try {
    const res = await fetch(
      "https://team-collaboration-tool-server.vercel.app/photos"
    );

    if (!res.ok) {
      throw new Error("Failed to fetch photos");
    }

    const data = await res.json();

    setPhotos(
      Array.isArray(data)
        ? [...data].reverse()
        : []
    );
  } catch (error) {
    console.error("Fetch Photos Error:", error);
    setPhotos([]);
  }
};

  useEffect(() => {
    fetchPhotos();
  }, []);

  // =========================
  // UPLOAD PHOTO
  // =========================
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select a photo");
      return;
    }

    try {
      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "image",
        image
      );

      console.log("Using Key:", imgbbKey);
console.log(
  `https://api.imgbb.com/1/upload?key=${imgbbKey}`
);

      const uploadRes = await axios.post(
  `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
  formData
);

      const imageUrl =
        uploadRes.data.data.url;

      const photoData = {
        image: imageUrl,
        caption,
        userName:
          user?.displayName ||
          "Anonymous",
        userEmail: user?.email,
        createdAt: new Date(),
      };

      const res = await fetch(
        "https://team-collaboration-tool-server.vercel.app/photos",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            photoData
          ),
        }
      );

      const data =
        await res.json();

      if (
        data.insertedId ||
        data.success
      ) {
        setCaption("");
        setImage(null);

        fetchPhotos();
      }
    } catch (error) {
  // console.log(error.response?.data);
  // console.log(error.response?.status);
  // console.error("Upload Error:", error);
} finally {
      setLoading(false);
    }
  };

const filteredPhotos = photos.filter((photo) => {
  const date = new Date(photo.createdAt);

  const yearMatch =
    !selectedYear ||
    date.getFullYear().toString() === selectedYear;

  const monthMatch =
    !selectedMonth ||
    (date.getMonth() + 1).toString() === selectedMonth;

  return yearMatch && monthMatch;
});

const totalPages = Math.ceil(
  filteredPhotos.length / photosPerPage
);

const startIndex =
  (currentPage - 1) * photosPerPage;

const endIndex =
  startIndex + photosPerPage;

const paginatedPhotos =
  filteredPhotos.slice(startIndex, endIndex);

  useEffect(() => {
  setCurrentPage(1);
}, [selectedYear, selectedMonth]);

// const slides = filteredPhotos.map((photo) => ({
//   src: photo.image,
// }));

const years = [
  ...new Set(
    photos.map((photo) =>
      new Date(photo.createdAt).getFullYear()
    )
  ),
].sort((a, b) => b - a);

  return (
    <PasswordGate>
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">

       {/* Modern Header */}
<div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 mb-8 shadow-2xl">

  {/* Background Decorations */}
  <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-white/10 blur-3xl"></div>
  <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-white/10 blur-3xl"></div>

  <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">

    {/* Left */}
    <div>

      <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur">
        <span className="text-2xl">📸</span>
        <span className="text-white font-semibold">
          Smart Gallery
        </span>
      </div>

      <h1 className="mt-5 text-5xl font-extrabold text-white">
        PhotoSend
      </h1>

      <p className="mt-4 max-w-xl text-white/90 text-lg">
        Upload, organize, and share your memories with a beautiful
        modern gallery experience.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">

        <span className="rounded-full bg-white/20 px-4 py-2 text-white backdrop-blur">
          📷 {photos.length} Photos
        </span>

        <span className="rounded-full bg-white/20 px-4 py-2 text-white backdrop-blur">
          👤 {
            [...new Set(photos.map(photo => photo.userEmail))].length
          } Users
        </span>

      </div>

    </div>

    {/* Right */}
    <div className="grid grid-cols-2 gap-4">

      <div className="rounded-2xl bg-white/20 backdrop-blur-lg p-5 text-center">
        <p className="text-4xl font-bold text-white">
          {photos.length}
        </p>
        <p className="text-white/80">
          Total Photos
        </p>
      </div>

      <div className="rounded-2xl bg-white/20 backdrop-blur-lg p-5 text-center">
        <p className="text-4xl font-bold text-white">
          {years.length}
        </p>
        <p className="text-white/80">
          Years
        </p>
      </div>

    </div>

  </div>

</div>

        {/* UPLOAD FORM */}
        <form
          onSubmit={handleUpload}
          className="bg-white rounded-xl shadow-md p-5 mb-8"
        >
          <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) =>
              setCaption(
                e.target.value
              )
            }
            className="w-full border rounded-lg p-3 mb-4 resize-none"
            rows="3"
          />

          <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      setImage(selectedFile);
    }
  }}
  className="mb-4"
/>

          

          {image && (
            <div className="mb-4">
              <img
                src={URL.createObjectURL(
                  image
                )}
                alt="preview"
                className="rounded-xl max-h-80 w-full object-cover"
              />
            </div>
          )}


          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition"
          >
            {loading
              ? "Uploading..."
              : "Upload Photo"}
          </button>
        </form>

        <div className="bg-white rounded-xl shadow p-4 mb-6">
  <label className="font-semibold mr-3">
    Filter by Month and Year
  </label>

<select
  value={selectedYear}
  onChange={(e) => setSelectedYear(e.target.value)}
  className="border rounded-lg px-3 py-2"
>
  <option value="">All Years</option>
  {years.map((year) => (
    <option key={year} value={year}>
      {year}
    </option>
  ))}
</select>

<select
  value={selectedMonth}
  onChange={(e) => setSelectedMonth(e.target.value)}
  className="border rounded-lg px-3 py-2 ml-3"
>
  <option value="">All Months</option>
  <option value="1">January</option>
  <option value="2">February</option>
  <option value="3">March</option>
  <option value="4">April</option>
  <option value="5">May</option>
  <option value="6">June</option>
  <option value="7">July</option>
  <option value="8">August</option>
  <option value="9">September</option>
  <option value="10">October</option>
  <option value="11">November</option>
  <option value="12">December</option>
</select>

  <button
    onClick={() => {
  setSelectedYear("");
  setSelectedMonth("");
}}
    className="ml-3 px-4 py-2 rounded-lg bg-gray-200"
  >
    Clear
  </button>
</div>

                {/* PHOTOS FEED  */}
         {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl p-10 text-center shadow">
              <p className="text-gray-500 text-lg">
                No photos uploaded yet 📷
              </p>
            </div>
          ) : (
            filteredPhotos.map((photo) => (
              <div
                key={photo._id}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="overflow-hidden">
                  <img
  src={photo.image}
  alt="uploaded"
  onClick={() => setSelectedImage(photo.image)}
  className="w-full h-72 object-cover group-hover:scale-110 transition duration-500 cursor-pointer"
/>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      {photo.userName?.charAt(0)}
                    </div>

                    <div>
                      <h3 className="font-bold">
                        {photo.userName}
                      </h3>

                      <p className="text-xs text-gray-500">
                        {new Date(
                          photo.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {selectedImage && (
  <div
    onClick={() => setSelectedImage(null)}
    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
  >
    <img
      src={selectedImage}
      alt="preview"
      className="max-w-full max-h-full rounded-lg shadow-lg"
    />
  </div>
)}

                  {photo.caption && (
                    <p className="text-gray-700 leading-relaxed">
                      {photo.caption}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div> */}

<div className="flex justify-between items-center mb-6">

  <h2 className="text-2xl font-bold">
    Gallery
  </h2>

  <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
    {filteredPhotos.length} Photos
  </span>

</div>
<Gallery
  photos={paginatedPhotos}
  onImageClick={setSelectedImage}
/>
{/* PAGINATION */}

{totalPages > 1 && (
  <div className="flex flex-wrap justify-center items-center gap-2 mt-8">

    {/* Previous */}
    <button
      onClick={() =>
        setCurrentPage((prev) => Math.max(prev - 1, 1))
      }
      disabled={currentPage === 1}
      className={`px-4 py-2 rounded-lg font-medium transition ${
        currentPage === 1
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-blue-500 text-white hover:bg-blue-600"
      }`}
    >
      ← Previous
    </button>

    {/* Page Numbers */}
    {Array.from(
      { length: totalPages },
      (_, index) => index + 1
    ).map((page) => (
      <button
        key={page}
        onClick={() => setCurrentPage(page)}
        className={`w-10 h-10 rounded-lg font-semibold transition ${
          currentPage === page
            ? "bg-blue-600 text-white shadow-lg"
            : "bg-gray-100 text-gray-700 hover:bg-blue-100"
        }`}
      >
        {page}
      </button>
    ))}

    {/* Next */}
    <button
      onClick={() =>
        setCurrentPage((prev) =>
          Math.min(prev + 1, totalPages)
        )
      }
      disabled={currentPage === totalPages}
      className={`px-4 py-2 rounded-lg font-medium transition ${
        currentPage === totalPages
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-blue-500 text-white hover:bg-blue-600"
      }`}
    >
      Next →
    </button>

  </div>
)}

{selectedImage && (
  <div
    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
    onClick={() => setSelectedImage(null)}
  >
    <button
      className="absolute top-5 right-6 text-white text-4xl"
      onClick={() => setSelectedImage(null)}
    >
      ×
    </button>

    <img
      src={selectedImage}
      alt="Preview"
      onClick={(e) => e.stopPropagation()}
      className="max-w-[95vw] max-h-[95vh] rounded-xl shadow-2xl"
    />
  </div>
)}

{/* <Lightbox
  open={lightboxIndex >= 0}
  close={() => setLightboxIndex(-1)}
  index={lightboxIndex}
  slides={slides}
  plugins={[Zoom, Download]}
/> */}

      </div>
    </div>
    </PasswordGate>
  );
}

export default PhotoSend;