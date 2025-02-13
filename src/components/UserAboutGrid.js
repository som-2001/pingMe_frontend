import { Avatar, Box, Grid, Skeleton, Typography } from "@mui/material";
import styles from "../styles/Chat.module.css";
import { useEffect, useState } from "react";
import { axiosReq } from "../axios/Axios";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import dayjs from "dayjs";
import { ImageModel } from "./ImageModal";
import { LoadMoreImageModel } from "./LoadmoreImageModel";
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

export const UserAboutGrid = ({
  profileImg,
  username1,
  about,
  description,
  address,
  phone,
  email,
  receiverId,
  senderId,
  load,
}) => {
  const [mediaArray, setMediaArray] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [mediaLoad, setMediaLoad] = useState(true);
  const [totalLength, setTotalLength] = useState(0);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState("");
  const [loadmore, setLoadMore] = useState(false);

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
      })
      .finally(() => {
        setMediaLoad(false);
      });
  }, [page]);

  const handleImage = (image) => {
    setOpen(true);
    console.log(image);
    setImage(image);
  };

  return (
    <>
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        sx={{ display: { xs: "none", sm: "block" } }}
        className={styles.userDetailsContainer}
      >
        {/* User Image & Banner */}
        <Box className={styles.bannerContainer}>
          <Box className={styles.banner} />
          <Avatar
            src={profileImg}
            alt="User Name"
            className={styles.profileImage}
          />
        </Box>

        {/* User Info */}
        <Box className={styles.userInfo}>
          <Typography variant="h6" className={styles.userName}>
            {load ? (
              <Box className={styles.centerSkeleton}>
                <Skeleton animation="wave" width={120} />
              </Box>
            ) : (
              username1
            )}
          </Typography>
          <Typography variant="body2" className={styles.userTitle}>
            {load ? (
              <Box className={styles.centerSkeleton}>
                <Skeleton animation="wave" width={240} />
              </Box>
            ) : (
              about
            )}
          </Typography>
        </Box>

        <Box className={styles.sectionParent}>
          {/* About Me Section */}
          <Box className={styles.section}>
            <Typography variant="body1" className={styles.sectionTitle}>
              About Me:
            </Typography>
            <Typography variant="body2" className={styles.sectionText}>
              {load ? <Skeleton animation="wave" width={120} /> : description}
            </Typography>
          </Box>

          {/* Contact Section */}
          <Box className={styles.section}>
            <Typography variant="body1" className={styles.sectionTitle}>
              Contact:
            </Typography>
            <Typography variant="body2" className={styles.sectionText}>
              {load ? <Skeleton animation="wave" width={240} /> : `📧${email}`}
            </Typography>
            <Typography variant="body2" className={styles.sectionText}>
              {load ? <Skeleton animation="wave" width={240} /> : `📍${phone}`}
            </Typography>
            <Typography variant="body2" className={styles.sectionText}>
              {load ? (
                <Skeleton animation="wave" width={240} />
              ) : (
                `📍${address}`
              )}
            </Typography>
          </Box>

          <Box sx={{ p: 1.2, width: "97%" }}>
            <Box className={styles.flexMediaButtons}>
              <Typography variant="body1" className={styles.sectionTitle}>
                Media ({totalLength})
              </Typography>

              <ArrowForwardIosIcon
                sx={{ fontSize: "1rem", cursor: "pointer" }}
                onClick={(e) => setLoadMore(true)}
              />
            </Box>

            {mediaLoad ? (
              <Box className={styles.parent}>
                <Skeleton animation="wave" width={120} height={120} />
                <Skeleton animation="wave" width={120} height={120} />
                <Skeleton animation="wave" width={120} height={120} />
                <Skeleton animation="wave" width={120} height={120} />
              </Box>
            ) : mediaArray?.length === 0 ? (
              <Typography variant="body2" align="center" sx={{ my: 5 }}>
                No Media found.
              </Typography>
            ) : (
              mediaArray?.slice(0, 4)?.map((data, index) => (
                <img
                  key={index}
                  src={data.message}
                  alt=""
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "contain",
                    cursor: "pointer",
                  }}
                  onClick={(e) => handleImage(data)}
                />
              ))
            )}
          </Box>
        </Box>
      </Grid>

      <ImageModel open={open} setOpen={setOpen} image={image} />
      <LoadMoreImageModel
        open={loadmore}
        setOpen={setLoadMore}
        mediaArray={mediaArray}
        setMediaArray={setMediaArray}
        page={page}
        total={total}
        setPage={setPage}
      />
    </>
  );
};
