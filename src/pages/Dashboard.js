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
  CircularProgress,
} from "@mui/material";
import ExploreIcon from "@mui/icons-material/Explore";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import PeopleIcon from "@mui/icons-material/People";
import DashboardIcon from "@mui/icons-material/Dashboard";
import styles from "../styles/Dashboard.module.css";
import { useNavigate } from "react-router-dom";
import { ExploreUsersModal } from "../components/ExploreUsersModal";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { axiosReq } from "../axios/Axios";
import toast from "react-hot-toast";
import { NoChatsFound } from "../components/NoChatsFound";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  const sender_id = jwtDecode(Cookies?.get("refreshToken"))?.userId;
  const username = jwtDecode(Cookies?.get("refreshToken"))?.username;

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
  }, []);
  return (
    <Box className={styles.dashboardContainer}>
      {/* Sidebar with static content */}
      <Box className={styles.sidebar}>
        <Box className={styles.sidebarHeader}>
          <DashboardIcon className={styles.headerIcon} />
          <Typography variant="h4" className={styles.welcome}>
            Welcome Back, {username}!
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
      </Box>

      {/* Main content with People List */}
      <Box className={styles.mainContent}>
        <Box className={styles.mainHeaderContainer}>
          <PeopleIcon className={styles.mainIcon} />
          <Typography variant="h5" className={styles.header}>
            Chats
          </Typography>
        </Box>
        {load?<Box className={styles.center}><CircularProgress size={30}/></Box>:<List className={styles.list}>
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
                  <Avatar src={user.avatar} className={styles.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    user.sender._id === sender_id
                      ? user.receiver?.username
                      : user.sender?.username
                  }
                  secondary={user?.sortedComments?.message}
                />
                <ChevronRightIcon className={styles.chevronIcon} />
              </ListItem>
            ))
          )}
        </List>}
      </Box>

      <ExploreUsersModal open={open} setOpen={setOpen} />
    </Box>
  );
}
