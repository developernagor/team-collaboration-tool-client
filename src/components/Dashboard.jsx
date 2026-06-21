import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PasswordGate from "./PasswordGate";


function Dashboard() {
  const [user, setUser] = useState(null);
  const [dashboardUser, setDashboardUser] =
  useState(null);

  const [favoriteMessages, setFavoriteMessages] =
  useState([]);

const [page, setPage] =
  useState(1);

const [totalPages, setTotalPages] =
  useState(1);

  useEffect(() => {
  if (!user?.email) return;

  fetch(
    `https://team-collaboration-tool-server.vercel.app/favorite-messages/${user.email}?page=${page}&limit=5`
  )
    .then((res) => res.json())
    .then((data) => {
      setFavoriteMessages(
        data.messages
      );

      setTotalPages(
        data.totalPages
      );
    });
}, [user, page]);
  
  const [stats, setStats] = useState({
  totalMessages: 0,
  totalPhotos: 0,
  totalReplies: 0,
  totalReactions: 0,
});

const chartData = [
  {
    name: "Messages",
    value: stats.totalMessages,
  },
  {
    name: "Photos",
    value: stats.totalPhotos,
  },
  {
    name: "Replies",
    value: stats.totalReplies,
  },
  {
    name: "Reactions",
    value: stats.totalReactions,
  },
];

const [loading, setLoading] = useState(true);

const [totalTimeSpent, setTotalTimeSpent] =
  useState(0);



useEffect(() => {
  if (!user?.email) return;

  const interval = setInterval(
    async () => {
      try {
        await fetch(
          "https://team-collaboration-tool-server.vercel.app/users/time-spent",
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              seconds: 10,
            }),
          }
        );
      } catch (err) {
        console.log(err);
      }
    },
    10000
  );

  return () =>
    clearInterval(interval);
}, [user]);

useEffect(() => {
  if (!user?.email) return;

  const interval = setInterval(
    async () => {
      const res = await fetch(
        `https://team-collaboration-tool-server.vercel.app/dashboard/${user.email}`
      );

      const data =
        await res.json();

      if (data.success) {
        setTotalTimeSpent(
          data.totalTimeSpent || 0
        );
      }
    },
    10000
  );

  return () =>
    clearInterval(interval);
}, [user]);

useEffect(() => {
  if (!user?.email) return;

  const fetchDashboard = async () => {
    try {
      const res = await fetch(
        `https://team-collaboration-tool-server.vercel.app/dashboard/${user.email}`
      );

      const data = await res.json();

  if (data.success) {
  setStats(data.stats);
  setDashboardUser(data.user);
  setTotalTimeSpent(
    data.totalTimeSpent || 0
  );
}
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  fetchDashboard();
}, [user]);


  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsub();
  }, []);

  const [sessionTime, setSessionTime] =
  useState(0);

useEffect(() => {
  const startTime = Date.now();

  const interval = setInterval(() => {
    setSessionTime(
      Math.floor((Date.now() - startTime) / 1000)
    );
  }, 1000);

  return () => clearInterval(interval);
}, []);

let liveTime = totalTimeSpent;
if (dashboardUser?.activeSessionStart) {
  const extraSeconds = Math.floor(
    (Date.now() -
      new Date(
        dashboardUser.activeSessionStart
      ).getTime()) /
      1000
  );

  liveTime =totalTimeSpent + extraSeconds;
}

