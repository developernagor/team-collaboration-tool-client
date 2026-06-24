import { useState } from "react";
import axios from "axios";

function AddStudent() {
  const [formData, setFormData] = useState({
    studentName: "",
    phone: "",
    className: "",
    schoolName: "",
    admissionDate: "",
    monthlySalary: "",
    salaryDate: "",
    paymentStatus: "Unpaid",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/students",
        formData
      );

      alert("Student Added");

      setFormData({
        studentName: "",
        phone: "",
        className: "",
        schoolName: "",
        admissionDate: "",
        monthlySalary: "",
        salaryDate: "",
        paymentStatus: "Unpaid",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h2 className="text-3xl font-bold mb-5">
        Add Student
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          name="studentName"
          placeholder="Student Name"
          value={formData.studentName}
          onChange={handleChange}
          className="input input-bordered"
          required
        />

        <input
  type="text"
  name="fatherName"
  placeholder="Father Name"
  value={formData.fatherName}
  onChange={handleChange}
  className="input input-bordered"
/>

<input
  type="text"
  name="motherName"
  placeholder="Mother Name"
  value={formData.motherName}
  onChange={handleChange}
  className="input input-bordered"
/>

<input
  type="text"
  name="guardianPhone"
  placeholder="Guardian Phone"
  value={formData.guardianPhone}
  onChange={handleChange}
  className="input input-bordered"
/>

<textarea
  name="address"
  placeholder="Address"
  value={formData.address}
  onChange={handleChange}
  className="textarea textarea-bordered md:col-span-2"
/>

<textarea
  name="note"
  placeholder="Note"
  value={formData.note}
  onChange={handleChange}
  className="textarea textarea-bordered md:col-span-2"
/>

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="input input-bordered"
          required
        />

        <input
          type="text"
          name="schoolName"
          placeholder="School"
          value={formData.schoolName}
          onChange={handleChange}
          className="input input-bordered"
        />

        <input
          type="text"
          name="className"
          placeholder="Class"
          value={formData.className}
          onChange={handleChange}
          className="input input-bordered"
        />

        
<label>Addmission Date</label>
        <input
          type="date"
          name="admissionDate"
          value={formData.admissionDate}
          onChange={handleChange}
          className="input input-bordered"
        />

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

        <button className="btn btn-primary col-span-full">
          Add Student
        </button>
      </form>
    </div>
  );
}

export default AddStudent;