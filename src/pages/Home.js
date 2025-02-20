import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Home.module.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2f80ed",
    },
    secondary: {
      main: "#56ccf2",
    },
  },
});

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <Box className={styles.homepageContainer}>
        {/* Navbar */}
        <AppBar position="static" className={styles.navbar}>
          <Toolbar>
            <Typography variant="h6" className={`${styles.logo} ${styles.logoanimation}`}>
            ChatterBox
            </Typography>
            <Button
              className={styles.loginButton}
              onClick={(e) => navigate("/signin")}
            >
              Login
            </Button>
          </Toolbar>
        </AppBar>

        {/* Hero Section */}
        <Container maxWidth="md" className={styles.heroSection}>
          <Typography variant="h3" color="text.secondary" gutterBottom>
            Welcome to <span className={styles.animation}>ChatterBox !!</span>
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Connect with friends, family, and colleagues instantly.
          </Typography>
          <Box mt={4}>
            <Button
              className={`${styles.getStartedButton}`}
              size="large"
              onClick={(e) => navigate("/signin")}
            >
              Get Started
            </Button>
          </Box>
         
        </Container>

        <Typography align="center" color="text.secondary" sx={{mt:9}}>
            Made with ❤️ By Someswar gorai
          </Typography>
      </Box>
    </ThemeProvider>
  );
};

export default HomePage;
