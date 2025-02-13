import { Box, Button, Modal, Typography, Tab, Tabs, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import styles from "../styles/Chat.module.css";
import styles1 from "../styles/Dashboard.module.css";
import { axiosReq } from "../axios/Axios";

export const UserDetailsModal = ({
  headerModalOpen,
  setHeaderModalOpen,
  profileImage,
  username,
  description,
  about,
  senderId,
  receiverId,
}) => {
  const [activeTab, setActiveTab] = useState(0); // Track selected tab

  const [mediaArray, setMediaArray] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalLength, setTotalLength] = useState(0);


  useEffect(() => {
    axiosReq
      .post("/chat/getMedia", {
        senderId: senderId,
        receiverId: receiverId,
        page: page,
      })
      .then((res) => {
        setMediaArray([...mediaArray, ...res.data.data]);
        setTotal(res.data.totalPages);
        setTotalLength(res.data.totalMedia);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <Modal
      open={headerModalOpen}
      onClose={() => setHeaderModalOpen(false)}
      className={styles.headerModal}
    >
      <Box className={styles.headerModalContent}>
        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          className={styles.tabs}
        >
          <Tab label="User Details" />
          <Tab label="Images" />
        </Tabs>

        {/* Tab Content */}
        {activeTab === 0 ? (
          <Box className={styles.tabContent}>
            <img
              src={profileImage}
              alt="Profile"
              className={styles.bannerImage}
            />
            <Typography variant="h6" className={styles.modalName}>
              {username}
            </Typography>
            <Typography variant="body2" className={styles.modalAbout}>
              {about}
            </Typography>
            <Typography variant="body2" className={styles.modalDescription}>
              {description}
            </Typography>
          </Box>
        ) : (
          <Box className={styles.tabContent}>
            {mediaArray?.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center">
                No Media available
              </Typography>
            ) : (
              <>
                <Grid container className={styles1.centerButton}>
                  {mediaArray.map((data, index) => (
                    <Grid item xs={6} sm={4}>
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
        )}

        {/* Close Button */}

        <Button
          onClick={() => setHeaderModalOpen(false)}
          className={styles.btn}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};
