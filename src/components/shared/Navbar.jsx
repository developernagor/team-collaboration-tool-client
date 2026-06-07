import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { auth } from "../../firebase/firebase.config";

function Navbar() {
  const [user, setUser] = useState(null);

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
      await signOut(auth);
    } catch (error) {
      console.log(error.message);
    }
  };

const navMenu = (
  <>
    <Link to="/">Home</Link>

    {dbUser?.role === "bondhu" ? (
      <>
        <Link to="/message">
          Message
        </Link>

        <Link
          to="/photosend"
          className="px-4 py-2 rounded-lg hover:bg-blue-100"
        >
          📷 PhotoSend
        </Link>
      </>
    ) : (
      <p className="text-pink-500 font-bold">
        🕵️ Spy:{" "}
        {dbUser?.name ||
          user?.displayName ||
          user?.email?.split("@")[0]}
      </p>
    )}
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