import { useEffect, useState } from "react";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase.config";

export default function AddMemory({ onMemoryAdded }) {
  const [user, setUser] = useState(null);

  const [specialMemories, setSpecialMemories] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    memoryDate: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingMemories, setFetchingMemories] = useState(true);

  // =========================
  // FIREBASE USER
  // =========================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // =========================
  // FETCH MEMORIES
  // =========================
  const fetchMemories = async () => {
    try {
      setFetchingMemories(true);

      const res = await axios.get(
        "https://team-collaboration-tool-server.vercel.app/memories"
      );

      setSpecialMemories(res.data || []);
    } catch (error) {
      console.error("Failed to load memories:", error);
    } finally {
      setFetchingMemories(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  // =========================
  // FORM CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // FILE CHANGE
  // =========================
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    // Optional validation
    if (!selectedFile.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    // Optional 5MB limit
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB.");
      return;
    }

    setFile(selectedFile);
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.email) {
      alert("User information is not available. Please login again.");
      return;
    }

    if (!formData.title.trim()) {
      alert("Please enter a memory title.");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = "";

      // =========================
      // UPLOAD IMAGE TO IMGBB
      // =========================
      if (file) {
        const imageData = new FormData();
        imageData.append("image", file);

        const imgbbKey = import.meta.env.VITE_IMGBB_KEY;

        if (!imgbbKey) {
          throw new Error(
            "VITE_IMGBB_KEY is missing from environment variables."
          );
        }

        const imgbbResponse = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
          imageData
        );

        imageUrl = imgbbResponse.data.data.url;
      }

      // =========================
      // MEMORY OBJECT
      // =========================
      const memory = {
        userEmail: user.email,
        title: formData.title.trim(),
        description: formData.description.trim(),
        memoryDate: formData.memoryDate,
        image: imageUrl,
        createdAt: new Date().toISOString(),
      };

      // =========================
      // SAVE TO SERVER
      // =========================
      const response = await axios.post(
        "https://team-collaboration-tool-server.vercel.app/memories",
        memory
      );

      if (response.data.insertedId) {
        const newMemory = {
          ...memory,
          _id: response.data.insertedId,
        };

        // Add immediately to gallery
        setSpecialMemories((prev) => [
          newMemory,
          ...prev,
        ]);

        // Parent callback if provided
        if (onMemoryAdded) {
          onMemoryAdded(newMemory);
        }

        // Reset form
        setFormData({
          title: "",
          description: "",
          memoryDate: "",
        });

        setFile(null);

        const fileInput =
          document.getElementById("memory-file");

        if (fileInput) {
          fileInput.value = "";
        }

        alert("Memory added successfully ❤️");
      }
    } catch (error) {
      console.error("Error adding memory:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to add memory";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (fetchingMemories) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <span className="loading loading-spinner loading-lg"></span>

          <p className="text-gray-500">
            Loading memories...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* =========================
          ADD MEMORY FORM
      ========================= */}
      <div className="bg-white rounded-2xl shadow p-6">

        <div className="flex items-center gap-3 mb-5">

          <div className="text-4xl">
            💝
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              Add Special Memory
            </h2>

            <p className="text-gray-500 text-sm">
              Save a special moment that you don't want to forget.
            </p>
          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* TITLE */}
          <div>
            <label className="font-semibold block mb-1">
              Memory Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: Our Study Tour"
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="font-semibold block mb-1">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write something about this special memory..."
              className="textarea textarea-bordered w-full"
              rows="4"
            />
          </div>

          {/* DATE */}
          <div>
            <label className="font-semibold block mb-1">
              Memory Date
            </label>

            <input
              type="date"
              name="memoryDate"
              value={formData.memoryDate}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          {/* IMAGE */}
          <div>
            <label className="font-semibold block mb-1">
              Memory Photo
            </label>

            <input
              id="memory-file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full"
            />
          </div>

          {/* PREVIEW */}
          {file && (
            <div className="mt-3">

              <img
                src={URL.createObjectURL(file)}
                alt="Memory preview"
                className="w-full max-h-64 object-cover rounded-xl"
              />

              <p className="text-sm text-gray-500 mt-2">
                {file.name}
              </p>

            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading || !user}
            className="btn btn-primary w-full"
          >

            {loading ? (
              <>
                <span className="loading loading-spinner"></span>
                Saving...
              </>
            ) : (
              <>
                ❤️ Add Memory
              </>
            )}

          </button>

        </form>
      </div>

      {/* =========================
          SPECIAL MEMORIES
      ========================= */}
      <div className="bg-white rounded-2xl shadow p-6">

        <div className="flex items-center justify-between mb-6">

          <div>
            <h2 className="text-2xl font-bold">
              💖 Special Memories
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Some moments worth remembering forever
            </p>
          </div>

          <div className="text-3xl">
            ✨
          </div>

        </div>

        {specialMemories.length === 0 ? (

          <div className="text-center py-12">

            <div className="text-6xl mb-4">
              🌸
            </div>

            <h3 className="text-xl font-semibold text-gray-700">
              No special memories yet
            </h3>

            <p className="text-gray-400 mt-2">
              Your beautiful memories will appear here.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {specialMemories.map((memory) => (

              <div
                key={memory._id}
                className="group bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
              >

                {/* IMAGE */}
                {memory.image ? (

                  <div className="overflow-hidden">

                    <img
                      src={memory.image}
                      alt={memory.title || "Special Memory"}
                      className="w-full h-56 object-cover group-hover:scale-110 transition duration-500"
                    />

                  </div>

                ) : (

                  <div className="w-full h-56 bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">

                    <span className="text-7xl">
                      💝
                    </span>

                  </div>

                )}

                {/* CONTENT */}
                <div className="p-5">

                  <div className="flex justify-between items-start gap-3">

                    <h3 className="text-xl font-bold text-gray-800">
                      {memory.title}
                    </h3>

                    <span className="text-2xl">
                      ❤️
                    </span>

                  </div>

                  {memory.description && (
                    <p className="text-gray-600 mt-3 leading-relaxed">
                      {memory.description}
                    </p>
                  )}

                  {/* MEMORY DATE */}
                  {memory.memoryDate && (
                    <p className="text-sm text-purple-600 font-semibold mt-4">
                      📅{" "}
                      {new Date(
                        memory.memoryDate
                      ).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}

                  {/* CREATED DATE */}
                  {memory.createdAt && (
                    <p className="text-xs text-gray-400 mt-2">
                      Added{" "}
                      {new Date(
                        memory.createdAt
                      ).toLocaleDateString("en-GB")}
                    </p>
                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}