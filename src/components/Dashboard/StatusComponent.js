import React, { useState } from "react";
import {
  Grid,
  Modal,
  TextField,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import styles from "../../styles/StatusComponent.module.css";
import AnimationIcon from '@mui/icons-material/Animation';
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import RoomIcon from "@mui/icons-material/Room";

export const StatusComponent = () => {
  const [open, setOpen] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [statusImage, setStatusImage] = useState(null);
  const refreshToken = Cookies?.get("refreshToken");
  const username = refreshToken ? jwtDecode(refreshToken)?.username : null;
  const profileImage = sessionStorage?.getItem("profileImage");
  const email = sessionStorage?.getItem("email");
  const [userStatuses, setUserStatuses] = useState([
    {
      text: "Enjoying the weekend at the beach!",
      image: "https://via.placeholder.com/150/92c952",
      time: "Today, 10:30 AM",
    },
    {
      text: "Completed my React project! 🚀",
      image: "https://via.placeholder.com/150/771796",
      time: "Yesterday, 3:45 PM",
    },
    {
      text: "Coffee time! ☕",
      image: "https://via.placeholder.com/150/24f355",
      time: "Today, 8:00 AM",
    },
    {
      text: "Nature walk 🌿",
      image: "https://via.placeholder.com/150/d32776",
      time: "2 days ago, 6:15 PM",
    },
  ]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleImageChange = (e) =>
    setStatusImage(URL.createObjectURL(e.target.files[0]));

  const handleAddStatus = () => {
    setUserStatuses([
      ...userStatuses,
      {
        text: statusText,
        image: statusImage,
        time: new Date().toLocaleString(),
      },
    ]);
    setStatusText("");
    setStatusImage(null);
    handleClose();
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
        {userStatuses.map((status, index) => (
          <Grid
            container
            alignItems="center"
            key={index}
            className={styles.statusItem}
          >
            <Grid item xs={4} md={2} lg={1.2}>
              <div className={styles.statusCircle}>
                <img
                  src={status.image}
                  alt="status"
                  className={styles.statusImage}
                />
              </div>
            </Grid>
            <Grid item xs={8} md={10} lg={10.8}>
              <Typography variant="body1">{status.text}</Typography>
              <Typography variant="caption" className={styles.statusTime}>
                {status.time}
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
            <span className={styles.uploadIcon}>
              <SentimentSatisfiedAltIcon />
            </span>
          </div>

          {statusImage && (
            <img
              src={statusImage}
              alt="Preview"
              className={styles.imagePreview}
            />
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
