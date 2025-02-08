import React, { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Popover,
  Typography,
  Avatar,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import ImageIcon from "@mui/icons-material/Image";
import VideocamIcon from "@mui/icons-material/Videocam";
import styles from "../styles/Chat.module.css";
import { UserDetailsModal } from "./UserDetailsModel";

// Dummy user details for the header and profile modal
const user = {
  name: "John Doe",
  avatar: "https://via.placeholder.com/80", // Small avatar image
  banner: "https://via.placeholder.com/600x200", // Bigger banner image for profile modal
  about:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
};

export const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [headerModalOpen, setHeaderModalOpen] = useState(false);

  // Opens the attachment popover
  const handleAttachClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Closes the attachment popover
  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  // Sends a message if not empty
  const handleSendMessage = () => {
    if (message.trim() !== "") {
      setMessages([...messages, { text: message, timestamp: new Date() }]);
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
    <Box className={styles.chatContainer}>
      {/* Header with user avatar and name */}
      <Box className={styles.header} onClick={() => setHeaderModalOpen(true)}>
        <Avatar src={user.avatar} className={styles.headerAvatar} />
        <Typography variant="h6" className={styles.headerName}>
          {user.name}
        </Typography>
      </Box>

      {/* Chat messages display */}
      <Box className={styles.messagesContainer}>
        {messages.length === 0 ? (
          <Typography variant="body2" className={styles.noMessages}>
            No messages yet. Start the conversation!
          </Typography>
        ) : (
          messages.map((msg, index) => (
            <Box key={index} className={styles.messageBubble}>
              <Typography variant="body1">{msg.text}</Typography>
              <Typography variant="caption" className={styles.timestamp}>
                {msg.timestamp.toLocaleTimeString()}
              </Typography>
            </Box>
          ))
        )}
      </Box>

      {/* Input area with text field, attachment & send buttons */}
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

      {/* Attachment options popover */}
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
          user={user}
        />
      )}
    </Box>
  );
};
