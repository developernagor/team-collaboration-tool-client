import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { auth } from "../../firebase/firebase.config";

function Navbar() {
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

const fetchUnreadCount = async () => {
  if (!user?.email) return;

  try {
    const res = await fetch(
      "https://team-collaboration-tool-server.vercel.app/messages"
    );

    const data = await res.json();

    const unread = data.filter(
      (msg) =>
        msg.senderEmail !== user.email &&
        !msg.seenBy?.some(
          (seenUser) => seenUser.email === user.email
        )
    );

    setUnreadCount(unread.length);
  } catch (err) {
    console.log(err);
  }
};



useEffect(() => {
  if (!user) return;

  fetchUnreadCount();

  const interval = setInterval(fetchUnreadCount, 5000);

  return () => clearInterval(interval);
}, [user]);


  // ✅ database user
  const [dbUser, setDbUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        setUser(currentUser);

        // ✅ Fetch role from database
        if (currentUser?.email) {
          try {
            const res = await fetch(
              `https://team-collaboration-tool-server.vercel.app/users/${currentUser.email}`
            );

            const data = await res.json();

            setDbUser(data);

          } catch (error) {
            console.log(error);
          }
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(
    "https://team-collaboration-tool-server.vercel.app/users/session/end",
    {
      method: "PATCH",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        email: user.email,
      }),
    }
  );
      await signOut(auth);
    } catch (error) {
      console.log(error.message);
    }
  };

  let roleMenu;

if (dbUser?.role === "bondhu") {
  roleMenu = (
    <>
      <Link
  to="/message"
  className="relative"
>
  Message

  {unreadCount > 0 && (
    <span className="absolute -top-2 -right-4 bg-red-600 text-white text-[10px] min-w-5 h-5 rounded-full flex items-center justify-center">
      {unreadCount}
    </span>
  )}
</Link>
      <Link to="/photosend">📷 PhotoSend</Link>
      <Link to="/users">Active Status</Link>
      <Link to="/dashboard">Dashboard</Link>
    </>
  );
} else if (dbUser?.role === "admin") {
  roleMenu = (
    <>
      <Link to="/add-student">Add Student</Link>
      <Link to="/all-students">All Students</Link>
      <Link to="/student-attendance">Student Attendance</Link>
      <Link to="/admin-dashboard">Admin Dashboard</Link>
    </>
  );
}
else if (dbUser?.role === "student") {
  roleMenu = (
    <>
      <Link to="/student-dashboard">Dashboard</Link>
      <Link to="/student-messages">Message</Link>
      
    </>
  );
} else {
  roleMenu = (
    <p className="text-pink-500 font-bold">
      🕵️ Spy:{" "}
      {dbUser?.name || user?.displayName || user?.email?.split("@")[0]}
    </p>
  );
}

const navMenu = (
  <>
    <Link to="/">Home</Link>
    {roleMenu}
  </>
);

  return (
    <div className="navbar bg-base-100 shadow-sm fixed top-0 left-0 w-full z-50">

      {/* LEFT */}
      <div className="navbar-start">

        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost lg:hidden"
          >
            ☰
          </div>

          <ul className="menu menu-sm dropdown-content bg-base-100 p-2 shadow z-[1] rounded-box mt-3 w-52">
            {navMenu}
          </ul>
        </div>

        {/* LOGO */}
        <Link
          to="/"
          className="btn btn-ghost text-2xl font-bold"
        >
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text tracking-widest">
            Mehedi Educare
          </span>
        </Link>
      </div>

      {/* CENTER */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-6 font-bold">
          {navMenu}
        </ul>
      </div>

      {/* RIGHT */}
      <div className="navbar-end">
        {user?.email ? (
          <button
            onClick={handleLogout}
            className="btn btn-error"
          >
            Logout
          </button>
        ) : (
          <Link to="/login" className="btn">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;