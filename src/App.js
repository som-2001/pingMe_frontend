import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import RegistrationForm from "./pages/Registration";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { Chat } from "./pages/Chat";
import Login from "./pages/Login";
import toast, { Toaster } from "react-hot-toast";
import { requestNotificationPermission } from "./firebase";
import { useEffect} from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { axiosReq } from "./axios/Axios";
import { Profile } from "./pages/Profile";
import { ProtectedRoute } from "./pages/ProtectedRoute";
import { io } from "socket.io-client";

const socket = io(`${process.env.REACT_APP_BASEURL}/chat`, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 5000,
});

function App() {
  const refreshToken = Cookies?.get("refreshToken");
  const sender_id = refreshToken ? jwtDecode(refreshToken)?.userId : null;
  const username = refreshToken ? jwtDecode(refreshToken)?.username : null;
  
  useEffect(() => {
    if (!sender_id) return;
    requestNotificationPermission().then((token) => { 
      if (token) {
        axiosReq.post("/users/update-fcm-token", { sender_id, token });
      }
    });
  }, [sender_id]); // Depend on sender_id

  useEffect(() => {
    const room = `room_${sender_id}`;

    socket.emit("room_join", {
      room: room,
      sender_id: sender_id,
      username: username,
    });
  }, [sender_id, username]);

  useEffect(() => {
    const DashboardMessage = (data) => {
      console.log(data,window.location.href.split("/chat/")[1],"segsegseg");
      if ((data.receiver_id !== window.location.href.split("/chat/")[1] && data.sender_id!==window.location.href.split("/chat/")[1])) {
        toast.success(`${data?.username}:${data?.message?.slice(0, 20)}`);
      }
    };

    socket.on("dashboard_message", DashboardMessage);

    return () => {
      socket.off("dashboard_message", DashboardMessage);
    };
  }, []);

  return (
    <>
  
      <Toaster />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<RegistrationForm />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/" element={<ProtectedRoute />}>
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
