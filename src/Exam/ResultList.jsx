import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router";

const SERVER = "https://team-collaboration-tool-server.vercel.app";

export default function ResultList() {
  const [results, setResults] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [searchExam, setSearchExam] = useState("");
  const [searchClass, setSearchClass] = useState("");
  const [searchSubject, setSearchSubject] = useState("");

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await axios.get(`${SERVER}/results`);
      setResults(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    let data = [...results];

    if (searchExam) {
      data = data.filter((r) =>
        r.examName?.toLowerCase().includes(searchExam.toLowerCase())
      );
    }

    if (searchClass) {
      data = data.filter(
        (r) => r.className === searchClass
      );
    }

    if (searchSubject) {
      data = data.filter((r) =>
        r.subject?.toLowerCase().includes(searchSubject.toLowerCase())
      );
    }

    setFiltered(data);
  }, [searchExam, searchClass, searchSubject, results]);

  const deleteResult = async (id) => {
    if (!window.confirm("Delete this result?")) return;

    try {
      await axios.delete(`${SERVER}/results/${id}`);

      toast.success("Deleted Successfully");

      fetchResults();
    } catch (err) {
      toast.error("Delete Failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">

      <h2 className="text-3xl font-bold mb-6">
        Result List
      </h2>

      <div className="grid md:grid-cols-3 gap-4 mb-6">

        <input
          type="text"
          placeholder="Search Exam"
          className="input input-bordered"
          value={searchExam}
          onChange={(e)=>setSearchExam(e.target.value)}
        />

        <select
          className="select select-bordered"
          value={searchClass}
          onChange={(e)=>setSearchClass(e.target.value)}
        >
          <option value="">All Classes</option>

          {[1,2,3,4,5,6,7,8,9,10].map((c)=>(
            <option key={c}>{c}</option>
          ))}

        </select>

        <input
          type="text"
          placeholder="Search Subject"
          className="input input-bordered"
          value={searchSubject}
          onChange={(e)=>setSearchSubject(e.target.value)}
        />

      </div>

      <div className="overflow-x-auto">

        <table className="table table-zebra">

          <thead>
            <tr>
              <th>#</th>
              <th>Student</th>
              <th>Exam</th>
              <th>Class</th>
              <th>Subject</th>
              <th>Marks</th>
              <th>Grade</th>
              <th>GPA</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {filtered.map((item,index)=>(
              <tr key={item._id}>

                <td>{index+1}</td>

                <td>{item.studentName}</td>

                <td>{item.examName}</td>

                <td>{item.className}</td>

                <td>{item.subject}</td>

                <td>{item.marks}</td>

                <td>{item.grade}</td>

                <td>{item.gpa}</td>

                <td className="space-x-2">

                  <Link
                    to={`/marksheet/${item.studentId}/${item.examId}`}
                    className="btn btn-success btn-sm"
                  >
                    View
                  </Link>

                  <button
                    onClick={()=>deleteResult(item._id)}
                    className="btn btn-error btn-sm"
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