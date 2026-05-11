import { Route, Routes } from "react-router";
import MainLayout from "./layouts/MainLayout/MainLayout";
import Home from "./pages/Home/Home";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Message from "./pages/Message/Message";
import ChatPage from "./pages/ChatPage";
import Users from "./pages/Users/Users";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout></MainLayout>}>
          <Route index element={<Home></Home>}></Route>
          <Route path="/message" element={<Message></Message>}></Route>
          <Route path="/register" element={<Register></Register>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/chatpage" element={<ChatPage></ChatPage>}></Route>
          <Route path="/users" element={<Users></Users>}></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
