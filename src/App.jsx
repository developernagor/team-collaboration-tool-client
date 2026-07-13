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
import AddNotice from "./Admin/AddNotice";
import EditStudent from "./pages/Student/EditStudent";
import AddExam from "./Admin/AddExam";
import ExamRoutine from "./Exam/ExamRoutine";
import AddResult from "./Exam/AddResult";
import ResultList from "./Exam/ResultList";
import SubjectManagement from "./Exam/SubjectManagement";
import Marksheet from "./pages/Marksheet";
import StudentResult from "./Exam/StudentResult";
import SearchResult from "./Exam/SearchResult";
import UserManagement from "./Admin/UserManagement";
import AdminRoute from "./Admin/AdminRoute";


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

          {/* Student Routes */}

          <Route
            path="/student-dashboard"
            element={
              <StudentRoute>
                <StudentDashboard />
              </StudentRoute>
            }
          />

          <Route
            path="/search-result"
            element={
              <StudentRoute>
                <SearchResult />
              </StudentRoute>
            }
          />

          <Route
            path="/student-messages"
            element={
              <StudentRoute>
                <StudentMessage />
              </StudentRoute>
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
              <AdminRoute><AddStudent /></AdminRoute>
            }
          />
          <Route
            path="/all-students"
            element={
              <AdminRoute><AllStudents /></AdminRoute>
            }
          />

          <Route
            path="/student-attendance"
            element={
              <AdminRoute><AdminAttendance /></AdminRoute>
            }
          />

          <Route
  path="/add-notice"
  element={<AdminRoute><AddNotice /></AdminRoute>}
/>

 <Route path="/add-exam" element={<AdminRoute><AddExam /></AdminRoute>} />
<Route path="/subject-management" element={<AdminRoute><SubjectManagement /></AdminRoute>} />
<Route path="/exam-routine" element={<AdminRoute><ExamRoutine /></AdminRoute>} />
<Route path="/add-result" element={<AdminRoute><AddResult /></AdminRoute>} />
<Route path="/result-list" element={<AdminRoute><ResultList /></AdminRoute>} />
<Route path="/dashboard/users" element={<AdminRoute><UserManagement /></AdminRoute>} />

<Route
  path="/marksheet/:studentId/:examId"
  element={<Marksheet />}
/>
<Route
  path="/student-result"
  element={
  <AdminRoute>
  <StudentResult />
  </AdminRoute>}
/>
{/* <Route path="/student-result" element={<StudentResult />} /> */}


          <Route
            path="/admin-dashboard"
            element={
              <AdminRoute>
              <AdminDashboard />
              </AdminRoute>
            }
          />


          <Route
            path="/student/:id"
            element={
              <AdminRoute>
              <StudentDetails />
              </AdminRoute>
            }
          />

          <Route
  path="/edit-student/:id"
  element={
    <AdminRoute>
  <EditStudent />
  </AdminRoute>
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