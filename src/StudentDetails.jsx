import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import axios from "axios";
import jsPDF from "jspdf";
import QRCode from "qrcode";

function StudentDetails() {
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [payments, setPayments] = useState([]);
  const [paymentData, setPaymentData] = useState({
  amount: "",
  startDate: "",
  endDate: "",
  paymentMethod: "Cash",
  note: "",
});
  const [loading, setLoading] = useState(true);


  const handlePayment = async (e) => {
  e.preventDefault();

  try {
    const newPayment = {
  studentId: id,
  month: paymentData.month,
  amount: paymentData.amount,
  startDate: paymentData.startDate,
  endDate: paymentData.endDate,
  paymentMethod: paymentData.paymentMethod,
  note: paymentData.note,
  paidDate: new Date()
    .toISOString()
    .split("T")[0],
};

    const res = await axios.post(
      "https://team-collaboration-tool-server.vercel.app/payments",
      newPayment
    );

    if (res.data.insertedId) {
      alert("Payment Added");

      setPaymentData({
        amount: "",
        month: "",
        paymentMethod: "Cash",
        note: "",
      });

    }
  } catch (error) {
    console.log(error);
  }
};
const fetchPayments = async () => {
  try {
    const res = await axios.get(
      `https://team-collaboration-tool-server.vercel.app/payments/${id}`
    );

    setPayments(res.data);
  } catch (error) {
    console.log(error);
  }
};


const latestPayment =
  payments.length > 0
    ? [...payments].sort(
        (a, b) =>
          new Date(b.endDate) - new Date(a.endDate)
      )[0]
    : null;

const today = new Date();
today.setHours(0, 0, 0, 0);

let isDue = true;

if (latestPayment?.endDate) {
  const paymentEnd = new Date(latestPayment.endDate);
  paymentEnd.setHours(0, 0, 0, 0);

  isDue = paymentEnd < today;
}

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

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(
          `https://team-collaboration-tool-server.vercel.app/students/${id}`
        );

        setStudent(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  useEffect(() => {
  axios
    .get(`https://team-collaboration-tool-server.vercel.app/payments/${id}`)
    .then((res) => {
      setPayments(res.data);
    });
}, [id]);



  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold text-red-500">
          Student Not Found
        </h2>

        <Link
          to="/students"
          className="btn btn-primary mt-5"
        >
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-4xl font-bold">
              Student Details
            </h2>

            <Link
              to="/all-students"
              className="btn btn-outline"
            >
              Back
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">

            <div className="space-y-3">
              <h3 className="text-xl font-bold border-b pb-2">
                Personal Information
              </h3>

              <p>
                <strong>Name:</strong>{" "}
                {student.studentName}
              </p>

              <p>
                <strong>Father Name:</strong>{" "}
                {student.fatherName || "N/A"}
              </p>

              <p>
                <strong>Mother Name:</strong>{" "}
                {student.motherName || "N/A"}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {student.phone}
              </p>

              <p>
                <strong>Guardian Phone:</strong>{" "}
                {student.guardianPhone || "N/A"}
              </p>

              <p>
                <strong>Address:</strong>{" "}
                {student.address || "N/A"}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold border-b pb-2">
                Academic Information
              </h3>

              <p>
                <strong>School:</strong>{" "}
                {student.schoolName || "N/A"}
              </p>

              <p>
                <strong>Class:</strong>{" "}
                {student.className || "N/A"}
              </p>

              <p>
                <strong>Admission Date:</strong>{" "}
                {student.admissionDate || "N/A"}
              </p>
            </div>

          </div>

          <div className="divider"></div>

          <div className="grid md:grid-cols-3 gap-5">

            <div className="stat shadow rounded-xl">
              <div className="stat-title">
                Monthly Salary
              </div>

              <div className="stat-value text-primary">
                ৳{student.monthlySalary || 0}
              </div>
            </div>

            <div className="stat shadow rounded-xl">
              <div className="stat-title">
                Salary Date
              </div>

              <div className="stat-value text-secondary">
                {student.salaryDate || "N/A"}
              </div>
            </div>

            <div className="stat shadow rounded-xl">
  <div className="stat-title">
    Payment Status
  </div>

  <div className="stat-value text-lg">
    <span
      className={`badge badge-lg ${
        isDue
          ? "badge-error"
          : "badge-success"
      }`}
    >
      {isDue ? "Due" : "Paid"}
    </span>
  </div>
</div>

          </div>

          <div className="mt-6 p-4 border rounded-lg bg-base-200">
  <h3 className="font-bold text-lg mb-2">
    Last Paid Period
  </h3>

  {latestPayment ? (
    <p>
      {latestPayment.startDate} → {latestPayment.endDate}
    </p>
  ) : (
    <p>No payment history found</p>
  )}
</div>

          <div className="divider"></div>

<h2 className="text-2xl font-bold mb-4">
  Add Payment
</h2>

<form
  onSubmit={handlePayment}
  className="grid md:grid-cols-2 gap-4"
>
  <input
    type="number"
    placeholder="Amount"
    className="input input-bordered"
    value={paymentData.amount}
    onChange={(e) =>
      setPaymentData({
        ...paymentData,
        amount: e.target.value,
      })
    }
    required
  />

  <input
    type="text"
    placeholder="Month (June 2026)"
    className="input input-bordered"
    value={paymentData.month}
    onChange={(e) =>
      setPaymentData({
        ...paymentData,
        month: e.target.value,
      })
    }
    required
  />
  <input
  type="date"
  className="input input-bordered"
  value={paymentData.startDate}
  onChange={(e) =>
    setPaymentData({
      ...paymentData,
      startDate: e.target.value,
    })
  }
  required
/>
<input
  type="date"
  className="input input-bordered"
  value={paymentData.endDate}
  onChange={(e) =>
    setPaymentData({
      ...paymentData,
      endDate: e.target.value,
    })
  }
  required
/>

  <select
    className="select select-bordered"
    value={paymentData.paymentMethod}
    onChange={(e) =>
      setPaymentData({
        ...paymentData,
        paymentMethod: e.target.value,
      })
    }
  >
    <option>Cash</option>
    <option>Bkash</option>
    <option>Nagad</option>
    <option>Bank</option>
  </select>

  <input
    type="text"
    placeholder="Note"
    className="input input-bordered"
    value={paymentData.note}
    onChange={(e) =>
      setPaymentData({
        ...paymentData,
        note: e.target.value,
      })
    }
  />

  <button
    type="submit"
    className="btn btn-success md:col-span-2"
  >
    Add Payment
  </button>
</form>

          <div className="divider"></div>

          <div>
            <h3 className="text-xl font-bold mb-3">
              Notes
            </h3>

            <div className="border rounded-lg p-4 bg-base-200">
              {student.note || "No notes available"}
            </div>
          </div>


          <div className="divider"></div>

<h2 className="text-2xl font-bold mb-4">
  Payment History
</h2>

<div className="overflow-x-auto">
  <table className="table">
    <thead>
  <tr>
    <th>Month</th>
    <th>Period</th>
    <th>Amount</th>
    <th>Paid Date</th>
    <th>Method</th>
    <th>Note</th>
    <th>Receipt</th>
  </tr>
</thead>

    <tbody>
  {payments.map((payment) => (
    <tr key={payment._id}>
        <td>
        {payment.month}
      </td>

        
      <td>
        {payment.startDate} <br />
        to <br />
        {payment.endDate}
      </td>

      <td>৳{payment.amount}</td>

      <td>{payment.paidDate}</td>

      <td>{payment.paymentMethod}</td>

      <td>{payment.note}</td>
      <td>
  <button
    onClick={() => generateReceipt(payment)}
    className="btn btn-primary btn-xs"
  >
    PDF
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

export default StudentDetails;