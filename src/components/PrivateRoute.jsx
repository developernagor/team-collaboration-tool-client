import {
  Navigate,
  useLocation,
} from "react-router";

import {
  onAuthStateChanged,
} from "firebase/auth";

import {
  useEffect,
  useState,
} from "react";

import { auth } from "../firebase/firebase.config";

function PrivateRoute({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const location = useLocation();

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {
          setUser(currentUser);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, []);

  // Loading Spinner
  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Show protected page
  return children;
}

export default PrivateRoute;