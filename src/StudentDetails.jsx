/*
 FULL STUDENTDETAILS.JSX TEMPLATE
 This is a complete scaffold that includes:
 - Modern dashboard layout
 - Student info cards
 - Stats cards
 - Add Payment form
 - Payment history table
 - Notes section
 - Hooks for QR/jsPDF receipt generation

 Paste your existing generateReceipt() implementation into the marked area.
*/

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import axios from "axios";
import jsPDF from "jspdf";
import QRCode from "qrcode";

export default function StudentDetails() {
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [paymentData, setPaymentData] = useState({
    amount: "",
    month: "",
    startDate: "",
    endDate: "",
    paymentDate: "",
    paymentMethod: "Cash",
    note: "",
  });

  useEffect(() => {
    fetchStudent();
    fetchPayments();
  }, [id]);

  const fetchStudent = async () => {
    try {
      const res = await axios.get(
        `https://team-collaboration-tool-server.vercel.app/students/${id}`
      );
      setStudent(res.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    const res = await axios.get(
      `https://team-collaboration-tool-server.vercel.app/payments/${id}`
    );
    setPayments(res.data);
  };

   const handlePayment = async (e) => {
    e.preventDefault();

    const payload = {
      studentId: id,
      ...paymentData,
      paidDate: paymentData.paymentDate,
    };

    const res = await axios.post(
      "https://team-collaboration-tool-server.vercel.app/payments",
      payload
    );

    if (res.data.insertedId) {
      fetchPayments();

      setPaymentData({
        amount: "",
        month: "",
        startDate: "",
        endDate: "",
        paymentMethod: "Cash",
        note: "",
      });
    }
  };

  const latestPayment =
  payments.length > 0
    ? [...payments].sort(
        (a, b) =>
          new Date(b.paidDate) - new Date(a.paidDate)
      )[0]
    : null;

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const generateReceipt = async(payment) => {
  const doc = new jsPDF();
  const qrData = {
  receiptId: payment._id,
  studentId: student._id,
  name: student.studentName,
  amount: payment.amount,
  month: payment.month,
  startDate: payment.startDate,
  endDate: payment.endDate,
};
const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(qrData));

  // Header
  doc.setFillColor(41, 128, 185);
  doc.rect(0, 0, 210, 30, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("MEHEDI EDUCARE PAYMENT RECEIPT", 105, 18, {
    align: "center",
  });

  // Reset color
  doc.setTextColor(0, 0, 0);

  // Receipt Info
  doc.setFontSize(11);

  doc.text(
    `Receipt Date: ${new Date().toLocaleDateString()}`,
    15,
    45
  );

  doc.text(
    `Receipt No: ${payment._id?.slice(-6) || "N/A"}`,
    140,
    45
  );

  // Student Info Box
  doc.roundedRect(15, 55, 180, 40, 3, 3);

  doc.setFontSize(14);
  doc.text("Student Information", 20, 65);

  doc.setFontSize(11);

doc.text(`Name: ${student.studentName}`, 20, 75);
doc.text(`Father's Name: ${student.fatherName || "N/A"}`, 20, 83);
doc.text(`Mother's Name: ${student.motherName || "N/A"}`, 20, 91);

  doc.text(
    `Phone: ${student.phone}`,
    110,
    75
  );

    doc.text(
    `School: ${student.schoolName || "N/A"}`,
    110,
    83
  );

  doc.text(
    `Class: ${student.className || "N/A"}`,
    110,
    91
  );



  // Payment Details
  doc.setFontSize(14);
  doc.text("Payment Details", 20, 110);

  doc.line(20, 114, 190, 114);

  doc.setFontSize(11);

  doc.text("Amount Paid:", 20, 125);
  doc.text(`${payment.amount} taka`, 80, 125);

  doc.text("Payment Method:", 20, 135);
  doc.text(payment.paymentMethod, 80, 135);

  doc.text("Paid Date:", 20, 145);
  doc.text(
    `${formatDate(payment.paidDate)}`, 80, 145);

  doc.text("Payment Month:", 20, 155);
  doc.text(payment.month, 80, 155);

  doc.text("Coverage Period:", 20, 165);
  doc.text(
    `${formatDate(payment.startDate)} to ${formatDate(payment.endDate)}`,
    80,
    165
  );

  // Paid Badge
  doc.setFillColor(46, 204, 113);
  doc.roundedRect(150, 120, 40, 15, 2, 2, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text("PAID", 170, 130, {
    align: "center",
  });

  doc.setTextColor(0, 0, 0);

  doc.addImage(qrCodeUrl, "PNG", 150, 150, 40, 40);
  doc.setFontSize(10);
doc.text("Scan to verify", 150, 150);

  // Note
  if (payment.note) {
    doc.setFontSize(11);
    doc.text("Note:", 20, 185);

    doc.text(payment.note, 35, 185);
  }

  // Signature Section
  doc.line(20, 245, 70, 245);
  doc.line(140, 245, 190, 245);

  doc.text("Guardian Signature", 20, 252);


  doc.text("Authorized Signature", 140, 252);

doc.text("Mehedi Hassan", 140, 242);

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(100);

  doc.text(
    "Thank you for your payment.",
    105,
    280,
    {
      align: "center",
    }
  );

  doc.save(
    `${student.studentName}-${payment.month}.pdf`
  );
};

  if (loading) return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  if (!student) return <div>Student not found</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">

      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-8 text-white shadow-2xl mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-white text-indigo-600 flex items-center justify-center text-4xl font-bold">
              {student.studentName?.charAt(0)}
            </div>

            <div>
              <h1 className="text-4xl font-bold">{student.studentName}</h1>
              <p>{student.className}</p>
              <p>{student.schoolName}</p>
            </div>
          </div>

          <Link to="/all-students" className="btn">
            Back
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Personal Information</h2>
            <p>Father: {student.fatherName}</p>
            <p>Mother: {student.motherName}</p>
            <p>Phone: {student.phone}</p>
            <p>Guardian: {student.guardianPhone}</p>
            <p>Address: {student.address}</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Academic Information</h2>
            <p>School: {student.schoolName}</p>
            <p>Class: {student.className}</p>
            <p>Admission: {student.admissionDate}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-5 mb-8">
        <div className="card bg-base-100 shadow-xl"><div className="card-body"><p>Monthly Salary</p><h2 className="text-3xl font-bold">৳{student.monthlySalary}</h2></div></div>
        <div className="card bg-base-100 shadow-xl"><div className="card-body"><p>Total Payments</p><h2 className="text-3xl font-bold">{payments.length}</h2></div></div>
        <div className="card bg-base-100 shadow-xl"><div className="card-body"><p>Salary Date</p><h2 className="text-3xl font-bold">{student.salaryDate}</h2></div></div>
          {/* Last Payment */}
  <div className="card bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl">
    <div className="card-body">
      <p>Last Payment</p>

      {latestPayment ? (
        <>
          <h2 className="text-3xl font-bold">
            ৳{latestPayment.amount}
          </h2>

          <p>{latestPayment.month}</p>

          <p className="text-xs">
            {latestPayment.paidDate}
          </p>
        </>
      ) : (
        <p>No Payment</p>
      )}
    </div>
  </div>
        
      </div>

      

      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title text-success">Add Payment</h2>

          <form onSubmit={handlePayment} className="grid md:grid-cols-2 gap-4">
            <input className="input input-bordered" placeholder="Amount"
              value={paymentData.amount}
              onChange={(e)=>setPaymentData({...paymentData,amount:e.target.value})}
            />

            <input className="input input-bordered" placeholder="Month"
              value={paymentData.month}
              onChange={(e)=>setPaymentData({...paymentData,month:e.target.value})}
            />
<label className="font-semibold">
  Month Start Date
</label>
            <input type="date" className="input input-bordered"
              value={paymentData.startDate}
              onChange={(e)=>setPaymentData({...paymentData,startDate:e.target.value})}
            />
<label className="font-semibold">
  Month End Date
</label>
            <input type="date" className="input input-bordered"
              value={paymentData.endDate}
              onChange={(e)=>setPaymentData({...paymentData,endDate:e.target.value})}
            />
            <label className="font-semibold">
  Payment Date
</label>

<input
  type="date"
  className="input input-bordered w-full"
  value={paymentData.paymentDate}
  onChange={(e) =>
    setPaymentData({
      ...paymentData,
      paymentDate: e.target.value,
    })
  }
  required
/>
<label className="font-semibold">
  Payment Method
</label>
            <select className="select select-bordered"
              value={paymentData.paymentMethod}
              onChange={(e)=>setPaymentData({...paymentData,paymentMethod:e.target.value})}>
              <option>Cash</option>
              <option>Bkash</option>
              <option>Nagad</option>
              <option>Bank</option>
            </select>

            <input className="input input-bordered" placeholder="Note"
              value={paymentData.note}
              onChange={(e)=>setPaymentData({...paymentData,note:e.target.value})}
            />

            <button className="btn btn-success md:col-span-2">
              Add Payment
            </button>
          </form>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title">Notes</h2>
          <p>{student.note || "No notes available"}</p>
        </div>
      </div>



{/* Payment History */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Payment History</h2>

          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Period</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Payment Date</th>
                  <th>Receipt</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id}>
                    <td>{payment.month}</td>
                    <td>{payment.startDate} - {payment.endDate}</td>
                    <td>{payment.amount}</td>
                    <td>{payment.paymentMethod}</td>
                    <td>{payment.paidDate}</td>
                    <td>
                      <button
                        onClick={() => generateReceipt(payment)}
                        className="btn btn-primary btn-sm"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>

    </div>
  );
}