const formatTime = (seconds) => {
  const hrs = Math.floor(
    seconds / 3600
  );

  const mins = Math.floor(
    (seconds % 3600) / 60
  );

  const secs = seconds % 60;

  return `${hrs}h ${mins}m ${secs}s`;
};


  if (loading) {
  return (
    <div className="min-h-screen flex justify-center items-center">
      Loading Dashboard...
    </div>
  );
}

  return (
    <PasswordGate>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">

  <div className="max-w-6xl mx-auto">

    {/* HEADER */}
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-8 shadow-xl mb-6">

      <div className="flex flex-col md:flex-row items-center gap-5">

        <img
          src={
            user?.photoURL ||
            "https://i.ibb.co/4pDNDk1/avatar.png"
          }
          alt=""
          className="w-28 h-28 rounded-full border-4 border-white"
        />

        <div>
          <h1 className="text-4xl font-bold">
            Welcome Back 👋
          </h1>

          <h2 className="text-xl mt-2">
            {user?.displayName}
          </h2>

          <p className="opacity-80">
            {user?.email}
          </p>
        </div>
      </div>
    </div>

    {/* STATS */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

  <div className="bg-white p-5 rounded-2xl shadow">
    <p className="text-gray-500">
      Messages
    </p>

    <h2 className="text-3xl font-bold text-blue-600">
      {stats.totalMessages}
    </h2>
  </div>

  <div className="bg-white p-5 rounded-2xl shadow">
    <p className="text-gray-500">
      Photos
    </p>

    <h2 className="text-3xl font-bold text-green-600">
      {stats.totalPhotos}
    </h2>
  </div>
  
  <div className="bg-white p-5 rounded-2xl shadow">
    <p className="text-gray-500">
      Replies
    </p>

    <h2 className="text-3xl font-bold text-purple-600">
      {stats.totalReplies}
    </h2>
  </div>

  <div className="bg-white p-5 rounded-2xl shadow">
    <p className="text-gray-500">
      Reactions
    </p>

    <h2 className="text-3xl font-bold text-pink-600">
      {stats.totalReactions}
    </h2>
  </div>

  <div className="bg-white p-5 rounded-2xl shadow">
  <p className="text-gray-500">
    ⏱️ Session Time
  </p>

  <h2 className="text-2xl font-bold text-orange-600">
    {formatTime(liveTime)}
  </h2>
</div>

<div className="bg-white p-5 rounded-2xl shadow">
  <p className="text-gray-500">
    🌐 Total Time Spent
  </p>

  <h2 className="text-2xl font-bold text-green-600">
    {formatTime(
      totalTimeSpent
    )}
  </h2>
</div>

</div>

{/* Recent Photos */}
<div className="bg-white rounded-2xl shadow p-6 mt-6">
  <h2 className="text-xl font-bold mb-4">
    📸 Recent Photos
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {stats.recentPhotos?.map(
      (photo) => (
        <img
          key={photo._id}
          src={photo.image}
          alt=""
          className="h-32 w-full rounded-xl object-cover hover:scale-105 transition"
        />
      )
    )}
  </div>
</div>

{/* Recent Messages */}
<div className="bg-white rounded-2xl shadow p-6 mt-6">
  <h2 className="text-xl font-bold mb-4">
    💬 Recent Messages
  </h2>

  {stats.recentMessages?.map((msg) => (
    <div
      key={msg._id}
      className="flex gap-3 mb-4"
    >
      <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
        {msg.senderName?.charAt(0)}
      </div>

      <div className="flex-1">
        <div className="flex justify-between">
          <h4 className="font-semibold">
            {msg.senderName}
          </h4>

          <span className="text-xs text-gray-400">
            {new Date(
              msg.createdAt
            ).toLocaleDateString()}
          </span>
        </div>

        <p className="text-gray-600">
          {msg.text}
        </p>
      </div>
    </div>
  ))}
</div>

{/* Favourite Messages */}
<div className="bg-white rounded-2xl shadow p-6 mt-6">
  <h2 className="text-xl font-bold mb-4">
    ❤️ Favorite Messages
  </h2>

  {favoriteMessages.map((msg) => (
    <div
      key={msg._id}
      className="border rounded-xl p-4 mb-3"
    >
      <p>{msg.text}</p>

      <div className="text-sm text-gray-500 mt-2">
        {msg.senderName}
      </div>
    </div>
  ))}
</div>

{/* Pagination button */}
<div className="flex justify-center gap-2 mt-4">
  <button
    disabled={page === 1}
    onClick={() =>
      setPage(page - 1)
    }
    className="btn"
  >
    Previous
  </button>

  <span className="px-4 py-2">
    {page} / {totalPages}
  </span>

  <button
    disabled={
      page === totalPages
    }
    onClick={() =>
      setPage(page + 1)
    }
    className="btn"
  >
    Next
  </button>
</div>

    {/* QUICK ACTIONS */}
    <div className="bg-white rounded-2xl p-6 shadow mb-6">

      <h2 className="text-xl font-bold mb-4">
        Quick Actions
      </h2>

      <div className="flex flex-wrap gap-3">

        <button className="bg-blue-500 text-white px-5 py-3 rounded-xl">
          Send Message
        </button>

        <button className="bg-green-500 text-white px-5 py-3 rounded-xl">
          Upload Photo
        </button>

        <button className="bg-purple-500 text-white px-5 py-3 rounded-xl">
          Edit Profile
        </button>

      </div>
    </div>

    {/* Activity Chart */}
    <div className="bg-white rounded-2xl shadow p-6 mt-6">
  <h2 className="text-xl font-bold mb-4">
    📊 Activity Chart
  </h2>

  <ResponsiveContainer
    width="100%"
    height={300}
  >
    <BarChart data={chartData}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" />
    </BarChart>
  </ResponsiveContainer>
</div>

    {/* PROFILE DETAILS */}
    <div className="bg-white rounded-2xl p-6 shadow">

      <h2 className="text-xl font-bold mb-4">
        Account Details
      </h2>

      <div className="space-y-3">

        <p>
          <strong>Email:</strong>{" "}
          {user?.email}
        </p>

        <p>
          <strong>UID:</strong>{" "}
          {user?.uid}
        </p>

        <p className="text-gray-500">
  Joined:
  {" "}
  {dashboardUser?.createdAt
    ? new Date(
        dashboardUser?.createdAt
      ).toLocaleDateString()
    : "N/A"}
</p>

        <p>
          <strong>Status:</strong>
          <span className="ml-2 text-green-600">
            Active
          </span>
        </p>
        <p className="text-gray-500">
  Last Seen:
  {" "}
  {dashboardUser?.lastSeen
    ? new Date(
        dashboardUser?.lastSeen
      ).toLocaleString()
    : "Offline"}
</p>

      </div>
      <div className="bg-white rounded-2xl shadow p-5">
  <h3 className="font-bold text-lg mb-2">
    📅 Member Since
  </h3>

  <p className="text-3xl font-bold text-indigo-600">
    {dashboardUser?.createdAt
      ? new Date(
          dashboardUser.createdAt
        ).toLocaleDateString()
      : "N/A"}
  </p>
</div>
    </div>

  </div>
</div>
</PasswordGate>
  );
}

export default Dashboard;