import { Avatar, Box, Grid, Typography } from "@mui/material";
import styles from "../styles/Chat.module.css";

export const UserAboutGrid = ({
  profileImg,
  username1,
  about,
  description,
  address,
  phone,
  email,
}) => {
  return (
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
          {username1}
        </Typography>
        <Typography variant="body2" className={styles.userTitle}>
          {about}
        </Typography>
      </Box>

      <Box className={styles.sectionParent}>
        {/* About Me Section */}
        <Box className={styles.section}>
          <Typography variant="body1" className={styles.sectionTitle}>
            About Me:
          </Typography>
          <Typography variant="body2" className={styles.sectionText}>
            {description}
          </Typography>
        </Box>

        {/* Contact Section */}
        <Box className={styles.section}>
          <Typography variant="body1" className={styles.sectionTitle}>
            Contact:
          </Typography>
          <Typography variant="body2" className={styles.sectionText}>
            📧 {email}
          </Typography>
          <Typography variant="body2" className={styles.sectionText}>
            📍 {phone}
          </Typography>
          <Typography variant="body2" className={styles.sectionText}>
            📍 {address}
          </Typography>
        </Box>
      </Box>
    </Grid>
  );
};
