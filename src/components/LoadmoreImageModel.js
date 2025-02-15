import { Box, Button, Grid, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles1 from "../styles/Dashboard.module.css";

import dayjs from "dayjs";
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

export const LoadMoreImageModel = ({
  open,
  setOpen,
  mediaArray,
  page,
  total,
  setPage,
}) => {
  //   const download = (e) => {
  //     let a = document.createElement("a");
  //     const link = e.message.blob();
  //     const url = URL.createObjectURL(link);
  //     a.href = url;
  //     a.title = `pingMe_image_by_${e.username}`;
  //     a.download = `pingMe_image_by_${e.username}.jpg`;
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //   };

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };
  return (
    <Modal open={open} onClose={() => setOpen(false)} className={styles1.modal}>
      <Box className={styles1.modalContent}>
        <Box className={styles1.flex}>
          <Typography variant="h6" className={styles1.modalHeader}>
            All Media
          </Typography>

          <CloseIcon
            sx={{ cursor: "pointer" }}
            onClick={(e) => setOpen(false)}
          />
        </Box>

        {mediaArray?.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center">
            No Media available
          </Typography>
        ) : (
          <>
            <Grid container className={styles1.centerButton} spacing={1}>
              
                {mediaArray.map((data, index) => (
                  <Grid item xs={4}>
                    <img
                      src={data.message}
                      alt=""
                      style={{
                        width: "140px",
                        height: "140px",
                        objectFit: "contain",
                      }}
                    />
                  </Grid>
                ))}
              
            </Grid>
            {page < total && (
              <Button className={styles1.exploreButton} onClick={loadMore}>
                Load More
              </Button>
            )}
          </>
        )}
      </Box>
    </Modal>
  );
};
