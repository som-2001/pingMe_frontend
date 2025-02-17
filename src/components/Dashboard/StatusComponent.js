import React, { useEffect, useState } from "react";
import {
  Grid,
  Modal,
  TextField,
  Button,
  Typography,
  IconButton,
  Skeleton,
  Box,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import styles from "../../styles/StatusComponent.module.css";
import AnimationIcon from "@mui/icons-material/Animation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import RoomIcon from "@mui/icons-material/Room";
import "emoji-picker-element";
import { useRef } from "react";
import { axiosReq } from "../../axios/Axios";
import { io } from "socket.io-client";
import styles1 from "../../styles/Dashboard.module.css";
import dayjs from "dayjs";
import toast from "react-hot-toast";
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const socket = io(`${process.env.REACT_APP_BASEURL}/chat`, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 5000,
});

export const StatusComponent = () => {
  const [open, setOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [statusImage, setStatusImage] = useState(null);
  const refreshToken = Cookies?.get("refreshToken");
  const username = refreshToken ? jwtDecode(refreshToken)?.username : null;
  const sender_id = refreshToken ? jwtDecode(refreshToken)?.userId : null;
  const profileImage = localStorage?.getItem("profileImage");
  const email = sessionStorage?.getItem("email");
  const [userStatuses, setUserStatuses] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    axiosReq
      .post(`${process.env.REACT_APP_BASEURL}/status/getStatus`, { page: page })
      .then((res) => {
        setUserStatuses((prevStatus) => [...prevStatus, ...res.data.statuses]);
        setTotal(res.data.total);
        setLoad(false);
      })
      .catch((err) => {
        setLoad(false);
        console.log(err);
      });
  }, [page]);

  useEffect(() => {
    const room = "pingME";

    socket.emit("pingME_room", {
      room: room,
      sender_id: sender_id,
      username: username,
    });
  }, [sender_id, username]);

  const emojiPickerRef = useRef(null);

  useEffect(() => {
    if (emojiPickerRef.current) {
      emojiPickerRef.current.addEventListener("emoji-click", handleEmojiSelect);
    }
    return () => {
      if (emojiPickerRef.current) {
        emojiPickerRef.current.removeEventListener(
          "emoji-click",
          handleEmojiSelect
        );
      }
    };
  }, [emojiPickerRef]);

  useEffect(() => {
    const status_upload = (data) => {
      console.log(data);
      setUserStatuses((prevUserStatuses) => [
        {
          userId: { username: data.username, _id: data._id },
          status: { message: data.message, image: data.image },
        },
        ...prevUserStatuses,
      ]);
    };

    socket.on("status-upload", status_upload);
    return () => {
      socket.off("status-upload", status_upload);
    };
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEmojiSelect = (event) => {
    setStatusText(statusText + event.detail.unicode);
  };

  const handleImageChange = (e) =>
    setStatusImage(URL.createObjectURL(e.target.files[0]));

  const handleAddStatus = () => {
    axiosReq
      .post("/status/upload", {
        id: sender_id,
        message: statusText,
        image: statusImage,
      })
      .then((res) => {
        socket.emit("status-upload", {
          room: "pingMe",
          id: sender_id,
          message: statusText,
          image: statusImage,
          username: username,
        });
        setStatusText("");
        setStatusImage(null);
        handleClose();
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message)
      });
  };

  return (
    <div className={styles.statusContainer}>
      {/* My Status Section */}
      <Grid container alignItems="center" className={styles.myStatus}>
        <Grid item xs={4} md={2} lg={1}>
          <IconButton onClick={handleOpen}>
            <AddCircleOutlineIcon sx={{ fontSize: "2.5rem" }} />
          </IconButton>
        </Grid>
        <Grid item xs={8} md={10} lg={11}>
          <Typography variant="h6">My Status</Typography>
        </Grid>
      </Grid>

      {/* Other User Status Section */}
      <div className={styles.otherStatusContainer}>
        <Typography variant="h6" className={styles.sectionHeader}>
          Recent Updates
        </Typography>
        {load
          ? Array.from({ length: 5 }).map((data, index) => (
              <Box
                className={styles1.Skeleton}
                sx={{
                  width: { xs: "270px", sm: "auto" },
                }}
              >
                <Box className={styles1.flexSkeleton}>
                  <Skeleton
                    variant="circular"
                    width={48}
                    height={48}
                    sx={{ marginRight: "16px" }}
                  />
                  <Box>
                    <Skeleton variant="text" width="120px" height={20} />
                    <Skeleton
                      variant="text"
                      width="200px"
                      height={20}
                      sx={{ marginTop: "8px" }}
                    />
                  </Box>
                </Box>
                <Skeleton
                  variant="text"
                  width={40}
                  height={20}
                  sx={{ marginTop: "-20px" }}
                />
              </Box>
            ))
          : userStatuses.map((status, index) => (
              <Grid
                container
                alignItems="center"
                key={index}
                className={styles.statusItem}
              >
                <Grid item xs={4} md={2} lg={1.2}>
                  <div className={styles.statusCircle}>
                    <img
                      src={status?.userId?.profileImage}
                      alt="status"
                      className={styles.statusImage}
                    />
                  </div>
                </Grid>
                <Grid item xs={8} md={10} lg={10.8}>
                  <Typography variant="body1">
                    {status?.status?.message}
                  </Typography>
                  <Typography variant="caption" className={styles.statusTime}>
                    {dayjs(status?.createdAt).format("YYYY/MM/DD HH:mm:ss")}
                  </Typography>
                </Grid>
              </Grid>
            ))}
      </div>

      {/* Modal to Add Status */}
      <Modal open={open} onClose={handleClose}>
        <div className={styles.modalContent}>
          <div className={styles.profile}>
            <img
              src={profileImage ?? "https://via.placeholder.com/50"}
              alt="Profile"
              className={styles.profilePic}
            />
            <div>
              <Typography variant="h6" className={styles.username}>
                {username}
              </Typography>
              <Typography variant="body2" className={styles.handle}>
                {email}
              </Typography>
            </div>
          </div>
          {statusImage && (
            <img
              src={statusImage}
              alt="Preview"
              className={styles.imagePreview}
            />
          )}

          <TextField
            placeholder="What's on your mind?"
            variant="standard"
            multiline
            rows={5}
            fullWidth
            value={statusText}
            onChange={(e) => setStatusText(e.target.value)}
            className={styles.textField}
            inputProps={{
              style: {
                padding: "10px",
              },
            }}
          />

          <div className={styles.actions}>
            <label htmlFor="fileInput">
              <AnimationIcon className={styles.uploadIcon} />
            </label>
            <input
              type="file"
              id="fileInput"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
            <span className={styles.uploadIcon}>
              <RoomIcon />
            </span>
            <span
              className={styles.uploadIcon}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <SentimentSatisfiedAltIcon />
            </span>
          </div>

          {showEmojiPicker && (
            <emoji-picker
              ref={emojiPickerRef}
              className={styles.emoji}
            ></emoji-picker>
          )}

          <Button
            variant="contained"
            className={styles.postButton}
            onClick={handleAddStatus}
          >
            Post
          </Button>
        </div>
      </Modal>
    </div>
  );
};
