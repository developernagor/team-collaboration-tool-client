import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase.config";


function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

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
      
      <Link to="/message">Message</Link>
      
      
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            ☰
          </div>
          <ul className="menu menu-sm dropdown-content bg-base-100 p-2 shadow">
            {navMenu}
          </ul>
        </div>

       <Link to="/" className="btn btn-ghost text-2xl font-bold">
  <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text tracking-widest">
    ARU
  </span>
</Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-6 font-bold">
          {navMenu}
        </ul>
      </div>

      <div className="navbar-end">
        {user?.email ? (
          <button onClick={handleLogout} className="btn btn-error">
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