import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";

function StudentRoute({ children }) {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useRole(user?.email);

  if (loading || roleLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user || role !== "student") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default StudentRoute;