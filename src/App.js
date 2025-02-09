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

function App() {
  const refreshToken = Cookies?.get("refreshToken"); // Get token from cookies
  const sender_id = refreshToken ? jwtDecode(refreshToken)?.userId : null; // Decode only if token exists

  useEffect(() => {
    if (!sender_id) return; // Exit if user is not logged in

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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat/:id" element={<Chat />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
