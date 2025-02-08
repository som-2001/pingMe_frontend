import { Box, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import styles from "../styles/Chat.module.css";
export const UserDetailsModal = ({ headerModalOpen, setHeaderModalOpen,user }) => {
  return (
    <Modal
      open={headerModalOpen}
      onClose={() => setHeaderModalOpen(false)}
      className={styles.headerModal}
    >
      <Box className={styles.headerModalContent}>
        <img src={user.banner} alt="Banner" className={styles.bannerImage} />
        <Typography variant="h5" className={styles.modalName}>
          {user.name}
        </Typography>
        <Typography variant="body1" className={styles.modalAbout}>
          {user.about}
        </Typography>
        <IconButton
          onClick={() => setHeaderModalOpen(false)}
          className={styles.modalCloseButton}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Modal>
  );
};
