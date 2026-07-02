import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SERVER = "https://team-collaboration-tool-server.vercel.app";

export default function AddNotice() {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "General",
    important: false,
  });

  const [notices, setNotices] = useState([]);

  const loadNotices = () => {
    axios
      .get(`${SERVER}/notices`)
      .then((res) => setNotices(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const resetForm = () => {
    setEditing(null);

    setForm({
      title: "",
      description: "",
      category: "General",
      important: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (editing) {
        await axios.patch(`${SERVER}/notices/${editing}`, form);
        toast.success("Notice Updated");
      } else {
        await axios.post(`${SERVER}/notices`, form);
        toast.success("Notice Published");
      }

      resetForm();
      loadNotices();
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this notice?");

    if (!ok) return;

    await axios.delete(`${SERVER}/notices/${id}`);

    toast.success("Deleted");

    loadNotices();
  };

  const handleEdit = (notice) => {
    setEditing(notice._id);

    setForm({
      title: notice.title,
      description: notice.description,
      category: notice.category,
      important: notice.important,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const filtered = notices.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6">

      <h1 className="text-4xl font-bold mb-8">
        📢 Notice Management
      </h1>

      <div className="grid md:grid-cols-3 gap-5 mb-8">

  <div className="stat bg-base-100 rounded-xl shadow">
    <div className="stat-title">Total Notices</div>
    <div className="stat-value">
      {notices.length}
    </div>
  </div>

  <div className="stat bg-base-100 rounded-xl shadow">
    <div className="stat-title">Important</div>
    <div className="stat-value text-error">
      {notices.filter(n => n.important).length}
    </div>
  </div>

  <div className="stat bg-base-100 rounded-xl shadow">
    <div className="stat-title">Categories</div>
    <div className="stat-value">
      5
    </div>
  </div>

</div>

      <div className="bg-base-100 rounded-2xl shadow-xl p-8">

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Notice Title"
            className="input input-bordered w-full"
            required
          />

          <select
            className="select select-bordered w-full"
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option>General</option>
            <option>Holiday</option>
            <option>Exam</option>
            <option>Admission</option>
            <option>Routine</option>
          </select>

          <textarea
            rows="5"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
            placeholder="Notice Description"
            required
          />

          <label className="label cursor-pointer justify-start gap-4">

            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              name="important"
              checked={form.important}
              onChange={handleChange}
            />

            <span>Important Notice</span>

          </label>

          <div className="flex gap-3">

            <button
              className="btn btn-primary"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : editing
                ? "Update Notice"
                : "Publish Notice"}
            </button>

            {editing && (
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-outline"
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>

      <div className="mt-10">

        <input
          className="input input-bordered w-full mb-6"
          placeholder="Search Notice..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <div className="grid lg:grid-cols-2 gap-6">

          {filtered.map((notice) => (

            <div
              key={notice._id}
              className="bg-base-100 shadow-xl rounded-2xl p-6 border-l-4 border-primary"
            >

              <div className="flex justify-between">

                <div>

                  <h2 className="text-xl font-bold">

                    {notice.title}

                  </h2>

                  <p className="text-sm opacity-60 mt-1">

                    {notice.category}

                  </p>

                </div>

                {notice.important && (
                  <span className="badge badge-error">
                    Important
                  </span>
                )}

              </div>

              <p className="mt-5">

                {notice.description}

              </p>

              <p className="text-sm opacity-60 mt-5">

                {new Date(
                  notice.createdAt
                ).toLocaleString()}

              </p>

              <div className="mt-6 flex gap-3">

                <button
                  className="btn btn-warning btn-sm"
                  onClick={() =>
                    handleEdit(notice)
                  }
                >
                  ✏ Edit
                </button>

                <button
                  className="btn btn-error btn-sm"
                  onClick={() =>
                    handleDelete(notice._id)
                  }
                >
                  🗑 Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}