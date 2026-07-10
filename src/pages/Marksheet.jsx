import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import axios from "axios";

const SERVER =
  "https://team-collaboration-tool-server.vercel.app";

export default function Marksheet() {
const { studentId, examId } = useParams();

  const [result, setResult] = useState(null);

  useEffect(() => {
    loadResult();
  }, []);

  const loadResult = async () => {
    try {
    const res = await axios.get(
  `${SERVER}/results/${studentId}/${examId}`
);

const data = res.data;
      setResult(data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!result) {
    return (
      <div className="text-center p-20">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">

      {/* Header */}
      <div className="bg-white rounded-xl shadow-xl p-8">

        <h1 className="text-4xl font-bold text-center">
          MEHEDI EDUCARE
        </h1>

        <p className="text-center mt-2">
          Academic Transcript
        </p>

        <div className="grid md:grid-cols-2 gap-8 mt-10">

          <div>
            <p><b>Name :</b> {result.studentName}</p>
            <p><b>Class :</b> {result.className}</p>
            <p><b>Exam :</b> {result.examName}</p>
            <p><b>Position :</b> #{result.meritPosition}</p>
          </div>

          <div>
            <p><b>Total :</b> {result.total}</p>
            <p><b>Average :</b> {result.average}</p>
            <p><b>GPA :</b> {result.gpa}</p>
            <p><b>Grade :</b> {result.grade}</p>
          </div>

        </div>

      </div>

      {/* Subject Table */}
      <div className="overflow-x-auto mt-10">

        <table className="table table-zebra w-full">

          <thead className="bg-blue-600 text-white">

            <tr>
              <th>#</th>
              <th>Subject</th>
              <th>Marks</th>
              <th>Pass Marks</th>
              <th>Status</th>
              <th>Grade</th>
            </tr>

          </thead>

          <tbody>

            {result.subjects?.map((item, index) => {

              const mark = Number(item.marks);

              let grade = "";

              if (mark >= 80) grade = "A+";
              else if (mark >= 70) grade = "A";
              else if (mark >= 60) grade = "A-";
              else if (mark >= 50) grade = "B";
              else if (mark >= 40) grade = "C";
              else if (mark >= 33) grade = "D";
              else grade = "F";

              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.subject}</td>
                  <td>{item.marks}</td>
                  <td>33</td>

                  <td>
                    <span
                      className={`badge ${
                        mark >= 33
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {mark >= 33 ? "Pass" : "Fail"}
                    </span>
                  </td>

                  <td>{grade}</td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

      {/* Summary */}
      <div className="grid md:grid-cols-4 gap-5 mt-10">

        <div className="bg-blue-100 rounded-xl p-5 shadow">
          <h3 className="font-bold">Total Marks</h3>
          <p className="text-3xl font-bold mt-2">
            {result.total}
          </p>
        </div>

        <div className="bg-green-100 rounded-xl p-5 shadow">
          <h3 className="font-bold">GPA</h3>
          <p className="text-3xl font-bold mt-2">
            {result.gpa}
          </p>
        </div>

        <div className="bg-yellow-100 rounded-xl p-5 shadow">
          <h3 className="font-bold">Grade</h3>
          <p className="text-3xl font-bold mt-2">
            {result.grade}
          </p>
        </div>

        <div className="bg-red-100 rounded-xl p-5 shadow">
          <h3 className="font-bold">Merit Position</h3>
          <p className="text-3xl font-bold mt-2">
            #{result.meritPosition}
          </p>
        </div>

      </div>

      {/* Remarks */}
      <div className="bg-base-200 rounded-xl p-6 mt-10">

        <h2 className="text-2xl font-bold mb-4">
          Remarks
        </h2>

        <p className="text-lg">
          {result.status === "Pass"
            ? "Congratulations! You have successfully passed this examination."
            : "You have not passed this examination. Please work hard and try again."}
        </p>

      </div>

    </div>
  );
}