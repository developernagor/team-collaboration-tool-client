import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalPayments: 0,
    totalCollection: 0,
    monthlyCollection: 0,
  });
const [recentStudents, setRecentStudents] =
  useState([]);

  useEffect(() => {
  axios
    .get(
      "https://team-collaboration-tool-server.vercel.app/recent-students"
    )
    .then((res) => setRecentStudents(res.data))
    .catch(console.error);
}, []);


const [topStudents, setTopStudents] =
  useState([]);

  useEffect(() => {
  axios
    .get(
      "https://team-collaboration-tool-server.vercel.app/top-paying-students"
    )
    .then((res) => {
      setTopStudents(res.data);
    })
    .catch(console.error);
}, []);


const [loading, setLoading] = useState(true);

useEffect(() => {
  axios
    .get("https://team-collaboration-tool-server.vercel.app/dashboard-stats")
    .then((res) => {
      setStats(res.data);
      setLoading(false);
    })
    .catch((err) => {
      console.log(err);
      setLoading(false);
    });
}, []);


    const [recentPayments, setRecentPayments] = useState([]);

  useEffect(() => {
  axios
    .get("https://team-collaboration-tool-server.vercel.app/recent-payments")
    .then((res) => {
      setRecentPayments(res.data);
    })
    .catch((err) => console.log(err));
}, []);

if (loading) {
  return (
    <div className="flex justify-center items-center h-screen">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
}


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        Mehedi Educare Admin Dashboard
      </h1>

      <div className="mt-10">
  <h2 className="text-2xl font-bold mb-4">
    Recent Students
  </h2>

  <div className="overflow-x-auto bg-white rounded-xl shadow">
    <table className="table">
      <thead>
  <tr>
    <th>Rank</th>
    <th>Name</th>
    <th>Class</th>
    <th>Phone</th>
    <th>Admission Date</th>
  </tr>
</thead>

<tbody>
  {recentStudents.map((student, index) => (
    <tr key={student._id}>
      <td>#{index + 1}</td>
      <td>{student.studentName}</td>
      <td>{student.className}</td>
      <td>{student.phone}</td>
      <td>{student.admissionDate}</td>
    </tr>
  ))}
</tbody>
    </table>
  </div>

  <div className="mt-10">
  <h2 className="text-2xl font-bold mb-4">
    Top Paying Students
  </h2>

  <div className="overflow-x-auto bg-white rounded-xl shadow">
    <table className="table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Student Name</th>
           <th>Class</th>
          <th>Total Paid</th>
        </tr>
      </thead>

      <tbody>
  {topStudents.map((student, index) => (
    <tr key={index}>
      <td>#{index + 1}</td>

      <td>{student.studentName}</td>

      <td>{student.className}</td>

      <td className="text-green-600 font-bold">
        ৳ {student.totalPaid.toLocaleString()}
      </td>
    </tr>
  ))}
</tbody>
    </table>
  </div>


</div>



</div>



      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div className="bg-blue-500 text-white rounded-xl p-6 shadow">
          <h3 className="text-lg">Total Students</h3>
          <p className="text-4xl font-bold mt-2">
            {stats.totalStudents}
          </p>
        </div>

        <div className="bg-green-500 text-white rounded-xl p-6 shadow">
          <h3 className="text-lg">Total Payments</h3>
          <p className="text-4xl font-bold mt-2">
            {stats.totalPayments}
          </p>
        </div>

        </div>

{/* Financial Overview */}
      <div className="mt-8">
  <h2 className="text-2xl font-bold mb-4">
    Financial Overview
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

    {/* Total Collection */}
    <div className="bg-green-500 text-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-medium">
        Total Collection
      </h3>
      <p className="text-3xl font-bold mt-2">
        ৳ {stats.totalCollection?.toLocaleString()}
      </p>
    </div>

    {/* This Month Collection */}
    <div className="bg-blue-500 text-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-medium">
        This Month
      </h3>
      <p className="text-3xl font-bold mt-2">
        ৳ {stats.monthlyCollection?.toLocaleString()}
      </p>
    </div>

    {/* Today's Collection */}
    <div className="bg-purple-500 text-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-medium">
        Today's Collection
      </h3>
      <p className="text-3xl font-bold mt-2">
        ৳ {stats.todayCollection?.toLocaleString()}
      </p>
    </div>

    {/* Average Payment */}
    <div className="bg-orange-500 text-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-medium">
        Average Payment
      </h3>
      <p className="text-3xl font-bold mt-2">
        ৳ {stats.averagePayment?.toLocaleString()}
      </p>
    </div>

  </div>
</div>

{/* Recent Payments */}

<div className="mt-8">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-2xl font-bold">
      Recent Payments
    </h2>

    <button className="btn btn-primary btn-sm">
      View All
    </button>
  </div>

  <div className="overflow-x-auto bg-white rounded-xl shadow">
    <table className="table">
      <thead className="bg-gray-100">
        <tr>
          <th>#</th>
          <th>Student Name</th>
          <th>Student ID</th>
          <th>Amount</th>
          <th>Month</th>
          <th>Date</th>
          <th>Receipt</th>
        </tr>
      </thead>

      <tbody>
        {recentPayments.map((payment, index) => (
          <tr key={payment._id}>
            <td>{index + 1}</td>

            <td>{payment.studentName}</td>

            <td>{payment.studentId}</td>

            <td className="font-semibold text-green-600">
              ৳ {Number(payment.amount).toLocaleString()}
            </td>

            <td>{payment.month}</td>

            <td>
  {new Date(
    payment.paidDate || payment.createdAt
  ).toLocaleDateString()}
</td>

            <td>
              <button className="btn btn-xs btn-outline btn-primary">
                Receipt
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>




    </div>
  );
}

export default AdminDashboard;