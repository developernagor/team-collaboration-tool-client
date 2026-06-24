import { useState } from "react";
import axios from "axios";

function AddStudent() {
  const [formData, setFormData] = useState({
    studentName: "",
    fatherName: "",
    motherName: "",
    phone: "",
    whatsapp: "",
    guardianPhone: "",
    address: "",
    note: "",
    className: "",
    schoolName: "",
    admissionDate: "",
    monthlySalary: "",
    salaryDate: "",
    paymentStatus: "Unpaid",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(
        "https://team-collaboration-tool-server.vercel.app/students",
        formData
      );

      alert("✅ Student Added Successfully");

      setFormData({
        studentName: "",
        fatherName: "",
        motherName: "",
        phone: "",
        guardianPhone: "",
        address: "",
        note: "",
        className: "",
        schoolName: "",
        admissionDate: "",
        monthlySalary: "",
        salaryDate: "",
        paymentStatus: "Unpaid",
      });
    } catch (error) {
      console.log(error);
      alert("❌ Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-3xl shadow-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold">
            🎓 Add New Student
          </h1>

          <p className="mt-2 opacity-90">
            Register a new student into Mehedi Educare
          </p>
        </div>

        {/* Form Card */}
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body">

            <form
              onSubmit={handleSubmit}
              className="space-y-8"
            >

              {/* Personal Information */}
              <div>
                <h2 className="text-2xl font-bold text-primary mb-5">
                  👤 Personal Information
                </h2>

                <div className="grid md:grid-cols-2 gap-4">

                  <input
                    type="text"
                    name="studentName"
                    placeholder="Student Name"
                    value={formData.studentName}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                  />

                  <input
                    type="text"
                    name="phone"
                    placeholder="Student Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                  />

                  <input
                    type="text"
                    name="fatherName"
                    placeholder="Father Name"
                    value={formData.fatherName}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />

                  <input
                    type="text"
                    name="motherName"
                    placeholder="Mother Name"
                    value={formData.motherName}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />

                  <input
                    type="text"
                    name="guardianPhone"
                    placeholder="Guardian Phone"
                    value={formData.guardianPhone}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>

              <div className="divider"></div>

              {/* Academic Information */}
              <div>
                <h2 className="text-2xl font-bold text-secondary mb-5">
                  📚 Academic Information
                </h2>

                <div className="grid md:grid-cols-2 gap-4">

                  <input
                    type="text"
                    name="schoolName"
                    placeholder="School Name"
                    value={formData.schoolName}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />

                  <input
                    type="text"
                    name="className"
                    placeholder="Class"
                    value={formData.className}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />

                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">
                        Admission Date
                      </span>
                    </label>

                    <input
                      type="date"
                      name="admissionDate"
                      value={formData.admissionDate}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                    />
                  </div>

                </div>
              </div>

              <div className="divider"></div>

              {/* Payment Information */}
              <div>
                <h2 className="text-2xl font-bold text-success mb-5">
                  💰 Payment Information
                </h2>

                <div className="grid md:grid-cols-3 gap-4">

                  <input
                    type="number"
                    name="monthlySalary"
                    placeholder="Monthly Salary"
                    value={formData.monthlySalary}
                    onChange={handleChange}
                    className="input input-bordered"
                  />

                  <input
                    type="number"
                    name="salaryDate"
                    placeholder="Salary Date (1-31)"
                    value={formData.salaryDate}
                    onChange={handleChange}
                    className="input input-bordered"
                  />

                  <select
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleChange}
                    className="select select-bordered"
                  >
                    <option>Paid</option>
                    <option>Unpaid</option>
                  </select>

                </div>
              </div>

              <div className="divider"></div>

              {/* Address & Notes */}
              <div>
                <h2 className="text-2xl font-bold text-accent mb-5">
                  📝 Additional Information
                </h2>

                <div className="grid md:grid-cols-2 gap-4">

                  <input
  type="text"
  name="whatsapp"
  placeholder="WhatsApp Number"
  value={formData.whatsapp || ""}
  onChange={handleChange}
  className="input input-bordered"
/>

                  <textarea
                    name="address"
                    placeholder="Student Address"
                    value={formData.address}
                    onChange={handleChange}
                    className="textarea textarea-bordered h-32"
                  />

                  <textarea
                    name="note"
                    placeholder="Notes"
                    value={formData.note}
                    onChange={handleChange}
                    className="textarea textarea-bordered h-32"
                  />

                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg w-full"
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Saving Student...
                    </>
                  ) : (
                    "🎓 Add Student"
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>

      </div>
    </div>
  );
}

export default AddStudent;