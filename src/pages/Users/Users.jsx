import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../../firebase/firebase.config";

function Users() {
  const [users, setUsers] = useState([]);
  

  useEffect(() => {
    axios.get("https://team-collaboration-tool-server.vercel.app/users").then((res) => {
      setUsers(res.data);
    });
  }, []);
  // console.log(users)

  return (
    <div className="p-4">
      <h2 className="font-bold mb-3">Users</h2>

      {users.map((user) => (
        <div
          key={user._id}
          className="p-3 bg-base-200 rounded mb-2"
        >
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      ))}
    </div>
  );
}

export default Users;