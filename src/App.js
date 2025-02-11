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

  useEffect(() => {
    if (!sender_id) return;

    let timer;
    let wasOffline = false; // Track if the user actually went offline

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Start a timeout when the user leaves
        timer = setTimeout(() => {
          console.log("User has been inactive for 1 minute, setting offline");
          axiosReq.put("/user/status", {
            sender_id: sender_id,
            status: "offline",
          });
          wasOffline = true; // Mark user as offline
        }, 60000); // 1-minute delay
      } else {
        // User returned before 1 minute, clear the timeout
        if (timer) {
          clearTimeout(timer);
          console.log("User returned within 1 min, not setting offline");
        }

        // Only send "online" request if the user was marked offline
        if (wasOffline) {
          axiosReq.put("/user/status", {
            sender_id: sender_id,
            status: "online",
          });
          wasOffline = false; // Reset flag
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(timer); // Cleanup on unmount
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [sender_id]);

  return (
    <>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<RegistrationForm />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat/:id" element={<Chat />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
