import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase.config";


function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md text-center">

        {/* PROFILE PHOTO */}
        <div className="flex justify-center mb-4">
          <img
            src={
              user?.photoURL ||
              "https://i.ibb.co/4pDNDk1/avatar.png"
            }
            alt="profile"
            className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover"
          />
        </div>

        {/* NAME */}
        <h2 className="text-2xl font-bold text-gray-800">
          {user?.displayName || "No Name"}
        </h2>

        {/* EMAIL */}
        <p className="text-gray-500 mt-1">
          {user?.email}
        </p>

        {/* USER ID */}
        <p className="text-xs text-gray-400 mt-2">
          UID: {user?.uid}
        </p>

        {/* STATUS */}
        <div className="mt-5">
          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
            Active User
          </span>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;