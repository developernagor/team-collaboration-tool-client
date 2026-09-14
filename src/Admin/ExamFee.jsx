import { useEffect, useState } from "react";
import axios from "axios";

const API_URL =
  "https://team-collaboration-tool-server.vercel.app";

export default function ExamFee({ student }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "",
  });

  const [examFees, setExamFees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);

  // =========================
  // Fetch Exam Fee History
  // =========================
  const fetchExamFees = async () => {
    try {
      setHistoryLoading(true);

      const res = await axios.get(
        `${API_URL}/exam-fees/student/${student._id}`
      );

      setExamFees(res.data);
    } catch (error) {
      console.error("Failed to fetch exam fees:", error);
      setExamFees([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (student?._id) {
      fetchExamFees();
    }
  }, [student?._id]);

  // =========================
  // Add Exam Fee
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount) {
      alert("Please enter amount");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        studentId: student._id,
        studentName: student.studentName,
        date: formData.date,
        amount: Number(formData.amount),
        createdAt: new Date(),
      };

      const res = await axios.post(
        `${API_URL}/exam-fees`,
        payload
      );

      if (res.data.insertedId) {
        alert("Exam fee added successfully");

        setFormData({
          date: new Date().toISOString().split("T")[0],
          amount: "",
        });

        // Refresh history
        fetchExamFees();
      }
    } catch (error) {
      console.error("Failed to add exam fee:", error);
      alert("Failed to add exam fee");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Delete Exam Fee
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this exam fee?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/exam-fees/${id}`);

      fetchExamFees();
    } catch (error) {
      console.error("Failed to delete exam fee:", error);
      alert("Failed to delete exam fee");
    }
  };

  // =========================
  // Total Exam Fee
  // =========================
  const totalExamFee = examFees.reduce(
    (sum, fee) => sum + Number(fee.amount || 0),
    0
  );

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">

      {/* =========================
          ADD EXAM FEE
      ========================= */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">

          <h2 className="card-title text-primary">
            📝 Add Exam Fee
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-3 gap-4"
          >

            {/* Student Name */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">
                  Student Name
                </span>
              </label>

              <input
                type="text"
                className="input input-bordered w-full"
                value={student.studentName}
                readOnly
              />
            </div>

            {/* Date */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">
                  Date
                </span>
              </label>

              <input
                type="date"
                className="input input-bordered w-full"
                value={formData.date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    date: e.target.value,
                  })
                }
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">
                  Amount
                </span>
              </label>

              <input
                type="number"
                min="0"
                className="input input-bordered w-full"
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: e.target.value,
                  })
                }
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary md:col-span-3"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Exam Fee"}
            </button>

          </form>
        </div>
      </div>

      {/* =========================
          EXAM FEE HISTORY
      ========================= */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">

          <div className="flex justify-between items-center">
            <h2 className="card-title">
              📋 Exam Fee History
            </h2>

            <div className="badge badge-primary badge-lg">
              Total: ৳ {totalExamFee.toLocaleString()}
            </div>
          </div>

          {historyLoading ? (
            <div className="text-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
              <p className="mt-2">
                Loading exam fee history...
              </p>
            </div>
          ) : examFees.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📝</div>
              <p>No exam fee records found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="table table-zebra">

                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student Name</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {[...examFees]
                    .sort(
                      (a, b) =>
                        new Date(b.date) -
                        new Date(a.date)
                    )
                    .map((fee, index) => (
                      <tr key={fee._id}>

                        <td>{index + 1}</td>

                        <td>
                          {fee.studentName}
                        </td>

                        <td>
                          {formatDate(fee.date)}
                        </td>

                        <td className="font-bold">
                          ৳ {Number(fee.amount).toLocaleString()}
                        </td>

                        <td>
                          <button
                            onClick={() =>
                              handleDelete(fee._id)
                            }
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
          )}

        </div>
      </div>

    </div>
  );
}