import { useEffect,useMemo, useState } from "react";
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
const [loadingStudents, setLoadingStudents] =
  useState(false);

  const [selectedExam, setSelectedExam] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const exam = exams.find((e) => e._id === selectedExam);

const isSubjectExam =
  exam?.examScope === "Subject Exam";

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

const classSubjects = useMemo(() => {
  if (isSubjectExam) {
    return exam?.subject ? [exam.subject] : [];
  }

  return (
    subjects.find(
      (item) => item.className === selectedClass
    )?.subjects || []
  );
}, [subjects, selectedClass, exam, isSubjectExam]);


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
  // Subject Exam
  if (isSubjectExam) {
    const result = getSubjectGrade(subjects[0].marks);

    return {
      subjects: [
        {
          ...subjects[0],
          grade: result.grade,
          gpa: result.gpa,
        },
      ],
      finalGpa: result.gpa,
      status: result.gpa === 0 ? "Fail" : "Pass",
    };
  }

  // Full Exam
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

    const exists = await axios.get(
      `${SERVER}/results/check`,
      {
        params: {
          examId: selectedExam,
          className: selectedClass,
        },
      }
    );

    if (exists.data.exists) {
      toast.error(
        "Results already published for this class."
      );
      return;
    }

    const payload = [...results]
      .map((student) => {
        const total = calculateTotal(student.marks);

        const average = Number(
          calculateAverage(student.marks)
        );

        const finalResult = calculateFinalResult(
          student.marks
        );

        const division = isSubjectExam
          ? null
          : calculateDivision(average);

        const failCount = failedSubjects(
          student.marks
        );

        const percentage = isSubjectExam
          ? null
          : passPercentage(student.marks);

        const highestMarks = isSubjectExam
          ? Number(student.marks[0].marks)
          : highestSubjectMarks(student.marks);

        return {
          examId: selectedExam,
          examName: exam.examName,

          examScope: exam.examScope,
          subject: exam.subject || null,

          className: selectedClass,

          studentId: student.studentId,
          studentName: student.studentName,

          subjects: finalResult.subjects,

          roll: student.roll,
          registration: student.registration,

          year: exam.year,

          total,
          average,

          grade: getFinalGrade(
            finalResult.finalGpa
          ),

          gpa: finalResult.finalGpa,

          status: finalResult.status,

          division,

          failedSubjects: failCount,

          passPercentage: percentage,

          highestSubjectMarks: highestMarks,

          createdAt: new Date(),
        };
      })
      .sort((a, b) => b.total - a.total)
      .map((student, index) => ({
        ...student,
        meritPosition: index + 1,
        topper: index === 0,
      }));

    console.log(payload);

    await axios.post(
      `${SERVER}/results`,
      payload
    );

    toast.success(
      "Results Saved Successfully"
    );

    setResults([]);
    setStudents([]);
    setSelectedExam("");
    setSelectedClass("");

  } catch (err) {
    console.log(err);
    toast.error("Failed to save");
  } finally {
    setSaving(false);
  }
};

useEffect(() => {
  if (!students.length || !classSubjects.length) return;
  if (results.length > 0) return;

  const sheet = students.map((student) => ({
    studentId: student._id,
    studentName: student.studentName,
    roll: student.roll,
    registration: student.registration,
    marks: classSubjects.map((subject) => ({
      subject,
      marks: "",
    })),
  }));

  setResults(sheet);
}, [students, classSubjects, results.length]);

useEffect(() => {
  setResults([]);
}, [selectedClass, selectedExam]);

const allMarksFilled = results.every((student) =>
  student.marks.every(
    (subject) => subject.marks !== ""
  )
);

const handleMarkChange = (
  studentIndex,
  subjectIndex,
  value
) => {
  const updated = [...results];

const mark = Math.max(
  0,
  Math.min(100, Number(value))
);

updated[studentIndex].marks[subjectIndex].marks =
  mark;

  setResults(updated);
};



