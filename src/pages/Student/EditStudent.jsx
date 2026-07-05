import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import axios from "axios";

const SERVER =
  "https://team-collaboration-tool-server.vercel.app";

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    studentName: "",
    fatherName: "",
    motherName: "",
    phone: "",
    guardianPhone: "",
    whatsapp: "",
    email: "",
    address: "",
    note: "",
    className: "",
    schoolName: "",
    admissionDate: "",
    monthlySalary: "",
    salaryDate: "",
    status: "active",
  });

  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    try {
      const res = await axios.get(
        `${SERVER}/students/${id}`
      );

      setFormData({
        studentName: res.data.studentName || "",
        fatherName: res.data.fatherName || "",
        motherName: res.data.motherName || "",
        phone: res.data.phone || "",
        guardianPhone: res.data.guardianPhone || "",
        whatsapp: res.data.whatsapp || "",
        email: res.data.email || "",
        address: res.data.address || "",
        note: res.data.note || "",
        className: res.data.className || "",
        schoolName: res.data.schoolName || "",
        admissionDate: res.data.admissionDate || "",
        monthlySalary: res.data.monthlySalary || "",
        salaryDate: res.data.salaryDate || "",
        status: res.data.status || "active",
      });
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.patch(
        `${SERVER}/students/${id}`,
        formData
      );

      alert("Student Updated Successfully");

      navigate(`/student/${id}`);
    } catch (err) {
      console.log(err);
      alert("Update Failed");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          ✏️ Edit Student
        </h1>

        <Link
          to={`/student/${id}`}
          className="btn btn-outline"
        >
          Back
        </Link>

      </div>

      <div className="card bg-base-100 shadow-xl">

        <div className="card-body">

          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-2 gap-5"
          >

            <input
              name="studentName"
              className="input input-bordered"
              placeholder="Student Name"
              value={formData.studentName}
              onChange={handleChange}
            />

            <input
              name="fatherName"
              className="input input-bordered"
              placeholder="Father Name"
              value={formData.fatherName}
              onChange={handleChange}
            />

            <input
              name="motherName"
              className="input input-bordered"
              placeholder="Mother Name"
              value={formData.motherName}
              onChange={handleChange}
            />

            <input
              name="phone"
              className="input input-bordered"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
            />

            <input
              name="guardianPhone"
              className="input input-bordered"
              placeholder="Guardian Phone"
              value={formData.guardianPhone}
              onChange={handleChange}
            />

            <input
              name="whatsapp"
              className="input input-bordered"
              placeholder="Whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
            />

            <input
              name="email"
              className="input input-bordered"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              name="schoolName"
              className="input input-bordered"
              placeholder="School"
              value={formData.schoolName}
              onChange={handleChange}
            />

            <input
              name="className"
              className="input input-bordered"
              placeholder="Class"
              value={formData.className}
              onChange={handleChange}
            />

            <input
              type="date"
              name="admissionDate"
              className="input input-bordered"
              value={formData.admissionDate}
              onChange={handleChange}
            />

            <input
              type="number"
              name="monthlySalary"
              className="input input-bordered"
              placeholder="Monthly Fee"
              value={formData.monthlySalary}
              onChange={handleChange}
            />

            <input
              type="number"
              name="salaryDate"
              className="input input-bordered"
              placeholder="Salary Date"
              value={formData.salaryDate}
              onChange={handleChange}
            />

            <select
              name="status"
              className="select select-bordered"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>

            <textarea
              name="address"
              className="textarea textarea-bordered md:col-span-2"
              rows="3"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
            />

            <textarea
              name="note"
              className="textarea textarea-bordered md:col-span-2"
              rows="4"
              placeholder="Note"
              value={formData.note}
              onChange={handleChange}
            />

            <button
              className="btn btn-primary md:col-span-2"
            >
              💾 Update Student
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}