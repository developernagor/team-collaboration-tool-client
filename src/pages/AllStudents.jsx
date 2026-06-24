import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";

function AllStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        "https://team-collaboration-tool-server.vercel.app/students"
      );

      setStudents(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredStudents = students.filter((student) =>
    student.studentName
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-10 px-4">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white mb-8">

          <h1 className="text-4xl font-bold">
            🎓 All Students
          </h1>

          <p className="mt-2 opacity-90">
            Manage and view all registered students
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">

          <div className="card bg-white shadow-xl">
            <div className="card-body text-center">
              <h2 className="text-lg font-semibold">
                Total Students
              </h2>

              <p className="text-4xl font-bold text-primary">
                {students.length}
              </p>
            </div>
          </div>

          <div className="card bg-white shadow-xl">
            <div className="card-body text-center">
              <h2 className="text-lg font-semibold">
                Search Results
              </h2>

              <p className="text-4xl font-bold text-success">
                {filteredStudents.length}
              </p>
            </div>
          </div>

          <div className="card bg-white shadow-xl">
            <div className="card-body text-center">
              <h2 className="text-lg font-semibold">
                Active Records
              </h2>

              <p className="text-4xl font-bold text-secondary">
                {students.length}
              </p>
            </div>
          </div>

        </div>

        {/* Search */}
        <div className="card bg-white shadow-xl mb-8">
          <div className="card-body">

            <label className="input input-bordered flex items-center gap-2">

              🔍

              <input
                type="text"
                className="grow"
                placeholder="Search student by name..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </label>

          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block card bg-white shadow-2xl">

          <div className="card-body">

            <div className="overflow-x-auto">

              <table className="table table-zebra">

                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Class</th>
                    <th>Admission Date</th>
                    <th>Salary Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredStudents.map(
                    (student, index) => (
                      <tr key={student._id}>
                        <td>{index + 1}</td>

                        <td className="font-semibold">
                          {student.studentName}
                        </td>

                        <td>
                          {student.className ||
                            "N/A"}
                        </td>

                        <td>
                          {student.admissionDate ||
                            "N/A"}
                        </td>

                        <td>
                          {student.salaryDate ||
                            "N/A"}
                        </td>

                        <td>
                          <Link
                            to={`/student/${student._id}`}
                            className="btn btn-info btn-sm"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

        {/* Mobile Cards */}
        <div className="grid gap-4 lg:hidden">

          {filteredStudents.map((student) => (

            <div
              key={student._id}
              className="card bg-white shadow-xl hover:shadow-2xl transition-all"
            >
              <div className="card-body">

                <h2 className="card-title">
                  👨‍🎓 {student.studentName}
                </h2>

                <p>
                  <strong>Class:</strong>{" "}
                  {student.className || "N/A"}
                </p>

                <p>
                  <strong>Admission:</strong>{" "}
                  {student.admissionDate || "N/A"}
                </p>

                <p>
                  <strong>Salary Date:</strong>{" "}
                  {student.salaryDate || "N/A"}
                </p>

                <div className="card-actions justify-end mt-3">
                  <Link
                    to={`/student/${student._id}`}
                    className="btn btn-primary btn-sm"
                  >
                    View Details
                  </Link>
                </div>

              </div>
            </div>

          ))}

        </div>

        {/* Empty State */}
        {filteredStudents.length === 0 && (
          <div className="card bg-white shadow-xl mt-8">

            <div className="card-body text-center py-16">

              <div className="text-6xl mb-4">
                🔍
              </div>

              <h2 className="text-2xl font-bold">
                No Students Found
              </h2>

              <p className="text-gray-500">
                Try another search keyword.
              </p>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default AllStudents;