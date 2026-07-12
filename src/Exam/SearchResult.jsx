import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";

const SERVER = "https://team-collaboration-tool-server.vercel.app";

export default function SearchResult() {
  const [exams, setExams] = useState([]);
  const [years, setYears] = useState([]);

  const [form, setForm] = useState({
    examId: "",
    year: "",
    className: "",
    studentId: "",
    studentRoll: "",
    registration: "",
    captcha: "",
  });

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // Simple Captcha
  const [num1, setNum1] = useState(
    Math.floor(Math.random() * 10) + 1
  );

  const [num2, setNum2] = useState(
    Math.floor(Math.random() * 10) + 1
  );

  useEffect(() => {
    loadExams();
    loadYears();
  }, []);

  const loadExams = async () => {
    try {
      const res = await axios.get(`${SERVER}/exams`);
      setExams(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadYears = () => {
    const currentYear = new Date().getFullYear();

    const arr = [];

    for (let i = currentYear; i >= 2020; i--) {
      arr.push(i);
    }

    setYears(arr);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const refreshCaptcha = () => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);

    setForm({
      ...form,
      captcha: "",
    });
  };

  const resetForm = () => {
    setForm({
      examId: "",
      year: "",
      className: "",
      studentId: "",
      studentRoll: "",
      registration: "",
      captcha: "",
    });

    setResult(null);
    setError("");

    refreshCaptcha();
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    setError("");
    setResult(null);

    if (Number(form.captcha) !== num1 + num2) {
      setError("Invalid Captcha");

      refreshCaptcha();

      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
        `${SERVER}/search-result`,
        {
          params: {
            examId: form.examId,
            className: form.className,
          
            studentRoll: form.studentRoll,
            registration: form.registration,
            year: form.year,
          },
        }
      );

      setResult(res.data);

      refreshCaptcha();
    } catch (err) {
      setError("No Result Found");

      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

    return (
    <div className="min-h-screen bg-slate-100 py-10">

      <div className="max-w-4xl mx-auto">

        <div className="bg-white rounded-lg shadow-xl border">

          <div className="bg-green-700 text-white text-center py-5 rounded-t-lg">

            <h1 className="text-3xl font-bold">
              MEHEDI EDUCARE
            </h1>

            <p className="mt-2">
              Examination Result
            </p>

          </div>

          <form
            onSubmit={handleSearch}
            className="p-8 grid md:grid-cols-2 gap-5"
          >

          
            {/* Examination */}

            <div>
              <label className="font-semibold block mb-2">
                Examination
              </label>

              <select
                name="examId"
                value={form.examId}
                onChange={handleChange}
                className="select select-bordered w-full"
                required
              >
                <option value="">
                  Select Examination
                </option>

                {exams.map((exam) => (
                  <option
                    key={exam._id}
                    value={exam._id}
                  >
                    {exam.examName}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}

            <div>
              <label className="font-semibold block mb-2">
                Year
              </label>

              <select
                name="year"
                value={form.year}
                onChange={handleChange}
                className="select select-bordered w-full"
                required
              >
                <option value="">
                  Select Year
                </option>

                {years.map((year) => (
                  <option
                    key={year}
                    value={year}
                  >
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Class */}

            <div>
              <label className="font-semibold block mb-2">
                Class
              </label>

              <select
                name="className"
                value={form.className}
                onChange={handleChange}
                className="select select-bordered w-full"
                required
              >
                <option value="">
                  Select Class
                </option>

                {[1,2,3,4,5,6,7,8,9,10].map((cls)=>(
                  <option
                    key={cls}
                    value={cls}
                  >
                    Class {cls}
                  </option>
                ))}
              </select>
            </div>

            {/* Student ID */}

            <div>
              <label className="font-semibold block mb-2">
                Student ID / Roll
              </label>

              <input
                type="text"
                name="studentRoll"
                value={form.studentRoll}
                onChange={handleChange}
                placeholder="Enter Roll"
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Registration */}

            <div className="md:col-span-2">
              <label className="font-semibold block mb-2">
                Registration Number (Optional)
              </label>

              <input
                type="text"
                name="registration"
                value={form.registration}
                onChange={handleChange}
                placeholder="Registration Number"
                className="input input-bordered w-full"
              />
            </div>

            {/* Captcha */}

            <div className="md:col-span-2">

              <label className="font-semibold block mb-2">
                Security Verification
              </label>

              <div className="flex flex-col md:flex-row gap-3">

                <div className="bg-slate-200 px-6 py-3 rounded-lg text-xl font-bold tracking-wider">

                  {num1} + {num2} = ?

                </div>

                <input
                  type="number"
                  name="captcha"
                  value={form.captcha}
                  onChange={handleChange}
                  placeholder="Answer"
                  className="input input-bordered flex-1"
                  required
                />

                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="btn btn-outline"
                >
                  Refresh
                </button>

              </div>

            </div>

            {/* Error */}

            {error && (
              <div className="md:col-span-2">
                <div className="alert alert-error">
                  {error}
                </div>
              </div>
            )}

            {/* Buttons */}

            <div className="md:col-span-2 flex flex-col md:flex-row justify-center gap-4 mt-2">

              <button
                type="button"
                onClick={resetForm}
                className="btn btn-outline btn-error w-full md:w-40"
              >
                Reset
              </button>

              <button
                type="submit"
                className="btn btn-success w-full md:w-56"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Searching...
                  </>
                ) : (
                  "Get Result"
                )}
              </button>

            </div>

          </form>

        </div>
        
        {/* ================= RESULT ================= */}

        {result && (
          <div className="bg-white rounded-lg shadow-xl border mt-8">

            <div className="bg-green-700 text-white px-6 py-4 rounded-t-lg">
              <h2 className="text-2xl font-bold">
                Examination Result
              </h2>
            </div>

            <div className="p-6">

              {/* Student Information */}

              <div className="grid md:grid-cols-3 gap-6">

                <div className="flex justify-center">

                  <img
                    src={
                      result.photo ||
                      "https://placehold.co/200x220?text=Student"
                    }
                    alt={result.studentName}
                    className="w-44 h-52 object-cover rounded-lg border shadow"
                  />

                </div>

                <div className="md:col-span-2">

                  <div className="overflow-x-auto">

                    <table className="table table-sm">

                      <tbody>

                        <tr>
                          <td className="font-bold w-40">Student Name</td>
                          <td>{result.studentName}</td>
                        </tr>

                        <tr>
                          <td className="font-bold">Student ID</td>
                          <td>{result.studentId}</td>
                        </tr>

                        <tr>
                          <td className="font-bold">Class</td>
                          <td>{result.className}</td>
                        </tr>

                        <tr>
                          <td className="font-bold">Exam</td>
                          <td>{result.examName}</td>
                        </tr>

                        <tr>
                          <td className="font-bold">Year</td>
                          <td>{result.year}</td>
                        </tr>

                        <tr>
                          <td className="font-bold">Registration</td>
                          <td>{result.registration || "-"}</td>
                        </tr>

                      </tbody>

                    </table>

                  </div>

                </div>

              </div>

              {/* Summary */}

              <div className="grid md:grid-cols-4 gap-4 mt-8">

                <div className="bg-primary text-primary-content rounded-lg p-5 text-center">
                  <h3 className="text-lg font-semibold">GPA</h3>
                  <p className="text-3xl font-bold">
                    {result.gpa}
                  </p>
                </div>

                <div className="bg-success text-success-content rounded-lg p-5 text-center">
                  <h3 className="text-lg font-semibold">Grade</h3>
                  <p className="text-3xl font-bold">
                    {result.grade}
                  </p>
                </div>

                <div className="bg-info text-info-content rounded-lg p-5 text-center">
                  <h3 className="text-lg font-semibold">Total Marks</h3>
                  <p className="text-3xl font-bold">
                    {result.totalMarks}
                  </p>
                </div>

                <div className="bg-warning rounded-lg p-5 text-center">
                  <h3 className="text-lg font-semibold">
                    Percentage
                  </h3>
                  <p className="text-3xl font-bold">
                    {result.percentage}%
                  </p>
                </div>

              </div>

              {/* Subject Table */}

              <div className="overflow-x-auto mt-8">

                <table className="table table-zebra">

                  <thead className="bg-green-700 text-white">

                    <tr>
                      <th>#</th>
                      <th>Subject</th>
                      <th>Marks</th>
                      <th>Grade</th>
                      <th>GPA</th>
                    </tr>

                  </thead>

                  <tbody>

                    {result.subjects?.map((subject, index) => (

                      <tr key={index}>

                        <td>{index + 1}</td>

                        <td>{subject.subject}</td>

                        <td>{subject.marks}</td>

                        <td>{subject.grade}</td>

                        <td>{subject.gpa}</td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

              {/* Result Status */}

              <div className="mt-8 flex justify-center">

                <div
                  className={`badge badge-lg ${
                    result.grade === "F"
                      ? "badge-error"
                      : "badge-success"
                  }`}
                >
                  {result.grade === "F"
                    ? "FAILED"
                    : "PASSED"}
                </div>

              </div>

              {/* Buttons */}

              <div className="flex flex-wrap justify-center gap-4 mt-8">

                <button
                  onClick={() => window.print()}
                  className="btn btn-primary"
                >
                  🖨 Print Result
                </button>

                <Link
                  to={`/marksheet/${result._id}`}
                  className="btn btn-success"
                >
                  📄 View Full Marksheet
                </Link>

                <button
                  className="btn btn-outline"
                >
                  Download PDF
                </button>

              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
