import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "../styles/UserStatusModal.module.css";
import dayjs from "dayjs";

export const UserStatusModal = ({
  open,
  onClose,
  userStatuses,
  selectedStatus,
}) => {
  

  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.modalContent}>
        <Box className={styles.header}>
          <img
            src={selectedStatus?.userId?.profileImage ?? "../images/user.jpg"}
            alt="User Profile"
            className={styles.profileImage}
          /> 
          <div>
            <Typography variant="h6" className={styles.username}>
              {selectedStatus?.userId?.username}
            </Typography>
            <Typography variant="body2" className={styles.timestamp}>
              {dayjs(selectedStatus?.createdAt).format("YYYY/MM/DD HH:mm:ss")}
            </Typography>
          </div>
          <IconButton onClick={onClose} className={styles.closeButton}>
            <CloseIcon sx={{color:"white"}}/>
          </IconButton>
        </Box>

        <Box className={styles.statusContent}>
          <img
            src={selectedStatus?.status?.image}
            alt="Status"
            className={styles.statusImage}
          />

          <Typography variant="body1" className={styles.statusText}>
            {selectedStatus?.status?.message}
          </Typography>
        </Box>

       
      </div>
    </Modal>
  );
};
