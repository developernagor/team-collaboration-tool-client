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

const generateReceipt = async (payment) => {
const doc = new jsPDF("p", "mm", "a4");

const qrData = {
receiptId: payment._id,
studentId: student._id,
studentName: student.studentName,
amount: payment.amount,
month: payment.month,
paymentDate: payment.paidDate,
};

const qrCodeUrl = await QRCode.toDataURL(
JSON.stringify(qrData)
);

const receiptNo = `MED-${new Date().getFullYear()}-${payment._id
    ?.slice(-5)
    .toUpperCase()}`;

const formatDate = (date) => {
if (!date) return "N/A";


return new Date(date).toLocaleDateString(
  "en-GB",
  {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }
);
};

// HEADER
doc.setFillColor(79, 70, 229);
doc.rect(0, 0, 210, 35, "F");

doc.setTextColor(255, 255, 255);

doc.setFontSize(24);
doc.setFont("helvetica", "bold");

doc.text(
"MEHEDI EDUCARE",105,14,{ align: "center" });

doc.setFontSize(12);

doc.text(
"Student Tuition Payment Receipt",105,24,{ align: "center" });

doc.setFontSize(10);

doc.text(
`Receipt No: ${receiptNo}`,15,30);

doc.text(
`Generated: ${formatDate(new Date())}`,195,30,{ align: "right" });

// PAID BADGE

doc.setFillColor(16, 185, 129);

doc.roundedRect(155,42,35,12,3,3,"F");

doc.setTextColor(255, 255, 255);

doc.setFontSize(12);

doc.text("PAID",172,50,{align: "center",});

// STUDENT INFO CARD

doc.setFillColor(248, 250, 252);

doc.roundedRect(15,60,180,45,4,4,"F");

doc.setDrawColor(220);

doc.roundedRect(15,60,180,45,4,4);

doc.setTextColor(0, 0, 0);

doc.setFontSize(14);

doc.setFont("helvetica", "bold");

doc.text("Student Information",20,70);

doc.setFontSize(11);

doc.setFont("helvetica","normal");

doc.text(`Name: ${student.studentName}`,20,80);

doc.text(`Father: ${student.fatherName || "N/A" }`,20,88);

doc.text(`Mother: ${student.motherName || "N/A" }`,20,96);

doc.text(`Phone: ${student.phone || "N/A" }`,110,80);

doc.text(`School: ${student.schoolName || "N/A" }`,110,88);

doc.text(`Class: ${student.className || "N/A" }`,110,96);

// AMOUNT CARD

doc.setFillColor(239, 246, 255);

doc.roundedRect(15,115,180,25,4,4,"F");

doc.setFont("helvetica","bold");

doc.setTextColor(37,99,235);
doc.setFontSize(12);

doc.text("TOTAL AMOUNT PAID",20,128);
doc.setFontSize(24);

doc.text(`${payment.amount} taka`,170,130,{align: "right",});

// PAYMENT TABLE

doc.setFillColor(79, 70, 229);

doc.rect(15,150,180,10,"F");

doc.setTextColor(255,255,255);

doc.setFontSize(11);

doc.text("Month",20,15);

doc.text("Method",70,157);

doc.text("Paid Date",110,157);

doc.text("Amount",160,157);

doc.setTextColor(0,0,0);

doc.rect(15,160,180,14);

doc.text(payment.month,20,169);

doc.text(payment.paymentMethod,70,169);

doc.text(formatDate(payment.paidDate),110,169);

doc.text(`${payment.amount} taka`,160,169);

// COVERAGE PERIOD

doc.setFont("helvetica","bold");

doc.text("Coverage Period",20,190);

doc.setFont("helvetica","normal");

doc.text(`${formatDate(payment.startDate)}  to  ${formatDate(payment.endDate)}`,20,198);

// NOTE

if (payment.note) {doc.setFont("helvetica","bold");

```
doc.text("Note",20,214);

doc.setFont("helvetica","normal");

const splitText = doc.splitTextToSize(payment.note,100);

doc.text(splitText,20,222);
```
}

// QR SECTION
doc.setFillColor(255,255,255);

doc.roundedRect(145,185,45,45,3,3,"F");

doc.addImage(qrCodeUrl,"PNG",148,188,38,38);

doc.setFontSize(9);

doc.text("Scan to verify",167,233,{align: "center",});

// WATERMARK

doc.setTextColor(235,235,235);

doc.setFontSize(45);

doc.text("MEHEDI EDUCARE",105,155,{angle: 45,align: "center",});

doc.setTextColor(0,0,0);

// SIGNATURE

doc.line(20,250,70,250);

doc.line(140,250,190,250);

doc.setFontSize(10);

doc.text("Guardian Signature",20,257);

doc.text("Authorized Signature",140,257);

doc.setFont("helvetica","bold");

doc.text("Mehedi Hassan Nagor",140,246);

// FOOTER

doc.setFillColor(31,41,55);

doc.rect(0,275,210,22,"F");

doc.setTextColor(255,255,255);

doc.setFontSize(10);

doc.text("MEHEDI EDUCARE",105,283,{align: "center",});

doc.text("Thank you for your payment",105,289,{align: "center",});

doc.save(`${student.studentName}-${payment.month}-Receipt.pdf`);};


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
              <p>{student.schoolName}</p>
              <p>Class: {student.className}</p>
              
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
    <h2 className="card-title">
      Personal Information
    </h2>

    <p>Father: {student.fatherName}</p>
    <p>Mother: {student.motherName}</p>
    <p>Phone: {student.phone}</p>
    <p>Guardian: {student.guardianPhone}</p>
    <p>Address: {student.address}</p>

    <div className="mt-4 flex gap-2">
      <a
        href={`tel:${student.guardianPhone}`}
        className="btn btn-primary btn-sm"
      >
        📞 Call
      </a>

      <a
        href={`https://wa.me/${
          student.whatsapp || student.guardianPhone
        }?text=${encodeURIComponent(
          `Assalamu Alaikum, regarding ${student.studentName}'s tuition payment.`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-success btn-sm"
      >
        💬 WhatsApp
      </a>
    </div>

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