const loadStudents = async () => {
  try {
    setLoadingStudents(true);

    const res = await axios.get(`${SERVER}/students`);

    setStudents(
      res.data.filter(
        (s) => s.className === selectedClass
      )
    );
  } finally {
    setLoadingStudents(false);
  }
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

const availableExams = exams.filter((item) =>
  selectedClass
    ? item.classes?.includes(selectedClass)
    : true
);


  return (
    <div className="max-w-7xl mx-auto p-6">

      <div className="bg-base-100 rounded-2xl shadow-xl p-6 mb-6">

  <h1 className="text-3xl font-bold">
    📚 Add Examination Result
  </h1>

  <p className="text-gray-500 mt-2">
    Select an examination and enter marks for students.
  </p>

</div>

      <div className="grid md:grid-cols-3 gap-5">
<div className="bg-base-100 rounded-2xl shadow-lg p-6 mb-8">

  <div className="grid md:grid-cols-4 gap-4">

    {/* Select Class */}

    <select
  className="select select-bordered w-full"
  value={selectedClass}
  onChange={(e) => {
    setSelectedClass(e.target.value);
    setSelectedExam("");
  }}
>
  <option value="">Select Class</option>

  {[1,2,3,4,5,6,7,8,9,10].map((cls) => (
    <option key={cls} value={String(cls)}>
      Class {cls}
    </option>
  ))}
</select>

{/* Select Exam */}
     <select
  className="select select-bordered w-full"
  value={selectedExam}
  onChange={(e) => setSelectedExam(e.target.value)}
>
  <option value="">Select Exam</option>

  {availableExams.map((exam) => (
    <option
      key={exam._id}
      value={exam._id}
    >
      {exam.examName}
      {exam.examScope === "Subject Exam"
        ? ` (${exam.subject})`
        : " (Full Exam)"}
    </option>
  ))}
</select>



   

    <div className="stats shadow">

      <div className="stat">

        <div className="stat-title">
          Students
        </div>

        <div className="stat-value text-primary">
          {students.length}
        </div>

      </div>

    </div>

    <div className="stats shadow">

      <div className="stat">

        <div className="stat-title">
          Subjects
        </div>

        <div className="stat-value text-success">
          {classSubjects.length}
        </div>

      </div>

    </div>

  </div>

</div>

{selectedClass && classSubjects.length > 0 && (
  <div className="overflow-x-auto mt-8 bg-base-100 rounded-2xl shadow-lg p-5">
    <table className="table table-zebra">
      <thead>
        <tr>
          <th>#</th>
          <th>Student Name</th>

          {classSubjects.map((subject) => (
            <th key={subject}>{subject}</th>
          ))}

          <th>Total</th>
          {!isSubjectExam && <th>Average</th>}
          <th>GPA</th>
          <th>Grade</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {results.map((student, studentIndex) => {
          const finalResult = calculateFinalResult(student.marks);

          const total = calculateTotal(student.marks);

          const average = calculateAverage(student.marks);

          return (
            <tr key={student.studentId}>
              <td>{studentIndex + 1}</td>

              <td className="font-semibold">
                {student.studentName}
              </td>

              {student.marks.map((subject, subjectIndex) => (
                <td key={subject.subject}>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="input input-bordered input-sm w-20"
                    value={subject.marks}
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

              <td className="font-bold">
                {total}
              </td>

              {!isSubjectExam && <td>{average}</td>}

              <td>{finalResult.finalGpa}</td>

              <td>{getFinalGrade(finalResult.finalGpa)}</td>

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
  </div>
)}

<div className="mt-8 flex justify-end">

  <button
  onClick={handleSave}
  disabled={
    saving ||
    loadingStudents ||
    !allMarksFilled
  }
  className="btn btn-success btn-lg"
>
  {saving ? "Saving..." : "💾 Save All Results"}
</button>

</div>

      </div>

    </div>
  );
}