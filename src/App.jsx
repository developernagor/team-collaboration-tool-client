import { Route, Routes } from "react-router";
import MainLayout from "./layouts/MainLayout/MainLayout";
import Home from "./pages/Home/Home";
import Message from "./pages/Message/Message";
import ChatPage from "./pages/ChatPage";
import Users from "./pages/Users/Users";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import PrivateRoute from "./components/PrivateRoute";


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