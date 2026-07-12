import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SERVER = "https://team-collaboration-tool-server.vercel.app";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const loadUsers = () => {
    axios.get(`${SERVER}/users`).then((res) => {
      setUsers(res.data);
    });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateRole = async (id, role) => {
    try {
      await axios.patch(`${SERVER}/users/${id}/role`, {
        role,
      });

      toast.success("Role Updated");
      loadUsers();
    } catch {
      toast.error("Failed");
    }
  };

  const filtered = users.filter((user) =>
    `${user.name} ${user.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6">

      <h2 className="text-3xl font-bold mb-5">
        User Management
      </h2>

      <input
        className="input input-bordered w-full mb-5"
        placeholder="Search by name/email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto rounded-xl shadow">

        <table className="table">

          <thead>
            <tr>
              <th>#</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Current Role</th>
              <th>Change Role</th>
            </tr>
          </thead>

          <tbody>

            {filtered.map((user, index) => (

              <tr key={user._id}>
                <td>{index + 1}</td>

                <td>
                  <img
                    src={
                      user.photoURL ||
                      "https://i.ibb.co/4pDNDk1/avatar.png"
                    }
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </td>

                <td>{user.name}</td>

                <td>{user.email}</td>

                <td>
                  <span className="badge badge-primary">
                    {user.role || "user"}
                  </span>
                </td>

                <td>

                  <select
                    className="select select-bordered"
                    value={user.role || "user"}
                    onChange={(e) =>
                      updateRole(user._id, e.target.value)
                    }
                  >
                    <option value="user">User</option>
                    <option value="student">Student</option>
                    <option value="bondhu">Bondhu</option>
                    <option value="admin">Admin</option>
                  </select>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
    </div>
  );
}