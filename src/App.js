import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistrationForm from "./pages/Registration";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { Chat } from "./pages/Chat";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import { requestNotificationPermission } from "./firebase";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { axiosReq } from "./axios/Axios";
import { Profile } from "./pages/Profile";
import { ProtectedRoute } from "./pages/ProtectedRoute";

function App() {
  const refreshToken = Cookies?.get("refreshToken");
  const sender_id = refreshToken ? jwtDecode(refreshToken)?.userId : null;

  useEffect(() => {
    if (!sender_id) return;
    requestNotificationPermission().then((token) => {
      if (token) {
        axiosReq.post("/users/update-fcm-token", { sender_id, token });
      }
    });
  }, [sender_id]); // Depend on sender_id

  return (
    <>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<RegistrationForm />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/" element={<ProtectedRoute/>}>
            <Route path="profile" element={<Profile />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="chat/:id" element={<Chat />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
