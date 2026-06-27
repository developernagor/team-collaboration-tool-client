import useStudent from "../../hooks/useStudent";

function StudentDashboard() {
  const { student, loading } = useStudent();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">

      {/* Welcome */}
      <div className="hero bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white shadow-xl mb-8">
        <div className="hero-content flex-col lg:flex-row justify-between w-full">

          <div>
            <h1 className="text-4xl font-bold">
              Welcome, {student?.name}
            </h1>

            <p className="mt-2 opacity-90">
              Welcome to Mehedi Educare Student Dashboard
            </p>
          </div>

          <img
            src={student?.photo}
            alt="Student"
            className="w-28 h-28 rounded-full border-4 border-white object-cover"
          />
        </div>
      </div>

      {/* Student Information */}

      <div className="card bg-base-100 shadow-xl">

        <div className="card-body">

          <h2 className="card-title text-2xl mb-4">
            Student Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <p>
                <strong>Name:</strong> {student?.name}
              </p>

              <p>
                <strong>Student ID:</strong>{" "}
                {student?.studentId}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {student?.email}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {student?.phone}
              </p>
            </div>

            <div>
              <p>
                <strong>Class:</strong>{" "}
                {student?.class}
              </p>

              <p>
                <strong>Guardian:</strong>{" "}
                {student?.guardian}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span className="badge badge-success">
                  {student?.status}
                </span>
              </p>

              <p>
                <strong>Admission Date:</strong>{" "}
                {student?.admissionDate}
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default StudentDashboard;