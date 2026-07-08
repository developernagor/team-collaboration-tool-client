import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SERVER = "https://team-collaboration-tool-server.vercel.app";

export default function AddExam() {
  const [loading, setLoading] = useState(false);
  const [exams, setExams] = useState([]);

  const [formData, setFormData] = useState({
    examName: "",
    year: new Date().getFullYear(),
    examDate: "",
    status: "Draft",
  });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await axios.get(`${SERVER}/exams`);
      setExams(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.examName) {
      return toast.error("Exam name is required");
    }

    try {
      setLoading(true);

      await axios.post(`${SERVER}/exams`, formData);

      toast.success("Exam added successfully");

      setFormData({
        examName: "",
        year: new Date().getFullYear(),
        examDate: "",
        status: "Draft",
      });

      fetchExams();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add exam");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this exam?")) return;

    try {
      await axios.delete(`${SERVER}/exams/${id}`);
      toast.success("Deleted successfully");
      fetchExams();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h2 className="text-3xl font-bold mb-6">
        Exam Management
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-xl p-6 space-y-4"
      >
        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="text"
            name="examName"
            placeholder="Exam Name"
            className="input input-bordered w-full"
            value={formData.examName}
            onChange={handleChange}
          />

          <input
            type="number"
            name="year"
            className="input input-bordered w-full"
            value={formData.year}
            onChange={handleChange}
          />

          <input
            type="date"
            name="startDate"
            className="input input-bordered w-full"
            value={formData.examDate}
            onChange={handleChange}
          />

          

          <select
            name="status"
            className="select select-bordered w-full"
            value={formData.status}
            onChange={handleChange}
          >
            <option>Draft</option>
            <option>Published</option>
          </select>

        </div>

        <button
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Saving..." : "Add Exam"}
        </button>
      </form>

      <div className="overflow-x-auto mt-10">
        <table className="table table-zebra">

          <thead>
            <tr>
              <th>#</th>
              <th>Exam</th>
              <th>Year</th>
              <th>Start</th>
              <th>End</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {exams.map((exam, index) => (
              <tr key={exam._id}>
                <td>{index + 1}</td>

                <td>{exam.examName}</td>

                <td>{exam.year}</td>

                <td>{exam.startDate}</td>

                <td>{exam.endDate}</td>

                <td>
                  <span
                    className={`badge ${
                      exam.status === "Published"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    {exam.status}
                  </span>
                </td>

                <td>
                  <button
                    onClick={() => handleDelete(exam._id)}
                    className="btn btn-error btn-sm"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}

          </tbody>

        </table>
      </div>

    </div>
  );
}