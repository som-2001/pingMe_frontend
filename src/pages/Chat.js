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
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { axiosReq } from "../axios/Axios";
import toast from "react-hot-toast";
import ScrollToBottom from "react-scroll-to-bottom";
import dayjs from "dayjs";
import { UserAboutGrid } from "../components/UserAboutGrid";

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
  const sender_id = jwtDecode(Cookies?.get("refreshToken"))?.userId;
  const username = jwtDecode(Cookies?.get("refreshToken"))?.username;
  const { id } = useParams();
  const [load, setLoad] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [username1, setUsername1] = useState("");
  const [about, setAbout] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [email, setEmail] = useState("");
  const [progress,setProgress]=useState(0);

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

    axiosReq
      .get(`/user/profile/${id}`)
      .then((res) => {
        console.log(res.data);
        setUsername1(res?.data?.username);
        setAbout(
          res?.data?.about ||
            "Hi! I'm a passionate developer who loves coding and designing."
        );
        setDescription(
          res?.data?.description ||
            " Experienced in full-stack development and always eager to learn new technologies."
        );
        setPhone(res?.data?.contact?.[0]?.phone_number || "1234567890");
        setEmail(res?.data?.email || "john@mail.com");
        setAddress(
          res?.data?.contact?.[0]?.address || "123 Developer St, Code City"
        );
        setProfileImg(
          res?.data?.profileImage || "https://via.placeholder.com/150"
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  // Opens the attachment popover
  const handleAttachClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Closes the attachment popover
  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleImage = async (e) => {
    const createdAt = new Date().toISOString();
    handleClosePopover();
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("images", file);

    try {
      const response = await axiosReq.post("/chat/upload-images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(response.data);
      if (response.status === 200) {
        socket.emit("message", {
          sender_id: sender_id,
          receiver_id: id,
          message: response.data,
          username: username,
          createdAt: createdAt,
          profileImg: profileImg,
        });
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  useEffect(() => {
    const handleMessage = (data) => {
      console.log(data);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: data.message,
          sender_id: data.sender_id,
          receiver_id: data.receiver_id,
          username: data.username,
          createdAt: data.createdAt,
          profileImg: data.profileImg,
        },
      ]);
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, []);

  // Sends a message if not empty
  const handleSendMessage = async () => {
    if (message.trim() !== "") {
      const createdAt = new Date().toISOString();
      const room = `room_${id}`;
      socket.emit("message", {
        sender_id: sender_id,
        receiver_id: id,
        message: message,
        room: room,
        username: username,
        createdAt: createdAt,
        profileImg: profileImg,
      });

      await axiosReq.post("/chat/send-message", {
        senderId: sender_id,
        receiverId: id,
        message: message,
        username: username,
        profileImg: profileImg,
      });
      setMessage("");
    }
  };

  // Handle click for image attachment option

  // Handle click for video attachment option
  const handleVideoClick = () => {
    alert("Video attachment clicked!");
    handleClosePopover();
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? "attachment-popover" : undefined;

  return (
    <Grid container spacing={1}>
      <UserAboutGrid
        profileImg={profileImg}
        username1={username1}
        about={about}
        description={description}
        address={address}
        phone={phone}
        email={email}
      />

      <Grid item xs={12} sm={6} md={8} lg={8}>
        <Box className={styles.chatContainer}>
          <Box className={styles.header}>
            <Avatar
              src={profileImg}
              className={styles.headerAvatar}
              onClick={() => setHeaderModalOpen(true)}
            />
            <Typography
              variant="h6"
              className={styles.headerName}
              onClick={() => setHeaderModalOpen(true)}
            >
              {username1}
            </Typography>
          </Box>
          <ScrollToBottom className={styles.messagesContainer} behavior="auto">
            <center>
              <Box sx={{ backgroundColor: "transparent" }}>
                <Box>{load && <CircularProgress />}</Box>
                {page !== total && !load && messages.length > 29 && (
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

            {messages.length === 0 ? (
              <Typography variant="body2" className={styles.noMessages}>
                No messages yet. Start the conversation!
              </Typography>
            ) : (
              messages.map((msg, index) =>
                msg.sender_id === sender_id ? (
                  <Box key={index} className={styles.RightmessageBubble}>
                    <Typography variant="body2">
                      {msg.message.startsWith("https://res.cloudinary.com") ? (
                        <img
                          src={msg.message}
                          alt=""
                          style={{
                            width: "240px",
                            height: "240px",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        msg.message
                      )}
                    </Typography>
                    <Typography variant="caption" className={styles.timestamp}>
                      {dayjs(msg.createdAt).format("h:mm A")}
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <Box key={index} className={styles.LeftmessageBubble}>
                      <Typography variant="body2">
                        {msg.message.startsWith(
                          "https://res.cloudinary.com"
                        ) ? (
                          <img
                            src={msg.message}
                            alt=""
                            style={{
                              width: "240px",
                              height: "240px",
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          msg.message
                        )}
                      </Typography>
                      <Typography
                        variant="caption"
                        className={styles.timestamp}
                      >
                        {dayjs(msg.createdAt).format("h:mm A")}
                      </Typography>
                    </Box>
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
              InputProps={{
                style: {
                  borderRadius: "50px",
                },
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
            <IconButton
              onClick={handleSendMessage}
              className={styles.sendMessageIcon}
            >
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
          <Button component="label">
            <input
              type="file"
              hidden
              // multiple
              onChange={handleImage}
              onClick={(e) => e.stopPropagation()}
            />
            <IconButton title="Attach Image">
              <ImageIcon />
            </IconButton>
          </Button>
          <IconButton onClick={handleVideoClick} title="Attach Video">
            <VideocamIcon />
          </IconButton>
        </Box>
      </Popover>

      {headerModalOpen && (
        <UserDetailsModal
          headerModalOpen={headerModalOpen}
          setHeaderModalOpen={setHeaderModalOpen}
          username={username1}
          profileImage={profileImg}
          description={description}
          about={about}
          email={email}
          address={address}
          phone={phone}
        />
      )}
    </Grid>
  );
};
