import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import styles from "../styles/Dashboard.module.css";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useEffect, useRef, useState } from "react";
import { axiosReq } from "../axios/Axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { StyledBadge } from "./StyleBadge";
import SearchIcon from '@mui/icons-material/Search';

export const ExploreUsersModal = ({ open, setOpen, socket, username }) => {
  const [load, setLoad] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [users, setUsers] = useState([]);
  const [copyUsers,setCopyUsers]=useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const loadRef = useRef(null);
  const navigate = useNavigate();
  const refreshToken = Cookies?.get("refreshToken");
  const sender_id = refreshToken ? jwtDecode(refreshToken)?.userId : null;

  // Helper functions for localStorage
  const saveOnlineUsers = (users) => {
    localStorage.setItem("onlineUsers", JSON.stringify(users));
  };

  const getOnlineUsers = () => {
    return JSON.parse(localStorage.getItem("onlineUsers")) || [];
  };

  useEffect(() => {
    const room = `pingMe_room`;

    socket.emit("room_join", {
      room: room,
      sender_id: sender_id,
      username: username,
    });
  }, [sender_id, username]);

  useEffect(() => {
    // Handle user connect
    socket.on("connectUserBroadcastToAll", (data) => {
      const currentOnlineUsers = getOnlineUsers();
      if (!currentOnlineUsers.includes(data.sender_id)) {
        const updatedUsers = [...currentOnlineUsers, data.sender_id];
        saveOnlineUsers(updatedUsers);
        setOnlineUsers(updatedUsers);
      }
    });

    // Handle user disconnect
    socket.on("disconnectUserBroadcastToAll", (data) => {
      const currentOnlineUsers = getOnlineUsers().filter((id) => id !== data.id);
      saveOnlineUsers(currentOnlineUsers);
      setOnlineUsers(currentOnlineUsers);
    });

    // Load initial online users
    setOnlineUsers(getOnlineUsers());

    return () => {
      socket.off("connectUserBroadcastToAll");
      socket.off("disconnectUserBroadcastToAll");
    };
  }, [sender_id]);

  useEffect(() => {
    setLoad(true);
    axiosReq
      .post("/user/userList", { page: page })
      .then((res) => {
        setUsers((prevUsers) => [...prevUsers, ...res.data.users]);
        setCopyUsers((prevUsers) => [...prevUsers, ...res.data.users])
        setTotal(res.data.total);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
      })
      .finally(() => {
        setLoad(false);
      });
  }, [page]);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
  
    if (searchTerm.length === 0) {
      setUsers(copyUsers);
      return;
    }
  
    const filteredUsers = copyUsers.filter((user) =>
      user?.username.toLowerCase().includes(searchTerm)
    );
  
    setUsers(filteredUsers);
  };
  
  return (
    <Modal open={open} onClose={() => setOpen(false)} className={styles.modal}>
      <Box className={styles.modalContent}>
        <Box className={styles.flex}>
          <Typography variant="h6" className={styles.modalHeader}>
            Explore People
          </Typography>
         
          <CloseIcon sx={{ cursor: "pointer" }} onClick={() => setOpen(false)} />
        </Box>
        <TextField type="text" placeholder="Search Users..." onChange={handleSearch} fullWidth slotProps={{
            input: {
              startAdornment: <InputAdornment position="start"><SearchIcon/></InputAdornment>,
            },
          }}/>
        <List className={styles.list}>
          {users.map((user) => (
            <ListItem
              key={user.id}
              className={styles.listItem}
              onClick={() =>
                navigate(`/chat/${user._id}`, { state: { userDetails: user } })
              }
            >
              <ListItemAvatar>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant={onlineUsers.includes(user._id) ? "dot" : ""}
                >
                  <Avatar src={user?.profileImage} className={styles.avatar} />
                </StyledBadge>
              </ListItemAvatar>
              <ListItemText
                primary={sender_id === user?._id ? "You" : user?.username}
                secondary={user?.description || "Hey there!! I am using ChatterBox."}
              />
              <ChevronRightIcon className={styles.chevronIcon} />
            </ListItem>
          ))}
        </List>

        {/* Loading Indicator */}
        <Box>{load && <CircularProgress />}</Box>
        {page !== total && !load && (
          <Button
            variant="contained"
            color="error"
            ref={loadRef}
            onClick={() => {
              setLoad(true);
              setPage((prev) => prev + 1);
            }}
            className={styles.closeButton}
          >
            Load More
          </Button>
        )}
      </Box>
    </Modal>
  );
};
