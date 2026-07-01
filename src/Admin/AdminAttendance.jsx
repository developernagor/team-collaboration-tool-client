import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminAttendance() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios
      .get("https://team-collaboration-tool-server.vercel.app/students")
      .then((res) => setStudents(res.data));
  }, []);

  const getAttendance = (studentId) => {
  return todayAttendance.find(
    (item) => item.studentId === studentId
  );
};

  const [todayAttendance, setTodayAttendance] = useState([]);

  useEffect(() => {
  axios
    .get(
      `https://team-collaboration-tool-server.vercel.app/attendance/date/${today}`
    )
    .then((res) => {
      setTodayAttendance(res.data);
    });
}, []);

  const today = new Date().toISOString().split("T")[0];

  

  const markAttendance = async (student, status) => {
  try {
    const attendance = {
      studentId: student._id,
      studentName: student.studentName,
      email: student.email,
      batch: student.batch || "",
      date: today,
      status,
    };

    const res = await axios.post(
      "https://team-collaboration-tool-server.vercel.app/attendance",
      attendance
    );

    const attendanceRes = await axios.get(
  `https://team-collaboration-tool-server.vercel.app/attendance/date/${today}`
);

setTodayAttendance(attendanceRes.data);

    alert("Attendance saved!");
    console.log(res.data);
  } catch (error) {
    alert(error.response?.data?.message || "Failed");
  }
};



  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Attendance
      </h1>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Attendance</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.studentName}</td>
              <td>{student.email}</td>

     <td>
  {getAttendance(student._id) ? (
    <span className="badge badge-success">
      {getAttendance(student._id).status}
    </span>
  ) : (
    <div className="space-x-2">
      <button
        className="btn btn-success btn-sm"
        onClick={() => markAttendance(student, "Present")}
      >
        Present
      </button>

      <button
        className="btn btn-error btn-sm"
        onClick={() => markAttendance(student, "Absent")}
      >
        Absent
      </button>

      <button
        className="btn btn-warning btn-sm"
        onClick={() => markAttendance(student, "Late")}
      >
        Late
      </button>

      <button
        className="btn btn-info btn-sm"
        onClick={() => markAttendance(student, "Leave")}
      >
        Leave
      </button>
    </div>
  )}
</td> 
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}