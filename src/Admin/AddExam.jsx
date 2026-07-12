import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SERVER = "https://team-collaboration-tool-server.vercel.app";

export default function AddExam() {
  const [loading, setLoading] = useState(false);
  const [exams, setExams] = useState([]);
  const classOptions = ["1","2","3","4","5","6","7","8","9","10",];
const [editingId, setEditingId] = useState(null);

 const [formData, setFormData] = useState({
  examName: "",
  examCode: "",
  examType: "Monthly Test",
  year: new Date().getFullYear(),
  examScope: "Full Exam", // Full Exam | Subject Exam
  subject: "",

  startDate: "",
  endDate: "",
  resultPublishDate: "",

  classes: [],

  totalMarks: 100,
  passMarks: 33,

  gradingSystem: "GPA + Grade",

  status: "Draft",

  description: "",
  instructions: "",
});

  useEffect(() => {
    fetchExams();
  }, []);

  const subjectOptions = [
  "Bangla",
  "English",
  "Mathematics",
  "Higher Mathematics",
  "General Science",
  "Physics",
  "Chemistry",
  "Biology",
  "ICT",
  "Religion",
  "Accounting",
  "Finance",
  "Business Entrepreneurship",
  "Economics",
  "Geography",
  "History",
];

  const fetchExams = async () => {
    try {
      const res = await axios.get(`${SERVER}/exams`);
      setExams(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const generateExamCode = () => {
  const year = new Date().getFullYear();

  const random = Math.floor(1000 + Math.random() * 9000);

  return `EX-${year}-${random}`;
};

useEffect(() => {
  if (!formData.examCode) {
    setFormData((prev) => ({
      ...prev,
      examCode: generateExamCode(),
    }));
  }
}, []);




const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

  const handleSubmit = async (e) => {
    e.preventDefault();

   if (!formData.examName.trim())
  return toast.error("Exam Name is required");

if (!formData.examCode.trim())
  return toast.error("Exam Code is required");
if (
  formData.examScope === "Subject Exam" &&
  !formData.subject
) {
  return toast.error("Please select subject");
}

if (formData.classes.length === 0)
  return toast.error("Select at least one class");

if (!formData.startDate)
  return toast.error("Select Start Date");

if (!formData.endDate)
  return toast.error("Select End Date");

if (
  new Date(formData.endDate) <
  new Date(formData.startDate)
) {
  return toast.error(
    "End Date cannot be before Start Date"
  );
}

    try {
      setLoading(true);

      if (editingId) {
  await axios.put(
    `${SERVER}/exams/${editingId}`,
    formData
  );

  toast.success("Exam Updated Successfully");
} else {
  await axios.post(
    `${SERVER}/exams`,
    formData
  );

  toast.success("Exam Added Successfully");
}

  resetForm();
  setEditingId(null);

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

  const updateStatus = async (id, status) => {
  try {
    await axios.patch(
      `${SERVER}/exams/${id}/status`,
      { status }
    );

    toast.success("Status Updated");

    fetchExams();
  } catch (err) {
    toast.error("Failed to update status");
  }
};


const handleEdit = (exam) => {
  setEditingId(exam._id);

  setFormData({
    examName: exam.examName || "",
    examCode: exam.examCode || "",
    examType: exam.examType || "Monthly Test",
    year: exam.year || new Date().getFullYear(),

    examScope: exam.examScope || "Full Exam",
    subject: exam.subject || "",

    startDate: exam.startDate || "",
    endDate: exam.endDate || "",
    resultPublishDate: exam.resultPublishDate || "",

    classes: exam.classes || [],

    totalMarks: exam.totalMarks || 100,
    passMarks: exam.passMarks || 33,

    gradingSystem: exam.gradingSystem || "GPA + Grade",

    status: exam.status || "Draft",

    description: exam.description || "",
    instructions: exam.instructions || "",
  });
};


const resetForm = () => {
  setEditingId(null);

  setFormData({
    examName: "",
    examCode: generateExamCode(),
    examType: "Monthly Test",
    year: new Date().getFullYear(),

    examScope: "Full Exam",
    subject: "",

    startDate: "",
    endDate: "",
    resultPublishDate: "",

    classes: [],

    totalMarks: 100,
    passMarks: 33,

    gradingSystem: "GPA + Grade",

    status: "Draft",

    description: "",
    instructions: "",
  });
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
    type="text"
    name="examCode"
    placeholder="Exam Code (EX-2026-01)"
    className="input input-bordered w-full"
    value={formData.examCode}
    onChange={handleChange}
  />

  <select
    name="examType"
    className="select select-bordered"
    value={formData.examType}
    onChange={handleChange}
  >
    <option>Weekly Test</option>
    <option>Monthly Test</option>
    <option>Class Test</option>
    <option>Model Test</option>
    <option>Half Yearly</option>
    <option>Annual</option>
    <option>Final</option>
  </select>

  <div>
  <label>Exam Scope</label>

  <select
    name="examScope"
    value={formData.examScope}
    onChange={handleChange}
  >
    <option>Full Exam</option>
    <option>Subject Exam</option>
  </select>
</div>

{formData.examScope === "Subject Exam" && (
<div>
  <label>Subject</label>

  <select
    name="subject"
    value={formData.subject}
    onChange={handleChange}
  >
    <option value="">Select Subject</option>

    {subjectOptions.map(sub=>(
      <option key={sub}>{sub}</option>
    ))}
  </select>
</div>
)}

  <input
    type="number"
    name="year"
    className="input input-bordered"
    value={formData.year}
    onChange={handleChange}
  />

</div>

<h3 className="text-xl font-bold mt-8 mb-4">
    Exam Schedule
</h3>

<div className="grid md:grid-cols-3 gap-4">

  <div>
    <label className="label">
      <span className="label-text">Start Date</span>
    </label>

    <input
      type="date"
      name="startDate"
      className="input input-bordered w-full"
      value={formData.startDate}
      onChange={handleChange}
    />
  </div>

  <div>
    <label className="label">
      <span className="label-text">End Date</span>
    </label>

    <input
      type="date"
      name="endDate"
      className="input input-bordered w-full"
      value={formData.endDate}
      onChange={handleChange}
    />
  </div>

  <div>
    <label className="label">
      <span className="label-text">
        Result Publish Date
      </span>
    </label>

    <input
      type="date"
      name="resultPublishDate"
      className="input input-bordered w-full"
      value={formData.resultPublishDate}
      onChange={handleChange}
    />
  </div>

</div>

<h3 className="text-xl font-bold mt-8 mb-4">
  Applicable Classes
</h3>

<div className="grid grid-cols-2 md:grid-cols-5 gap-3">

  {classOptions.map((cls) => (
    <label
      key={cls}
      className="cursor-pointer flex items-center gap-2 border rounded-lg p-3 hover:bg-base-200"
    >
      <input
        type="checkbox"
        className="checkbox checkbox-primary"
        checked={formData.classes.includes(cls)}
        onChange={(e) => {
          if (e.target.checked) {
            setFormData({
              ...formData,
              classes: [...formData.classes, cls],
            });
          } else {
            setFormData({
              ...formData,
              classes: formData.classes.filter(
                (c) => c !== cls
              ),
            });
          }
        }}
      />

      <span>Class {cls}</span>
    </label>
  ))}

</div>

<h3 className="text-xl font-bold mt-8 mb-4">
  Marks Configuration
</h3>

<div className="grid md:grid-cols-2 gap-4">

  <input
    type="number"
    name="totalMarks"
    placeholder="Total Marks"
    className="input input-bordered"
    value={formData.totalMarks}
    onChange={handleChange}
  />

  <input
    type="number"
    name="passMarks"
    placeholder="Pass Marks"
    className="input input-bordered"
    value={formData.passMarks}
    onChange={handleChange}
  />

</div>

<h3 className="text-xl font-bold mt-8 mb-4">
  Grading System
</h3>

<select
  name="gradingSystem"
  className="select select-bordered w-full"
  value={formData.gradingSystem}
  onChange={handleChange}
>
  <option>GPA</option>
  <option>Letter Grade</option>
  <option>GPA + Grade</option>
  <option>Percentage</option>
</select>


<h3 className="text-xl font-bold mt-8 mb-4">
  Exam Status
</h3>

<select
  name="status"
  className="select select-bordered w-full"
  value={formData.status}
  onChange={handleChange}
>
  <option>Draft</option>
  <option>Published</option>
  <option>Completed</option>
  <option>Archived</option>
</select>

<h3 className="text-xl font-bold mt-8 mb-4">
  Description
</h3>

<textarea
  rows="4"
  name="description"
  className="textarea textarea-bordered w-full"
  placeholder="Write exam description..."
  value={formData.description}
  onChange={handleChange}
/>

<h3 className="text-xl font-bold mt-8 mb-4">
  Instructions
</h3>

<textarea
  rows="4"
  name="instructions"
  className="textarea textarea-bordered w-full"
  placeholder="Write exam instructions..."
  value={formData.instructions}
  onChange={handleChange}
/>

        <div className="flex gap-3 mt-8">
    

  <button
    className="btn btn-primary"
    disabled={loading}
  >
    {loading
  ? "Saving..."
  : editingId
  ? "Update Exam"
  : "Save Exam"}
  </button>

  <button
    type="button"
    className="btn btn-outline"
    onClick={resetForm}
  >
    Reset
  </button>

</div>
      </form>

      <div className="overflow-x-auto mt-10">
        <table className="table table-zebra">

          <thead>
  <tr>
    <th>#</th>
    <th>Exam</th>
    <th>Code</th>
    <th>Type</th>
    <th>Scope</th>
    <th>Classes</th>
    <th>Schedule</th>
    <th>Marks</th>
    <th>Status</th>
    <th>Action</th>
  </tr>
</thead>

          <tbody>
  {exams.map((exam, index) => (
    <tr key={exam._id}>
      <td>{index + 1}</td>

      <td>
        <div className="font-bold">
          {exam.examName}
        </div>

        <div className="text-xs text-gray-500">
          {exam.year}
        </div>
      </td>

      <td>
        <span className="badge badge-info">
          {exam.examCode}
        </span>
      </td>

      <td>{exam.examType}</td>
      <td>
  {exam.examScope === "Subject Exam"
    ? exam.subject
    : "All Subjects"}
</td>

      <td>
        {exam.classes?.join(", ")}
      </td>


      <td>
        <div>
          <p>
            <strong>Start:</strong>{" "}
            {exam.startDate}
          </p>

          <p>
            <strong>End:</strong>{" "}
            {exam.endDate}
          </p>

          <p className="text-xs text-gray-500">
            Result: {exam.resultPublishDate || "N/A"}
          </p>
        </div>
      </td>

      <td>
        {exam.passMarks} / {exam.totalMarks}
      </td>

      <td>
  <select
    className="select select-bordered select-sm"
    value={exam.status}
    onChange={(e) =>
      updateStatus(exam._id, e.target.value)
    }
  >
    <option>Draft</option>
    <option>Published</option>
    <option>Completed</option>
    <option>Archived</option>
  </select>
</td>

      <td className="space-x-2">
  <button
    onClick={() => handleEdit(exam)}
    className="btn btn-warning btn-sm"
  >
    Edit
  </button>

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