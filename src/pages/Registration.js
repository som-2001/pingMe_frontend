import React, { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  InputAdornment,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import styles from "../styles/registration.module.css";
import { Person, Lock, Email } from "@mui/icons-material";
import coffee from "../coffee.svg";
import { useNavigate } from "react-router-dom";
import { axiosReq } from "../axios/Axios";
import toast from "react-hot-toast";

const schema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required"),
});

const RegistrationForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode:"onSubmit"
  });

  const [load, setLoad] = useState(false);

  const navigate = useNavigate();

  const onSubmit = (data) => {
    setLoad(true);
    axiosReq
      .post("/auth/register", data)
      .then((res) => {
        setTimeout(() => {
          navigate("/signin");
        }, 1000);
        toast.success(res.data.message);
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
        ChatterBox
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
        <Typography className={styles.title}>Sign Up Here</Typography>
        <Typography variant="body2" color="text.secondary">
          Let's connect with world
        </Typography>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputContainer}>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Enter Username"
                  fullWidth
                  variant="standard"
                  autoComplete="off"
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  className={styles.textField}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Person />
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
                  autoComplete="off"
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
          <div className={styles.inputContainer}>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="password"
                  label="Confirm Password"
                  fullWidth
                  autoComplete="off"
                  variant="standard"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
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
          <div className={styles.inputContainer}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="email"
                  autoComplete="off"
                  variant="standard"
                  label="Enter Email ID"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
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
          <Button
            type="submit"
            disabled={load}
            variant="contained"
            className={styles.button}
          >
            Continue
          </Button>
          <p className={styles.p}>
            Already Registered? login{" "}
            <span className={styles.span} onClick={(e) => navigate("/signin")}>
              here
            </span>
          </p>
        </form>
      </Grid>
    </Grid>
  );
};

export default RegistrationForm;
