import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Button,
  Modal,
} from "@mui/material";
import ExploreIcon from "@mui/icons-material/Explore";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import PeopleIcon from "@mui/icons-material/People";
import DashboardIcon from "@mui/icons-material/Dashboard";
import styles from "../styles/Dashboard.module.css";
import { useNavigate } from "react-router-dom";

const users = [
  {
    id: 1,
    name: "John Doe",
    description: "Software Engineer",
    avatar: "https://via.placeholder.com/80",
  },
  {
    id: 2,
    name: "Jane Smith",
    description: "Product Manager",
    avatar: "https://via.placeholder.com/80",
  },
  {
    id: 3,
    name: "Alice Johnson",
    description: "UX Designer",
    avatar: "https://via.placeholder.com/80",
  },
  {
    id: 4,
    name: "Michael Brown",
    description: "Data Scientist",
    avatar: "https://via.placeholder.com/80",
  },
  {
    id: 5,
    name: "Michael Brown",
    description: "Data Scientist",
    avatar: "https://via.placeholder.com/80",
  },
  {
    id: 6,
    name: "Michael Brown",
    description: "Data Scientist",
    avatar: "https://via.placeholder.com/80",
  },
  {
    id: 7,
    name: "Michael Brown",
    description: "Data Scientist",
    avatar: "https://via.placeholder.com/80",
  },
];

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate=useNavigate();
  
  return (
    <Box className={styles.dashboardContainer}>
      {/* Sidebar with static content */}
      <Box className={styles.sidebar}>
        <Box className={styles.sidebarHeader}>
          <DashboardIcon className={styles.headerIcon} />
          <Typography variant="h4" className={styles.welcome}>
            Welcome Back, User!
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
        <List className={styles.list}>
          {users.map((user) => (
            <ListItem
              key={user.id}
              className={`${styles.listItem} ${
                selectedUser?.id === user.id ? styles.selected : ""
              }`}
              onClick={() => {
                navigate(`/chat/${user.id}`)
                setSelectedUser(user)}}
            >
              <ListItemAvatar>
                <Avatar src={user.avatar} className={styles.avatar} />
              </ListItemAvatar>
              <ListItemText primary={user.name} secondary={user.description} />
              <ChevronRightIcon className={styles.chevronIcon} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Modal for exploring people */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        className={styles.modal}
      >
        <Box className={styles.modalContent}>
          <Typography variant="h6" className={styles.modalHeader}>
            Explore People
          </Typography>
          <List className={styles.list}>
            {users.map((user) => (
              <ListItem key={user.id} className={styles.listItem}>
                <ListItemAvatar>
                  <Avatar src={user.avatar} className={styles.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={user.name}
                  secondary={user.description}
                />
                <ChevronRightIcon className={styles.chevronIcon} />
              </ListItem>
            ))}
          </List>
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpen(false)}
            className={styles.closeButton}
            startIcon={<CloseIcon />}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
