import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SERVER =
  "https://team-collaboration-tool-server.vercel.app";

export default function AddResult() {

  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
const [results, setResults] = useState([]);
// const [marksData, setMarksData] = useState([]);
const [saving, setSaving] = useState(false);

  const [selectedExam, setSelectedExam] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

// useEffect(() => {
//   if (!selectedClass) return;

//   loadStudents();
// }, [selectedClass]);


  useEffect(() => {
  if (selectedClass) {
    loadStudents();
  }
}, [selectedClass]);

  useEffect(() => {
    loadExam();
    loadSubjects();
  }, []);

  const loadExam = async () => {
    const res = await axios.get(`${SERVER}/exams`);
    setExams(res.data);
  };

  const loadSubjects = async () => {
    const res = await axios.get(`${SERVER}/subjects`);
    setSubjects(res.data);
  };

  const classSubjects =
    subjects.find(
      (item) => item.className === selectedClass
    )?.subjects || [];

const loadStudents = async () => {
  try {
    const res = await axios.get(`${SERVER}/students`);

    const filtered = res.data.filter(
      (student) => student.className === selectedClass
    );

    setStudents(filtered);
  } catch (err) {
    console.log(err);
  }
};

// Calculate Total Marks
const calculateTotal = (marks) => {
  return marks.reduce(
    (sum, item) => sum + Number(item.marks || 0),
    0
  );
};

// Calculate Average Marks
const calculateAverage = (marks) => {
  if (!marks.length) return 0;

  return (
    calculateTotal(marks) / marks.length
  ).toFixed(2);
};

// Calculate GPA & Grade
const getSubjectGrade = (marks) => {
  const m = Number(marks);

  if (m >= 80) return { grade: "A+", gpa: 5.0 };
  if (m >= 70) return { grade: "A", gpa: 4.0 };
  if (m >= 60) return { grade: "A-", gpa: 3.5 };
  if (m >= 50) return { grade: "B", gpa: 3.0 };
  if (m >= 40) return { grade: "C", gpa: 2.0 };
  if (m >= 33) return { grade: "D", gpa: 1.0 };

  return { grade: "F", gpa: 0 };
};


    const getFinalGrade = (gpa) => {
  if (gpa === 5) return "A+";
  if (gpa >= 4) return "A";
  if (gpa >= 3.5) return "A-";
  if (gpa >= 3) return "B";
  if (gpa >= 2) return "C";
  if (gpa >= 1) return "D";
  return "F";
};

const calculateFinalResult = (subjects) => {

  let totalGpa = 0;

  let hasFail = false;

  const updatedSubjects = subjects.map((item) => {

    const result = getSubjectGrade(item.marks);

    if (result.gpa === 0) hasFail = true;

    totalGpa += result.gpa;

    return {
      ...item,
      grade: result.grade,
      gpa: result.gpa,
    };
  });

  const finalGpa = hasFail
    ? 0
    : Number((totalGpa / updatedSubjects.length).toFixed(2));



  return {
    subjects: updatedSubjects,
    finalGpa,
    status: hasFail ? "Fail" : "Pass",
  };
};

const calculateDivision = (average) => {
  if (average >= 80) return "Star";
  if (average >= 70) return "First";
  if (average >= 60) return "Second";
  if (average >= 50) return "Third";
  return "Fail";
};

const failedSubjects = (subjects) => {
  return subjects.filter(
    (item) => Number(item.marks) < 33
  ).length;
};

const passPercentage = (subjects) => {
  const passed = subjects.filter(
    (item) => Number(item.marks) >= 33
  ).length;

  return (
    (passed / subjects.length) * 100
  ).toFixed(2);
};

const highestSubjectMarks = (subjects) => {
  return Math.max(
    ...subjects.map((item) =>
      Number(item.marks)
    )
  );
};



const handleSave = async () => {
  if (!selectedExam)
    return toast.error("Select Exam");

  if (!selectedClass)
    return toast.error("Select Class");

  try {
    setSaving(true);

    const exam = exams.find(
      (e) => e._id === selectedExam
    );

const payload = [...results]
  .map((student) => {

    const total = calculateTotal(student.marks);
    const average = Number(calculateAverage(student.marks));
  const finalResult = calculateFinalResult(student.marks);
    const division = calculateDivision(average);

const failCount = failedSubjects(student.marks);

const percentage = passPercentage(student.marks);

const highestMarks = highestSubjectMarks(
  student.marks
);

    return {
  examId: selectedExam,
  examName: exams.find(
    (e) => e._id === selectedExam
  )?.examName,

  className: selectedClass,

  studentId: student.studentId,
  studentName: student.studentName,

  subjects: finalResult.subjects,


  total,
  average,

  grade:getFinalGrade(finalResult.finalGpa),
  gpa: finalResult.finalGpa,

  status: finalResult.status,

  division,
  failedSubjects: failCount,
  passPercentage: percentage,
  highestSubjectMarks: highestMarks,

  createdAt: new Date(),
};
  })

  // Sort by Total Marks
  .sort((a, b) => b.total - a.total)

  // Assign Position
  .map((student, index) => ({
    ...student,
    meritPosition: index + 1,
     topper: index === 0,
  }));
  console.log("Payload:", payload);

    await axios.post(
      `${SERVER}/results`,
      payload
    );

    toast.success("Results Saved Successfully");
  } catch (err) {
    console.log(err);
    toast.error("Failed to save");
  } finally {
    setSaving(false);
  }
};

useEffect(() => {
  if (!students.length || !classSubjects.length) return;

  const sheet = students.map((student) => ({
    studentId: student._id,
    studentName: student.studentName,
    marks: classSubjects.map((subject) => ({
      subject,
      marks: "",
    })),
  }));

  setResults(sheet);

}, [students, classSubjects]);

const handleMarkChange = (
  studentIndex,
  subjectIndex,
  value
) => {
  const updated = [...results];

  updated[studentIndex].marks[subjectIndex].marks =
    Number(value);

  setResults(updated);
};



// const updateMarks = (studentId, marks) => {
//   const updated = marksData.map((item) => {
//     if (item.studentId !== studentId) return item;

//     const number = Number(marks);

//     let grade = "";
//     let gpa = 0;

//     if (number >= 80) {
//       grade = "A+";
//       gpa = 5.0;
//     } else if (number >= 70) {
//       grade = "A";
//       gpa = 4.0;
//     } else if (number >= 60) {
//       grade = "A-";
//       gpa = 3.5;
//     } else if (number >= 50) {
//       grade = "B";
//       gpa = 3.0;
//     } else if (number >= 40) {
//       grade = "C";
//       gpa = 2.0;
//     } else if (number >= 33) {
//       grade = "D";
//       gpa = 1.0;
//     } else {
//       grade = "F";
//       gpa = 0;
//     }

//     return {
//       ...item,
//       marks,
//       grade,
//       gpa,
//       status: number >= 33 ? "Pass" : "Fail",
//     };
//   });

//   setMarksData(updated);
// };

// const saveResults = async () => {
//   if (!selectedExam)
//     return toast.error("Select Exam");

//   if (!selectedClass)
//     return toast.error("Select Class");

//   if (!selectedSubject)
//     return toast.error("Select Subject");

//   try {
//     setSaving(true);

//     const exam = exams.find(
//       (e) => e._id === selectedExam
//     );

//     const payload = marksData.map((item) => ({
//       examId: selectedExam,
//       examName: exam?.examName,

//       className: selectedClass,
//       subject: selectedSubject,

//       studentId: item.studentId,
//       studentName: item.studentName,
//       roll: item.roll,

//       marks: Number(item.marks),
//       grade: item.grade,
//       gpa: item.gpa,
//       status: item.status,

//       year: exam?.year,
//       createdAt: new Date(),
//     }));

//     await axios.post(
//       `${SERVER}/results`,
//       payload
//     );

//     toast.success("Results Saved Successfully");

//   } catch (err) {
//     console.log(err);

//     toast.error(
//       err.response?.data?.message ||
//       "Failed to save results"
//     );
//   } finally {
//     setSaving(false);
//   }
// };


  return (
    <div className="max-w-7xl mx-auto p-6">

      <h2 className="text-3xl font-bold mb-8">
        Add Result
      </h2>

      <div className="grid md:grid-cols-3 gap-5">

        {/* Exam */}

        <select
          className="select select-bordered"
          value={selectedExam}
          onChange={(e)=>setSelectedExam(e.target.value)}
        >
          <option value="">Select Exam</option>

          {exams.map((exam)=>(
            <option
              key={exam._id}
              value={exam._id}
            >
              {exam.examName}
            </option>
          ))}

        </select>

        {/* Class */}

        <select
          className="select select-bordered"
          value={selectedClass}
          onChange={(e)=>setSelectedClass(e.target.value)}
        >
          <option value="">
            Select Class
          </option>

          {[1,2,3,4,5,6,7,8,9,10].map((cls)=>(
            <option key={cls}>
              {cls}
            </option>
          ))}

        </select>

        {/* Subject */}
        <table className="table table-zebra">

<thead>
  <tr>
    <th>#</th>
    <th>Student Name</th>

    {classSubjects.map((subject) => (
      <th key={subject}>{subject}</th>
    ))}

    <th>Total</th>
    <th>Average</th>
    <th>GPA</th>
    <th>Grade</th>
    <th>Status</th>
  </tr>
</thead>

<tbody>
  {results.map((student, studentIndex) => {

 const total = calculateTotal(student.marks);
const average = Number(calculateAverage(student.marks));

const finalResult = calculateFinalResult(student.marks);

    return (
      <tr key={student.studentId}>

        <td>{studentIndex + 1}</td>

        <td>{student.studentName}</td>

        {student.marks.map((mark, subjectIndex) => (
          <td key={subjectIndex}>
            <input
              type="number"
              min="0"
              max="100"
              className="input input-bordered input-sm w-20"
              value={mark.marks}
              onChange={(e) =>
                handleMarkChange(
                  studentIndex,
                  subjectIndex,
                  e.target.value
                )
              }
            />
          </td>
        ))}

        <td>{total}</td>

        <td>{average.toFixed(2)}</td>

        <td>{finalResult.finalGpa.toFixed(2)}</td>
        <td>
          <span className="badge badge-primary">
           {finalResult.finalGpa === 5
  ? "A+"
  : finalResult.finalGpa >= 4
  ? "A"
  : finalResult.finalGpa >= 3.5
  ? "A-"
  : finalResult.finalGpa >= 3
  ? "B"
  : finalResult.finalGpa >= 2
  ? "C"
  : finalResult.finalGpa >= 1
  ? "D"
  : "F"}
          </span>
        </td>

        <td>
          <span
            className={`badge ${
              finalResult.status === "Pass"
                ? "badge-success"
                : "badge-error"
            }`}
          >
            {finalResult.status}
          </span>
        </td>

      </tr>
    );
  })}
</tbody>

</table>

{/* {students.length > 0 && (
  <div className="overflow-x-auto mt-10">

    <table className="table table-zebra">

      <thead>

        <tr>
          <th>#</th>
          <th>Student</th>
          <th>Roll</th>
          <th>Marks</th>
          <th>Grade</th>
          <th>GPA</th>
          <th>Status</th>
        </tr>

      </thead>

      <tbody>

        {marksData.map((item, index) => (

          <tr key={item.studentId}>

            <td>{index + 1}</td>

            <td>{item.studentName}</td>

            <td>{item.roll}</td>

            <td>

              <input
                type="number"
                className="input input-bordered input-sm w-24"
                value={item.marks}
                onChange={(e) =>
                  updateMarks(
                    item.studentId,
                    e.target.value
                  )
                }
              />

            </td>

            <td>{item.grade}</td>

            <td>{item.gpa}</td>

            <td>
              <span
                className={`badge ${
                  item.status === "Pass"
                    ? "badge-success"
                    : "badge-error"
                }`}
              >
                {item.status}
              </span>
            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>
)} */}

       
        {/* <div className="overflow-x-auto mt-8">
  <table className="table table-zebra">
    <thead>
      <tr>
        <th>#</th>
        <th>Student Name</th>
        <th>{selectedSubject || "Marks"}</th>
      </tr>
    </thead>

    <tbody>
      {results.map((student, index) => (
        <tr key={student.studentId}>
          <td>{index + 1}</td>

          <td>{student.studentName}</td>

          <td>
            <input
              type="number"
              className="input input-bordered w-24"
              min="0"
              max="100"
              value={student.marks}
              onChange={(e) => {
                const updated = [...results];
                updated[index].marks = e.target.value;
                setResults(updated);
              }}
            />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div> */}

<div className="mt-8 flex justify-end">

  <button
    onClick={handleSave}
    disabled={saving}
    className="btn btn-success btn-lg"
  >
    {saving
      ? "Saving..."
      : "💾 Save All Results"}
  </button>

</div>

      </div>

    </div>
  );
}