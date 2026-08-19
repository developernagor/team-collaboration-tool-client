import { useState } from "react";
import axios from "axios";

export default function AddMemory({ user, onMemoryAdded }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    memoryDate: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!user?.email) {
    alert("User information is not available. Please login again.");
    return;
  }

  if (!formData.title.trim()) {
    alert("Please enter a memory title");
    return;
  }

  try {
    setLoading(true);

    let imageUrl = "";

    if (file) {
      const imageData = new FormData();
      imageData.append("image", file);

      const imgbbResponse = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_KEY
        }`,
        imageData
      );

      imageUrl = imgbbResponse.data.data.url;
    }

    const memory = {
      userEmail: user.email,
      title: formData.title,
      description: formData.description,
      memoryDate: formData.memoryDate,
      image: imageUrl,
      createdAt: new Date(),
    };

    const response = await axios.post(
      "https://team-collaboration-tool-server.vercel.app/memories",
      memory
    );

    if (response.data.insertedId) {
      alert("Memory added successfully ❤️");

      setFormData({
        title: "",
        description: "",
        memoryDate: "",
      });

      setFile(null);

      const fileInput = document.getElementById("memory-file");

      if (fileInput) {
        fileInput.value = "";
      }

      if (onMemoryAdded) {
        onMemoryAdded({
          ...memory,
          _id: response.data.insertedId,
        });
      }
    }
  } catch (error) {
    console.error("Error adding memory:", error);
    alert("Failed to add memory");
  } finally {
    setLoading(false);
  }
};

  return (
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

        {/* Title */}
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

        {/* Description */}
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

        {/* Date */}
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

        {/* Image */}
        <div>
          <label className="font-semibold block mb-1">
            Memory Photo
          </label>

          <input
            id="memory-file"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="file-input file-input-bordered w-full"
          />
        </div>

        {/* Preview */}
        {file && (
          <div className="mt-3">
            <img
              src={URL.createObjectURL(file)}
              alt="Memory preview"
              className="w-full max-h-64 object-cover rounded-xl"
            />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
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
  );
}