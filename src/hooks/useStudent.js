import { useEffect, useState } from "react";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase.config";

const useStudent = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Firebase User:", user);
      if (!user) {
        setLoading(false);
        return;
      }
       console.log(user.email);

      try {
        const res = await axios.get(
          `https://team-collaboration-tool-server.vercel.app/student-dashboard/${user.email}`
        );
         console.log("API Response:", res.data);

        setStudent(res.data.user);
      } catch (err) {
        console.log(err.response?.status);
  console.log(err.response?.data);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { student, loading };
};

export default useStudent;