import { Box, Button, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles1 from "../styles/Dashboard.module.css";
import dayjs from "dayjs";
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

export const ImageModel = ({ open, setOpen, image }) => {
  const download = (e) => {
    console.log(e.message);
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.href = e.message;
    a.title = `pingMe_image_by_${e.username}`;
    a.download = `pingMe_image_by_${e.username}.jpg`;
   
    a.click();
    document.body.removeChild(a);
  };
  return (
    <Modal open={open} onClose={() => setOpen(false)} className={styles1.modal}>
      <Box className={styles1.modalContent}>
        <Box className={styles1.flex}>
          <Typography variant="h6" className={styles1.modalHeader}>
            Image Details
          </Typography>

          <CloseIcon
            sx={{ cursor: "pointer" }}
            onClick={(e) => setOpen(false)}
          />
        </Box>

        <img
          src={image.message}
          alt=""
          style={{ width: "300px", height: "300px", objectFit: "contain" }}
        />

        <Typography variant="body2" color="text.secondary">
          Sent By: {image.username}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {dayjs(image.createdAt).fromNow(true)} ago
        </Typography>
        <Button
          className={styles1.exploreButton}
          onClick={(e) => download(image)}
        >
          Download
        </Button>
      </Box>
    </Modal>
  );
};
