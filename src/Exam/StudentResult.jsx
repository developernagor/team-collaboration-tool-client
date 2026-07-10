import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router";

const SERVER =
  "https://team-collaboration-tool-server.vercel.app";

export default function StudentResult() {
  const { studentId } = useParams();

  const [results, setResults] = useState([]);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    const res = await axios.get(
      `${SERVER}/student-results/${studentId}`
    );

    setResults(res.data);
  };

  if (!results.length) {
    return (
      <div className="text-center py-20">
        No Result Found
      </div>
    );
  }

  const student = results[0];

  const averageGpa = (
    results.reduce((sum, r) => sum + Number(r.gpa), 0) /
    results.length
  ).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto p-6">

      <div className="bg-base-200 rounded-xl p-6 mb-8">

        <h2 className="text-3xl font-bold">
          {student.studentName}
        </h2>

        <p>Class : {student.className}</p>

        <p>Total Exams : {results.length}</p>

        <p>Average GPA : {averageGpa}</p>

      </div>

      <div className="overflow-x-auto">

        <table className="table table-zebra">

          <thead>

            <tr>
              <th>#</th>
              <th>Exam</th>
              <th>Total</th>
              <th>GPA</th>
              <th>Grade</th>
              <th>Position</th>
              <th>Status</th>
              <th></th>
            </tr>

          </thead>

          <tbody>

            {results.map((result, index) => (

              <tr key={result._id}>

                <td>{index + 1}</td>

                <td>{result.examName}</td>

                <td>{result.total}</td>

                <td>{result.gpa}</td>

                <td>
                  <span className="badge badge-primary">
                    {result.grade}
                  </span>
                </td>

                <td>
                  #{result.meritPosition}
                </td>

                <td>
                  <span
                    className={`badge ${
                      result.status === "Pass"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {result.status}
                  </span>
                </td>

                <td>

                  <Link
                    to={`/marksheet/${result.studentId}/${result.examId}`}
                    className="btn btn-info btn-sm"
                  >
                    View Marksheet
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