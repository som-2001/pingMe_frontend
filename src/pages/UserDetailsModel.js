import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import styles from "../styles/Chat.module.css";

export const UserDetailsModal = ({
  headerModalOpen,
  setHeaderModalOpen,
  profileImage,
  username,
  description,
  about,
}) => {
  return (
    <Modal
      open={headerModalOpen}
      onClose={() => setHeaderModalOpen(false)}
      className={styles.headerModal}
    >
      <Box className={styles.headerModalContent}>
        <img src={profileImage} alt="Banner" className={styles.bannerImage} />
        <Typography variant="body1" className={styles.modalName}>
          {username}
        </Typography>
        <Typography variant="body2" className={styles.modalName}>
          {about}
        </Typography>
        <Typography variant="body2" className={styles.modalAbout}>
          {description}
        </Typography>
        <span onClick={() => setHeaderModalOpen(false)}>
          <Button className={styles.btn}>Close</Button>
        </span>
      </Box>
    </Modal>
  );
};
