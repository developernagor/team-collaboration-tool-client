import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SERVER = "https://team-collaboration-tool-server.vercel.app";

export default function ExamRoutine() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");

  const [routine, setRoutine] = useState([]);

  const [formData, setFormData] = useState({
    subject: "",
    examDate: "",
    startTime: "",
    endTime: "",
    room: "",
    invigilator: "",
  });

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    if (selectedExam) {
      fetchRoutine();
    }
  }, [selectedExam]);

  const fetchExams = async () => {
    try {
      const res = await axios.get(`${SERVER}/exams`);
      setExams(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchRoutine = async () => {
    try {
      const res = await axios.get(
        `${SERVER}/exam-routine/${selectedExam}`
      );

      setRoutine(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedExam)
      return toast.error("Select Exam");

    if (!formData.subject)
      return toast.error("Subject Required");

    try {
      await axios.post(`${SERVER}/exam-routines`, {
        examId: selectedExam,
        ...formData,
      });

      toast.success("Routine Added");

      setFormData({
        subject: "",
        examDate: "",
        startTime: "",
        endTime: "",
        room: "",
        invigilator: "",
      });

      fetchRoutine();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Error"
      );
    }
  };

  const deleteRoutine = async (id) => {
    if (!window.confirm("Delete this routine?"))
      return;

    await axios.delete(
      `${SERVER}/exam-routine/${id}`
    );

    toast.success("Deleted");

    fetchRoutine();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">

      <h2 className="text-3xl font-bold mb-6">
        Exam Routine
      </h2>

      <div className="bg-white shadow rounded-xl p-6">

        <div className="mb-5">

          <label className="font-semibold">
            Select Exam
          </label>

          <select
            className="select select-bordered w-full mt-2"
            value={selectedExam}
            onChange={(e) =>
              setSelectedExam(e.target.value)
            }
          >
            <option value="">
              Choose Exam
            </option>

            {exams.map((exam) => (
              <option
                key={exam._id}
                value={exam._id}
              >
                {exam.examName} ({exam.year})
              </option>
            ))}
          </select>

        </div>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-3 gap-4"
        >

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            className="input input-bordered"
            value={formData.subject}
            onChange={handleChange}
          />

          <input
            type="date"
            name="examDate"
            className="input input-bordered"
            value={formData.examDate}
            onChange={handleChange}
          />

          <input
            type="time"
            name="startTime"
            className="input input-bordered"
            value={formData.startTime}
            onChange={handleChange}
          />

          <input
            type="time"
            name="endTime"
            className="input input-bordered"
            value={formData.endTime}
            onChange={handleChange}
          />

          <input
            type="text"
            name="room"
            placeholder="Room No"
            className="input input-bordered"
            value={formData.room}
            onChange={handleChange}
          />

          <input
            type="text"
            name="invigilator"
            placeholder="Invigilator"
            className="input input-bordered"
            value={formData.invigilator}
            onChange={handleChange}
          />

          <button className="btn btn-primary md:col-span-3">
            Save Routine
          </button>

        </form>

      </div>

      <div className="overflow-x-auto mt-8">

        <table className="table table-zebra">

          <thead>

            <tr>
              <th>#</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Time</th>
              <th>Room</th>
              <th>Invigilator</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {routine.map((item, index) => (

              <tr key={item._id}>

                <td>{index + 1}</td>

                <td>{item.subject}</td>

                <td>{item.examDate}</td>

                <td>
                  {item.startTime} - {item.endTime}
                </td>

                <td>{item.room}</td>

                <td>{item.invigilator}</td>

                <td>

                  <button
                    className="btn btn-error btn-sm"
                    onClick={() =>
                      deleteRoutine(item._id)
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}