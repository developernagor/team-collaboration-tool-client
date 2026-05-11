import React, { useEffect, useState } from "react";

function Users({ currentUser }) {
  const [users, setUsers] = useState([]);

  // ======================
  // FETCH USERS
  // ======================
  const fetchUsers = async () => {
    try {
      const res = await fetch(
        "https://team-collaboration-tool-server.vercel.app/users"
      );

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();

    const interval = setInterval(fetchUsers, 10000);
    return () => clearInterval(interval);
  }, []);

  // ======================
  // FORMAT LAST SEEN
  // ======================
  const formatLastSeen = (time) => {
    if (!time) return "Offline";

    const diff = Date.now() - new Date(time).getTime();
    const min = Math.floor(diff / 60000);

    if (min < 1) return "Just now";
    if (min < 60) return `${min} min ago`;

    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr} hr ago`;

    return new Date(time).toLocaleDateString();
  };

  return (
    <div className="w-64 bg-white border-r h-full overflow-y-auto">
      <h2 className="p-3 font-bold border-b">Users</h2>

      {Array.isArray(users) &&
      users.map((user) => {
        const isMe = user.email === currentUser?.email;

        const lastSeenTime = user.lastSeen ? new Date(user.lastSeen).getTime() : null;

const isOnline =
  lastSeenTime && Date.now() - lastSeenTime < 60000;

        return (
          <div key={user._id} className="p-3 border-b hover:bg-gray-100">
            <p className="font-medium">
              {user.name} {isMe && "(You)"}
            </p>

            <p className="text-xs text-gray-500">{user.email}</p>

            {/* STATUS */}
            <p className="text-[11px] mt-1">
              {isOnline ? (
                <span className="text-green-500 font-semibold">
                  Online
                </span>
              ) : (
                formatLastSeen(user.lastSeen)
              )}
            </p>
          </div>
        );
      })
      
      }
    </div>
  );
}

export default Users;