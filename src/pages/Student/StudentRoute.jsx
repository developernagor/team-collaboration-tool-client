import { Navigate } from "react-router";
import { useEffect, useState } from "react";

import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { auth } from "../../firebase/firebase.config";

function StudentRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `https://team-collaboration-tool-server.vercel.app/users/${currentUser.email}`
        );

        setAllowed(res.data.role === "student");
      } catch {
        setAllowed(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return allowed ? children : <Navigate to="/" replace />;
}

export default StudentRoute;