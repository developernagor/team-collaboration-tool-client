import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase.config";

const useStudent = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `https://your-server.vercel.app/students/email/${user.email}`
        );

        const data = await res.json();

        setStudent(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  return { student, loading };
};

export default useStudent;