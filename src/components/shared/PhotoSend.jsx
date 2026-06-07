import React, { useEffect, useState } from "react";
import axios from "axios";


import { auth } from "../../firebase/firebase.config";
import { onAuthStateChanged } from "firebase/auth";

function PhotoSend() {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Replace with your ImgBB API key
const imgbbKey = import.meta.env.VITE_IMGBB_KEY;

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

      const data = await res.json();

      setPhotos(
        Array.isArray(data)
          ? data.reverse()
          : []
      );
    } catch (error) {
      console.log(error);
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
  console.log(error.response?.data);
  console.log(error.response?.status);
  console.error("Upload Error:", error);
} finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-6">
          <h1 className="text-3xl font-bold text-center">
            📷 PhotoSend
          </h1>

          <p className="text-center text-gray-500 mt-2">
            Share photos with
            everyone
          </p>
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
            onChange={(e) =>
              setImage(
                e.target.files[0]
              )
            }
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

                {/* PHOTOS FEED */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl p-10 text-center shadow">
              <p className="text-gray-500 text-lg">
                No photos uploaded yet 📷
              </p>
            </div>
          ) : (
            photos.map((photo) => (
              <div
                key={photo._id}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="overflow-hidden">
                  <img
                    src={photo.image}
                    alt="uploaded"
                    className="w-full h-72 object-cover group-hover:scale-110 transition duration-500"
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

                  {photo.caption && (
                    <p className="text-gray-700 leading-relaxed">
                      {photo.caption}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default PhotoSend;