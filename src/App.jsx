import { Route, Routes } from "react-router";
import MainLayout from "./layouts/MainLayout/MainLayout";
import Home from "./pages/Home/Home";
import Message from "./pages/Message/Message";
import ChatPage from "./pages/ChatPage";
import Users from "./pages/Users/Users";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import PhotoSend from "./components/shared/PhotoSend";
import AllStudents from "./pages/AllStudents";
import AddStudent from "./pages/AddStudent";
import StudentDetails from "./StudentDetails";
import AdminDashboard from "./AdminDashboard";
import StudentDashboard from "./pages/Student/StudentDashboard";
import StudentMessage from "./pages/Student/StudentMessage";
import StudentRoute from "./pages/Student/StudentRoute";
import AdminAttendance from "./Admin/AdminAttendance";


function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<MainLayout />}
        >
          <Route
            index
            element={<Home />}
          />

          {/* PRIVATE ROUTE */}
          <Route
            path="/message"
            element={
              <PrivateRoute>
                <Message />
              </PrivateRoute>
            }
          />

          <Route
            path="/student-dashboard"
            element={
              <StudentRoute>
                <StudentDashboard />
              </StudentRoute>
            }
          />

          <Route
            path="/student-messages"
            element={
              <PrivateRoute>
                <StudentMessage />
              </PrivateRoute>
            }
          />

          {/* PRIVATE ROUTE */}
          <Route
            path="/chatpage"
            element={
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            }
          />

          {/* PRIVATE ROUTE */}
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <Users />
              </PrivateRoute>
            }
          />

          {/* PRIVATE ROUTE */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

{/* PRIVATE ROUTE */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          <Route
            path="/photosend"
            element={
              <PrivateRoute>
                <PhotoSend />
              </PrivateRoute>
            }
          />

<Route
            path="/add-student"
            element={
              <AddStudent />
            }
          />
          <Route
            path="/all-students"
            element={
              <AllStudents />
            }
          />

          <Route
            path="/student-attendance"
            element={
              <AdminAttendance />
            }
          />

          <Route
            path="/admin-dashboard"
            element={
              <AdminDashboard />
            }
          />


          <Route
            path="/student/:id"
            element={
              <StudentDetails />
            }
          />

          {/* PUBLIC ROUTES */}
          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/login"
            element={<Login />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;