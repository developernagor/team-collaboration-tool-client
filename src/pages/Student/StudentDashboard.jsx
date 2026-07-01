import { useEffect, useState } from "react";
import useStudent from "../../hooks/useStudent";
import axios from "axios";

function StudentDashboard() {
  const { student, loading } = useStudent();
  const [payments, setPayments] = useState([]);
  const [attendance, setAttendance] = useState([]);


useEffect(() => {
  if (!student) return;

  axios
    .get(
      `https://team-collaboration-tool-server.vercel.app/payments/student/${student._id}`
    )
    .then((res) => {
      console.log("Payments API:", res.data);
      setPayments(res.data);
    });
}, [student]);

console.log(student);
// console.log("student.studentId:", student.studentId);
// console.log("student._id:", student._id);

useEffect(() => {
  if (!student?._id) return;

  axios
    .get(
      `https://team-collaboration-tool-server.vercel.app/attendance/student/${student._id}`
    )
    .then((res) => {
      setAttendance(res.data);
    });
}, [student]);


  const hour = new Date().getHours();

const greeting =
  hour < 12
    ? "Good Morning ☀️"
    : hour < 18
    ? "Good Afternoon 🌤️"
    : "Good Evening 🌙";


    const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-GB");
};


    const calculateDue = () => {
if (!student?.admissionDate) {
  return {
    totalMonths: 0,
    totalFee: 0,
    totalPaid: 0,
    due: 0,
  };
}

  const admission = new Date(student.admissionDate);
  const today = new Date();

  // Number of months including admission month
  const totalMonths =
    (today.getFullYear() - admission.getFullYear()) * 12 +
    (today.getMonth() - admission.getMonth()) +
    1;

  const monthlyFee = Number(student.monthlySalary || 0);

  const totalFee = totalMonths * monthlyFee;

  const totalPaid = payments.reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0
  );

  const due = Math.max(totalFee - totalPaid, 0);

  return {
    totalMonths,
    totalFee,
    totalPaid,
    due,
  };
};

const dueInfo = calculateDue(); 

const present = attendance.filter(
  (a) => a.status === "Present"
).length;

const absent = attendance.filter(
  (a) => a.status === "Absent"
).length;

const late = attendance.filter(
  (a) => a.status === "Late"
).length;

const leave = attendance.filter(
  (a) => a.status === "Leave"
).length;

const total = attendance.length;

const percentage =
  total === 0
    ? 0
    : Math.round(((present + late) / total) * 100);


    const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

const monthlyAttendance = attendance.filter((item) => {
  const d = new Date(item.date);

  return (
    d.getMonth() === currentMonth &&
    d.getFullYear() === currentYear
  );
});

const monthlyPresent = monthlyAttendance.filter(
  (item) => item.status === "Present"
).length;

