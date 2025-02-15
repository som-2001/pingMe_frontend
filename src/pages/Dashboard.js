import React, { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Button,
  Grid,
  Skeleton,
} from "@mui/material";
import ExploreIcon from "@mui/icons-material/Explore";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import ForumIcon from "@mui/icons-material/Forum";
import DashboardIcon from "@mui/icons-material/Dashboard";
import styles from "../styles/Dashboard.module.css";
import { useNavigate } from "react-router-dom";
import { ExploreUsersModal } from "../components/ExploreUsersModal";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { axiosReq } from "../axios/Axios";
import toast from "react-hot-toast";
import { NoChatsFound } from "../components/NoChatsFound";
import { io } from "socket.io-client";
import dayjs from "dayjs";
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const socket = io(`${process.env.REACT_APP_BASEURL}/chat`, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 5000,
});

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  const sender_id = jwtDecode(Cookies?.get("refreshToken"))?.userId;
  const username = jwtDecode(Cookies?.get("refreshToken"))?.username;

  useEffect(() => {
    const room = `room_${sender_id}`;

    socket.emit("room_join", {
      room: room,
      sender_id: sender_id,
      username: username,
    });
  }, [sender_id, username]);

  useEffect(() => {
    setLoad(true);
    axiosReq
      .post("/chat/get-chats", { sender_id: sender_id })
      .then((res) => {
        console.log(res.data);
        setUsers((prevUsers) => [...prevUsers, ...res.data.users]);
        // setTotal(res.data.total);
      })
      .catch((err) => {
        console.error(err);
        toast.error(err?.response?.data?.message);
      })
      .finally(() => {
        setLoad(false);
      });
  }, [sender_id]);
  return (
    <Box className={styles.dashboardContainer}>
      <Box className={styles.sidebar} sx={{ height: "fit-content" }}>
        <Box className={styles.sidebarHeader}>
          <DashboardIcon className={styles.headerIcon} />
          <Typography
            variant="h6"
            className={styles.welcome}
            sx={{
              fontSize: {
                xs: "19px",
                sm: "1.5rem",
              },
            }}
          >
            Welcome, {username}!
          </Typography>
        </Box>
        <Typography variant="body1" className={styles.description}>
          Here’s your personalized dashboard overview. Stay updated with the
          latest news and explore your network of amazing people.
        </Typography>
        <Box className={styles.staticContent}>
          <Box className={styles.staticHeaderContainer}>
            <AnnouncementIcon className={styles.staticIcon} />
            <Typography variant="h6" className={styles.staticHeader}>
              Latest News
            </Typography>
          </Box>
          <Typography variant="body2" className={styles.staticText}>
            Our platform just received a major upgrade—enjoy enhanced features
            and improved performance.
          </Typography>
          <Typography variant="body2" className={styles.staticText}>
            Join our upcoming webinar on modern UI/UX design trends.
          </Typography>
        </Box>

        <Button
          variant="contained"
          className={styles.exploreButton}
          onClick={() => setOpen(true)}
          startIcon={<ExploreIcon />}
        >
          Explore Now
        </Button>

        <Box>
          <Typography variant="h5" sx={{ my: 3 }} color="text.secondary">
            Here are some shortcuts
          </Typography>
          <Box className={styles.ShortcutBox}>
            <Grid container>
              <Grid item xs={2} className={styles.centerIcon}>
                <AccountCircleIcon sx={{ fontSize: "2.2rem" }} />
              </Grid>
              <Grid item xs={10} onClick={(e) => navigate("/profile")}>
                <Typography variant="body1">Go To Profile</Typography>
                <Typography variant="body2">
                  In profile you can update your profile image, descriptions,
                  about and other stuffs.
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>

      {/* Main content with People List */}
      <Box
        className={styles.mainContent}
        sx={{ height: { xs: "100vh", lg: "90vh" } }}
      >
        <Box className={styles.mainHeaderContainer}>
          <ForumIcon className={styles.mainIcon} />
          <Typography variant="h5" className={styles.header}>
            Messages
          </Typography>
        </Box>
        {load ? (
          Array.from({ length: 5 }).map((data, index) => (
            <Box
              className={styles.Skeleton}
              sx={{
                width: { xs: "270px", sm: "auto" },
              }}
            >
              <Box className={styles.flexSkeleton}>
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
        ) : (
          <List className={styles.list}>
            {users?.length === 0 ? (
              <NoChatsFound />
            ) : (
              users.map((user) => (
                <ListItem
                  key={user.id}
                  className={`${styles.listItem} ${
                    selectedUser?.id === user.id ? styles.selected : ""
                  }`}
                  onClick={() => {
                    navigate(
                      `/chat/${
                        user.sender._id === sender_id
                          ? user.receiver?._id
                          : user.sender?._id
                      }`,
                      {
                        state: {
                          userDetails:
                            user.sender._id === sender_id
                              ? user.receiver
                              : user.sender,
                        },
                      }
                    );
                    setSelectedUser(user);
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={
                        user.sender._id === sender_id
                          ? user.receiver?.profileImage
                          : user.sender?.profileImage
                      }
                      className={styles.avatar}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    sx={{ padding: "10px" }}
                    primary={
                      <span className={styles.flexContainer}>
                        {user.sender._id === sender_id
                          ? user.receiver?.username
                          : user.sender?.username}
                        <Typography variant="body2">
                          {dayjs().diff(
                            dayjs(user.sortedComments.createdAt),
                            "hours"
                          ) < 24
                            ? dayjs(user.sortedComments.createdAt).format(
                                "h:mm A"
                              )
                            : dayjs(user.sortedComments.createdAt).format(
                                "DD/MM/YY"
                              )}
                        </Typography>
                      </span>
                    }
                    secondary={
                      user?.sortedComments?.message.startsWith(
                        "https://res.cloudinary.com/dpacclyw4/image"
                      ) ? (
                        <Box
                          sx={{
                            display: "flex",
                            gap: "2px",

                            alignItems: "center",
                          }}
                        >
                          <span style={{ fontSize: "11px" }}>
                            {user?.sortedComments?.sender_id === sender_id
                              ? "you"
                              : user?.sortedComments?.username}
                          </span>
                          :
                          <img
                            src={user?.sortedComments?.message}
                            alt=""
                            style={{
                              width: "30px",
                              height: "30px",
                              objectFit: "contain",
                              borderRadius: "10px",
                            }}
                          />
                        </Box>
                      ) : user?.sortedComments?.message?.length > 100 ? (
                        `${user?.sortedComments?.message.slice(0, 100)}...`
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            gap: "2px",

                            alignItems: "center",
                          }}
                        >
                          <span style={{ fontSize: "11px" }}>
                            {user?.sortedComments?.sender_id === sender_id
                              ? "you"
                              : user?.sortedComments?.username}
                          </span>
                          :{<span style={{ fontSize: "11px" }}>{user?.sortedComments?.message}</span>}
                        </Box>
                      )
                    }
                  />
                </ListItem>
              ))
            )}
          </List>
        )}
      </Box>

      <ExploreUsersModal
        open={open}
        setOpen={setOpen}
        socket={socket}
        username={username}
      />
    </Box>
  );
}
