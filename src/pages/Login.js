import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import styles from "../styles/registration.module.css";
import { Lock, Email } from "@mui/icons-material";
import coffee from "../coffee.svg";
import { useNavigate } from "react-router-dom";
import { axiosReq } from "../axios/Axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { requestNotificationPermission } from "../firebase";
import { jwtDecode } from "jwt-decode";

const schema = yup.object().shape({
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
});

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [load, setLoad] = useState(false);

  useEffect(() => {
    let token = Cookies.get("refreshToken");
    if (token) {
      navigate("/dashboard");
    }else{
      navigate("/signin")
    }
  }, []);

  const navigate = useNavigate();

  const onSubmit = (data) => {
    setLoad(true);
    axiosReq
      .post("/auth/login", data)
      .then(async (res) => {
        console.log(res.data);
        Cookies.set("accessToken", res.data.accessToken, { expires: 1 / 24 });
        Cookies.set("refreshToken", res.data.refreshToken, { expires: 24 });
        localStorage.setItem("profileImage",res.data.user.profileImage);
        sessionStorage.setItem("email",res.data.user.email);
        toast.success(res.data.message);
        const id = jwtDecode(Cookies?.get("refreshToken"))?.userId;
        const fcmToken = await requestNotificationPermission();
        console.log(fcmToken);
        if (fcmToken) {
          // Send FCM token to backend
          await axiosReq.post("/users/update-fcm-token", {
            userId: id,
            token: fcmToken,
          });
        }

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err?.response?.data?.message);
      })
      .finally(() => {
        setTimeout(() => {
          setLoad(false);
        }, 1000);
      });

    console.log("Form Data:", data);
  };

  return (
    <Grid container className={styles.container}>
      <Grid item xs={12} md={6} className={styles.leftPanel}>
        <Typography variant="h4" className={styles.logo}>
          PingMe
        </Typography>
        <Typography className={styles.description}>
          Share Your Smile with this world and Find Friends
        </Typography>
        <div className={styles.coffeeIcon}>
          <img src={coffee} alt="" />
        </div>
        <Typography className={styles.enjoyText}>Enjoy..!</Typography>
      </Grid>
      <Grid item xs={12} md={6} className={styles.formContainer}>
        <Typography className={styles.title}>Sign In Here</Typography>
        <Typography variant="body2" color="text.secondary">
          Let's connect with world
        </Typography>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputContainer}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="email"
                  variant="standard"
                  label="Enter Email ID"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  className={styles.textField}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </div>

          <div className={styles.inputContainer}>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="password"
                  label="Enter Password"
                  fullWidth
                  variant="standard"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Lock />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={load}
            variant="contained"
            className={styles.button}
          >
            {load ? <CircularProgress size={25} color="white" /> : "Continue"}
          </Button>
          <p className={styles.p}>
            New User? register{" "}
            <span className={styles.span} onClick={(e) => navigate("/signup")}>
              here
            </span>
          </p>
        </form>
      </Grid>
    </Grid>
  );
};

export default Login;
