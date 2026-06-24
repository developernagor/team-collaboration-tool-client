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
    const res = await axios.get(
      "https://team-collaboration-tool-server.vercel.app/students"
    );

    setStudents(res.data);
  };

  const filteredStudents = students.filter(
    (student) =>
      student.studentName
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-5">
      <h2 className="text-3xl font-bold mb-5">
        All Students
      </h2>

      <input
        type="text"
        placeholder="Search Student..."
        className="input input-bordered mb-5 w-full"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
    <th>Class</th>
    <th>Admission Date</th>
    <th>Salary Date</th>
    <th>Details</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student._id}>
  <td>{student.studentName}</td>
  <td>{student.className}</td>
  <td>{student.admissionDate}</td>
  <td>{student.salaryDate}</td>
  <td>
  <Link
    to={`/student/${student._id}`}
    className="btn btn-sm btn-info"
  >
    View
  </Link>
</td>
</tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllStudents;