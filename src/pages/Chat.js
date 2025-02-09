import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Popover,
  Typography,
  Avatar,
  CircularProgress,
  Button,
  Grid,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import ImageIcon from "@mui/icons-material/Image";
import VideocamIcon from "@mui/icons-material/Videocam";
import styles from "../styles/Chat.module.css";
import { UserDetailsModal } from "./UserDetailsModel";
import { useLocation, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { axiosReq } from "../axios/Axios";
import toast from "react-hot-toast";
import ScrollToBottom from "react-scroll-to-bottom";

const socket = io(`${process.env.REACT_APP_BASEURL}/chat`, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 5000,
});

export const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [headerModalOpen, setHeaderModalOpen] = useState(false);
  const location = useLocation();
  const sender_id = jwtDecode(Cookies?.get("refreshToken"))?.userId;
  const username = jwtDecode(Cookies?.get("refreshToken"))?.username;
  const { id } = useParams();
  const [load, setLoad] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const messagesEndRef = useRef(null);

  //loads messages
  useEffect(() => {
    setLoad(true);
    axiosReq
      .post("/chat/get-messages", {
        page: page,
        sender_id: sender_id,
        receiver_id: id,
      })
      .then((res) => {
        setMessages((prevMessages) => [...res.data.messages, ...prevMessages]);
        setTotal(res.data.totalPages);
      })
      .catch((err) => {
        console.error(err);
        toast.error(err?.response?.data?.message);
      })
      .finally(() => {
        setLoad(false);
      });
  }, [page]);

  useEffect(() => {
    const room = `room_${id}`;
    socket.emit("room_join", {
      room: room,
      sender_id: sender_id,
      username: username,
      receiver_id: id,
    });
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Opens the attachment popover
  const handleAttachClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Closes the attachment popover
  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const handleMessage = (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: data.message,
          sender_id: data.sender_id,
          receiver_id: data.receiver_id,
        },
      ]);
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, []);

  // Sends a message if not empty
  const handleSendMessage = () => {
    if (message.trim() !== "") {
      const room = `room_${id}`;
      socket.emit("message", {
        sender_id: sender_id,
        receiver_id: id,
        message: message,
        room: room,
      });
      setMessage("");
    }
  };

  // Handle click for image attachment option
  const handleImageClick = () => {
    alert("Image attachment clicked!");
    handleClosePopover();
  };

  // Handle click for video attachment option
  const handleVideoClick = () => {
    alert("Video attachment clicked!");
    handleClosePopover();
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? "attachment-popover" : undefined;

  return (
    <Grid container spacing={1}>
      <Grid
        item
        xs={12}
        md={5}
        sx={{display:{xs:"none",md:"block"}}}
        className={styles.userDetailsContainer} // Apply CSS class
      >
        {/* User Image & Banner */}
        <Box className={styles.bannerContainer}>
          <Box className={styles.banner} />
          <Avatar
            src="https://via.placeholder.com/100"
            alt="User Name"
            className={styles.profileImage}
          />
        </Box>

        {/* User Info */}
        <Box className={styles.userInfo}>
          <Typography variant="h6" className={styles.userName}>
            John Doe
          </Typography>
          <Typography variant="body2" className={styles.userTitle}>
            Senior Software Engineer at XYZ
          </Typography>
        </Box>

        {/* About Me Section */}
        <Box className={styles.section}>
          <Typography variant="body1" className={styles.sectionTitle}>
            About Me:
          </Typography>
          <Typography variant="body2" className={styles.sectionText}>
            Passionate about technology and solving complex problems.
          </Typography>
        </Box>

        {/* Contact Section */}
        <Box className={styles.section}>
          <Typography variant="body1" className={styles.sectionTitle}>
            Contact:
          </Typography>
          <Typography variant="body2" className={styles.sectionText}>
            📧 john.doe@example.com
          </Typography>
          <Typography variant="body2" className={styles.sectionText}>
            📍 San Francisco, CA
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12} sm={12} md={8} lg={7}>
        <Box className={styles.chatContainer}>
          <Box
            className={styles.header}
            onClick={() => setHeaderModalOpen(true)}
          >
            <Avatar
              src={location?.state?.userDetails?.avatar}
              className={styles.headerAvatar}
            />
            <Typography variant="h6" className={styles.headerName}>
              {location?.state?.userDetails?.username}
            </Typography>
          </Box>
          <ScrollToBottom className={styles.messagesContainer} behavior="auto">
            <center>
              <Box sx={{ backgroundColor: "transparent" }}>
                <Box>{load && <CircularProgress />}</Box>
                {page !== total && !load && (
                  <Button
                    variant="contained"
                    onClick={() => {
                      setLoad(true);
                      setPage((prev) => prev + 1);
                    }}
                    className={styles.loadMore}
                  >
                    Load More
                  </Button>
                )}
              </Box>
            </center>

            {load ? (
              <Box>
                <CircularProgress size={30} className={styles.reload} />
              </Box>
            ) : messages.length === 0 ? (
              <Typography variant="body2" className={styles.noMessages}>
                No messages yet. Start the conversation!
              </Typography>
            ) : (
              messages.map((msg, index) =>
                msg.sender_id === sender_id ? (
                  <Box key={index} className={styles.RightmessageBubble}>
                    <Typography variant="body1">{msg.message}</Typography>
                  </Box>
                ) : (
                  <Box key={index} className={styles.LeftmessageBubble}>
                    <Typography variant="body1">{msg.message}</Typography>
                  </Box>
                )
              )
            )}
          </ScrollToBottom>

          <Box className={styles.inputContainer}>
            <IconButton onClick={handleAttachClick}>
              <AttachFileIcon />
            </IconButton>
            <TextField
              variant="outlined"
              placeholder="Type a message"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
            <IconButton onClick={handleSendMessage}>
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Grid>

      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box className={styles.popoverContent}>
          <IconButton onClick={handleImageClick} title="Attach Image">
            <ImageIcon />
          </IconButton>
          <IconButton onClick={handleVideoClick} title="Attach Video">
            <VideocamIcon />
          </IconButton>
        </Box>
      </Popover>

      {headerModalOpen && (
        <UserDetailsModal
          headerModalOpen={headerModalOpen}
          setHeaderModalOpen={setHeaderModalOpen}
          user={location?.state?.userDetails}
        />
      )}
    </Grid>
  );
};
