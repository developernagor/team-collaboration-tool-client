import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SERVER = "https://team-collaboration-tool-server.vercel.app";

export default function SubjectManagement() {
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [list, setList] = useState([]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    const res = await axios.get(`${SERVER}/subjects`);
    setList(res.data);
  };

  const addSubject = () => {
    if (!subject.trim()) return;

    if (subjects.includes(subject)) {
      return toast.error("Subject already added");
    }

    setSubjects([...subjects, subject]);
    setSubject("");
  };

  const removeSubject = (name) => {
    setSubjects(subjects.filter((s) => s !== name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!className)
      return toast.error("Select class");

    if (subjects.length === 0)
      return toast.error("Add at least one subject");

    try {
      await axios.post(`${SERVER}/subjects`, {
        className,
        subjects,
      });

      toast.success("Subjects saved");

      setClassName("");
      setSubjects([]);

      fetchSubjects();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Error"
      );
    }
  };

  const deleteClass = async (id) => {
    if (!window.confirm("Delete?")) return;

    await axios.delete(`${SERVER}/subjects/${id}`);

    toast.success("Deleted");

    fetchSubjects();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h2 className="text-3xl font-bold mb-6">
        Subject Management
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-6"
      >

        <select
          className="select select-bordered w-full"
          value={className}
          onChange={(e) =>
            setClassName(e.target.value)
          }
        >
          <option value="">Select Class</option>

          {[1,2,3,4,5,6,7,8,9,10].map((c)=>(
            <option key={c}>{c}</option>
          ))}

        </select>

        <div className="flex gap-3 mt-4">

          <input
            className="input input-bordered w-full"
            placeholder="Subject Name"
            value={subject}
            onChange={(e)=>
              setSubject(e.target.value)
            }
          />

          <button
            type="button"
            onClick={addSubject}
            className="btn btn-success"
          >
            Add
          </button>

        </div>

        <div className="flex flex-wrap gap-2 mt-5">

          {subjects.map((s)=>(
            <div
              key={s}
              className="badge badge-primary gap-2 p-4"
            >
              {s}

              <button
                type="button"
                onClick={()=>removeSubject(s)}
              >
                ✕
              </button>

            </div>
          ))}

        </div>

        <button className="btn btn-primary mt-6">
          Save Subjects
        </button>

      </form>

      <div className="overflow-x-auto mt-10">

        <table className="table">

          <thead>
            <tr>
              <th>Class</th>
              <th>Subjects</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {list.map((item)=>(
              <tr key={item._id}>

                <td>{item.className}</td>

                <td>
                  {item.subjects.join(", ")}
                </td>

                <td>

                  <button
                    onClick={()=>
                      deleteClass(item._id)
                    }
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