const monthlyRate =
  monthlyAttendance.length > 0
    ? Math.round((monthlyPresent / monthlyAttendance.length) * 100)
    : 0;

    

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }


  if (!student) {
    return <div>User not found.</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white p-8 shadow-xl">

    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white shadow-2xl">

  {/* Background Decoration */}
  <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>

  <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-cyan-300/10 rounded-full blur-3xl"></div>

  <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center p-8 lg:p-10">

    {/* Left Side */}
    <div>

      <p className="uppercase tracking-widest text-sm text-cyan-100 font-semibold">
        Student Dashboard
      </p>

      <h1 className="text-4xl lg:text-5xl font-extrabold mt-3">
  {greeting}
</h1>

      <h2 className="text-3xl mt-2 font-bold">
        {student.studentName}
      </h2>

      <p className="mt-4 text-cyan-100">
        {student.email}
      </p>

      <div className="flex flex-wrap gap-3 mt-6">

        <div className="badge badge-success badge-lg text-white">
          🎓 Student
        </div>

        <div className="badge badge-warning badge-lg">
          Active
        </div>

      </div>

      <p className="mt-6 text-sm text-cyan-100">
        📅 {new Date().toLocaleDateString("en-US", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>

    </div>

    {/* Right Side */}
    <div className="relative mt-10 lg:mt-0">

      <img
        src={
          student.photoURL ||
          "https://i.ibb.co/6bQ8B7T/user.png"
        }
        alt={student.name}
        className="w-36 h-36 rounded-full border-[6px] border-white shadow-2xl object-cover"
      />

      <span className="absolute bottom-3 right-3 w-6 h-6 rounded-full bg-green-400 border-4 border-white animate-pulse"></span>

    </div>

  </div>

</div>


<div className="mt-8 bg-base-100 rounded-3xl shadow-xl p-6 text-gray-900 dark:text-white">

  <div className="flex items-center justify-between mb-6">
    <h2 className="text-2xl font-bold">
      👨‍🎓 Student Information
    </h2>

    <div className="badge badge-primary badge-lg">
      Profile
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

    <div>
  <p className="text-sm text-gray-500 dark:text-gray-400">
    Full Name
  </p>
  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
    {student.studentName || "N/A"}
  </h3>
</div>

    <div>
      <p className="text-sm text-gray-500">Email</p>
      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
        {student.email}
      </h3>
    </div>

    <div>
      <p className="text-sm text-gray-500">Phone</p>
      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
        {student.phone || "Not Added"}
      </h3>
    </div>

    <div>
      <p className="text-sm text-gray-500">Role</p>
      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
        {student.role}
      </h3>
    </div>

    <div>
      <p className="text-sm text-gray-500">Gender</p>
      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
        {student.gender || "N/A"}
      </h3>
    </div>

    <div>
      <p className="text-sm text-gray-500">Date of Birth</p>
      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
        {student.dateOfBirth || "N/A"}
      </h3>
    </div>

    <div>
      <p className="text-sm text-gray-500">Blood Group</p>
      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
        {student.bloodGroup || "N/A"}
      </h3>
    </div>

    <div>
      <p className="text-sm text-gray-500">Address</p>
      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
        {student.address || "N/A"}
      </h3>
    </div>

    <div>
  <p className="text-sm text-gray-500">Joining Date</p>
  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
    {student.admissionDate
      ? new Date(student.admissionDate).toLocaleDateString("en-GB")
      : "N/A"}
  </h3>
</div>

  </div>

</div>

<div className="mt-8">
  <h2 className="text-2xl font-bold mb-5">
    💳 Payment Overview
  </h2>

<div className="bg-red-100 border border-red-300 rounded-xl p-5 shadow mt-5">
  <h3 className="text-lg font-semibold text-red-800">
    Due Amount
  </h3>

  <p className="text-3xl font-bold text-red-900 mt-2">
    ৳ {dueInfo.due.toLocaleString()}
  </p>

  <div className="mt-3 text-sm text-gray-800 space-y-1">
    <p>Admission: {formatDate(student.admissionDate)}</p>
    <p>Total Months: {dueInfo.totalMonths}</p>
    <p>Total Fee: ৳ {dueInfo.totalFee.toLocaleString()}</p>
    <p>Paid: ৳ {dueInfo.totalPaid.toLocaleString()}</p>
  </div>
</div>

</div>

<div className="bg-base-100 text-base-content shadow-xl rounded-2xl mt-8 p-6">
  <h2 className="text-xl font-bold mb-5">
    Payment Progress
  </h2>

 <progress
    className="progress progress-success w-full h-4"
    value={dueInfo.totalPaid}
    max={dueInfo.totalFee || 1}
  />

  <div className="flex justify-between mt-3 text-sm font-medium">
    <span className="text-green-600">
      Paid: ৳ {dueInfo.totalPaid.toLocaleString()}
    </span>

    <span className="text-red-600">
      Due: ৳ {dueInfo.due.toLocaleString()}
    </span>
  </div>
</div>

<div className="bg-base-100 text-base-content rounded-2xl shadow-xl mt-8">
  <div className="p-6 border-b border-base-300">
    <h2 className="text-2xl font-bold">
      Recent Payments
    </h2>
  </div>

  <div className="overflow-x-auto">
    <table className="table text-base-content">
      <thead className="text-base-content">
        <tr>
          <th>#</th>
          <th>Date</th>
          <th>Month</th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody className="text-base-content">
        {payments.length > 0 ? (
          payments.map((payment, index) => (
            <tr key={payment._id}>
              <td>{index + 1}</td>
              <td>{formatDate(payment.paidDate)}</td>
              <td>{payment.month}</td>
              <td>৳ {payment.amount}</td>
              <td>
                <span className="badge badge-success">Paid</span>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center py-8">
              No payment history found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>


<div className="mt-8 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-2xl text-white p-8 shadow-xl">

    <h2 className="text-2xl font-bold">
        Payment Summary
    </h2>

    <p className="mt-3 text-lg">
  You have paid
  <span className="font-bold">
    {" "}৳ {dueInfo.totalPaid}
  </span>
  out of
  <span className="font-bold">
    {" "}৳ {dueInfo.totalFee}
  </span>.
</p>

<p className="mt-2">
  Remaining Due:
  <span className="font-bold text-yellow-300">
    {" "}৳ {dueInfo.due}
  </span>
</p>
</div>

{/* Monthly Attendance Rate */}
<div className="bg-base-100 rounded-2xl shadow-xl mt-8 p-6 text-base-content">

  <h2 className="text-2xl font-bold mb-6">
    📅 Monthly Attendance
  </h2>

  <div className="grid md:grid-cols-3 gap-5">

    <div className="bg-blue-100 rounded-xl p-5">
      <h3 className="font-semibold text-blue-700">
        This Month
      </h3>

      <p className="text-xl font-bold text-blue-900">
        {new Date().toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
      </p>
    </div>

    <div className="bg-green-100 rounded-xl p-5">
      <h3 className="font-semibold text-green-700">
        Present
      </h3>

      <p className="text-3xl font-bold text-green-900">
        {monthlyPresent}
      </p>
    </div>

    <div className="bg-purple-100 rounded-xl p-5">
      <h3 className="font-semibold text-purple-700">
        Attendance Rate
      </h3>

      <p className="text-3xl font-bold text-purple-900">
        {monthlyRate}%
      </p>
    </div>

  </div>

  <progress
    className="progress progress-success w-full h-4 mt-6"
    value={monthlyRate}
    max="100"
  ></progress>

</div>

{/* Attendance Summary */}
<div className="bg-base-100 rounded-2xl shadow-xl mt-8 p-6">

  <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
    📅 Attendance Summary
  </h2>

  <div className="grid md:grid-cols-4 gap-4">

    <div className="bg-green-100 rounded-xl p-5">
      <h3 className="font-semibold text-green-700">
        Present
      </h3>

      <p className="text-3xl font-bold text-green-900">
        {present}
      </p>
    </div>

    <div className="bg-red-100 rounded-xl p-5">
      <h3 className="font-semibold text-red-700">
        Absent
      </h3>

      <p className="text-3xl font-bold text-red-900">
        {absent}
      </p>
    </div>

    <div className="bg-yellow-100 rounded-xl p-5">
      <h3 className="font-semibold text-yellow-700">
        Late
      </h3>

      <p className="text-3xl font-bold text-yellow-900">
        {late}
      </p>
    </div>

    <div className="bg-blue-100 rounded-xl p-5">
      <h3 className="font-semibold text-blue-700">
        Leave
      </h3>

      <p className="text-3xl font-bold text-blue-900">
        {leave}
      </p>
    </div>

  </div>

</div>

{/* Attendance Rate */}
<div className="bg-base-100 rounded-2xl shadow-xl mt-8 p-6">

  <h2 className="text-xl font-bold mb-5 text-gray-900 dark:text-white">
    Attendance Rate
  </h2>

  <progress
    className="progress progress-success w-full h-4"
    value={percentage}
    max="100"
  ></progress>

  <p className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
    {percentage}% Attendance
  </p>

</div>

{/* Attendance History */}
<div className="bg-base-100 rounded-2xl shadow-xl mt-8">

  <div className="p-6 border-b">

    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
      Attendance History
    </h2>

  </div>

  <div className="overflow-x-auto">

    <table className="table text-gray-900 dark:text-white">

      <thead className="text-gray-900 dark:text-white">

        <tr>
          <th>#</th>
          <th>Date</th>
          <th>Status</th>
        </tr>

      </thead>

      <tbody>

        {attendance.length > 0 ? (
          attendance.map((item, index) => (
            <tr key={item._id}>
              <td>{index + 1}</td>
              <td>{formatDate(item.date)}</td>
              <td>
                <span
                  className={`badge ${
                    item.status === "Present"
                      ? "badge-success"
                      : item.status === "Absent"
                      ? "badge-error"
                      : item.status === "Late"
                      ? "badge-warning"
                      : "badge-info"
                  }`}
                >
                  {item.status}
                </span>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan="3"
              className="text-center py-8 text-gray-900 dark:text-white"
            >
              No attendance found.
            </td>
          </tr>
        )}

      </tbody>

    </table>

  </div>

</div>

</div>
    </div>
  );
}

export default StudentDashboard;