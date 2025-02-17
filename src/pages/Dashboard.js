import React, { useEffect, useState } from "react";
import {
  Box,
  List,
  Typography,
  Button,
  Grid,
  Skeleton,
  Tabs,
  Tab,
} from "@mui/material";
import ExploreIcon from "@mui/icons-material/Explore";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
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
import { io } from "socket.io-client";
import dayjs from "dayjs";
import { MessageList } from "../components/Dashboard/MessageList";
import { StatusComponent } from "../components/Dashboard/StatusComponent";
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
  const refreshToken = Cookies?.get("refreshToken");

  let sender_id = null;
  let username = null;

  if (refreshToken) {
    try {
      const decodedToken = jwtDecode(refreshToken) || "invalid token";
      sender_id = decodedToken?.userId || null;
      username = decodedToken?.username || null;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }
  const [value, setValue] = React.useState("one");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // In your chat page component:

  useEffect(() => {
    const room = `room_${sender_id}`;

    socket.emit("room_join", {
      room: room,
      sender_id: sender_id,
      username: username,
    });
  }, [sender_id, username]);

 

  useEffect(() => {
    const seen_message = (data) => {
      setUsers((prevUsers) => {
        const userIndex = prevUsers.findIndex(
          (user) =>
            user.sender_id === data.sender_id ||
            user.receiver_id === data.sender_id
        );

        if (userIndex !== -1) {
          // Create a new array to avoid mutating the original state
          const updatedUsers = [...prevUsers];

          // Update the user object with a new unread count
          updatedUsers[userIndex] = {
            ...updatedUsers[userIndex],
            unread: {
              ...updatedUsers[userIndex].unread,
              count: 0, // Set unread count to 0
            },
            sortedComments: {
              ...updatedUsers[userIndex].sortedComments, // Keep other properties as is
            },
          };

          // Return the updated state
          return updatedUsers;
        }

        // If user not found, return the previous state unchanged
        return prevUsers;
      });
    };

    socket.on("seen_message", seen_message);

    return () => {
      socket.off("seen_message", seen_message);
    };
  }, []);

  useEffect(() => {
    setLoad(true);
    axiosReq
      .post("/chat/get-chats", { sender_id: sender_id })
      .then((res) => {
        console.log(res.data);
        setUsers(res.data.users);
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

  useEffect(() => {
    const DashboardMessage = (data) => {
      setUsers((prevUsers) => {
        const userIndex = prevUsers.findIndex(
          (user) =>
            user.sender_id === data.sender_id ||
            user.receiver_id === data.sender_id
        );

        let updatedUsers;

        if (userIndex !== -1) {
          updatedUsers = [...prevUsers];
          updatedUsers[userIndex] = {
            ...updatedUsers[userIndex],
            unread: {
              ...updatedUsers[userIndex].unread,
              count: updatedUsers?.[userIndex]?.unread?.count + 1,
            },
            sortedComments: {
              ...updatedUsers[userIndex].sortedComments,
              message: data.message,
              createdAt: data.createdAt,
            },
          };
        } else {
          updatedUsers = [
            ...prevUsers,
            {
              sender_id: data.sender_id,
              unread: {
                ...updatedUsers[userIndex].unread,
                count: updatedUsers?.[userIndex]?.unread?.count + 1,
              },
              sortedComments: {
                message: data.message,
                username: data.username,
                createdAt: data.createdAt,
              },
              sender: {
                _id: sender_id,
              },
              receiver: {
                username: data.username,
                _id: data.sender_id,
                profileImage: data.profileImage,
              },
            },
          ];
        }

        return updatedUsers.sort(
          (a, b) =>
            new Date(b.sortedComments.createdAt) -
            new Date(a.sortedComments.createdAt)
        );
      });
    };

    socket.on("dashboard_message", DashboardMessage);

    return () => {
      socket.off("dashboard_message", DashboardMessage);
    };
  }, []);

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
                <Typography variant="body1">Profile</Typography>
                <Typography variant="body2">
                  Update your photo, description, about and other stuffs.
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
      <Box
        className={styles.mainContent}
        sx={{ height: { xs: "100vh", lg: "90vh" } }}
      >
        <Box className={styles.mainHeaderContainer}>
          <Tabs
            sx={{ width: "100%" }}
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab
              value="one"
              icon={<ForumIcon className={styles.mainIcon} />}
              iconPosition="start"
              label="Messages"
            />
            <Tab
              value="two"
              icon={<DynamicFeedIcon className={styles.mainIcon} />}
              iconPosition="start"
              label="Status"
            />
          </Tabs>
        </Box>
        {value === "one" ? (
          load ? (
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
              <MessageList
                users={users}
                sender_id={sender_id}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
              />
            </List>
          )
        ) : null}

        {value === "two" ? <StatusComponent /> : null}
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
