import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Grid,
  Card,
  CardContent,
  Avatar,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import styles from "../styles/Profile.module.css";
import { axiosReq } from "../axios/Axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

const schema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "at least 3 characters"),
  about: yup
    .string()
    .required("About is required")
    .min(10, "At least 10 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(20, "At least 20 characters"),
  phone: yup
    .number()
    .typeError("Phone must be a number")
    .required("Phone is required"),
  address: yup
    .string()
    .required("Address is required")
    .min(5, "At least 5 characters"),
});

export const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const id = jwtDecode(Cookies?.get("refreshToken"))?.userId;
  const [username, setUsername] = useState("");
  const [about, setAbout] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profileImg,setProfileImg]=useState('');

  useEffect(() => {
    axiosReq
      .get(`/user/profile/${id}`)
      .then((res) => {
        console.log(res.data);
        setUsername(res?.data?.username);
        setAbout(
          res?.data?.about ||
            "Hi! I'm a passionate developer who loves coding and designing."
        );
        setDescription(
          res?.data?.description ||
            " Experienced in full-stack development and always eager to learn new technologies."
        );
        setPhone(res?.data?.contact?.[0]?.phone_number || "1234567890");
        setAddress(
          res?.data?.contact?.[0]?.address || "123 Developer St, Code City"
        );
        setProfileImg(res?.data?.profileImage || "https://via.placeholder.com/150")
        setValue("username", res.data.username);
        setValue("about", res.data.about);
        setValue("description", res.data.description);
        setValue("phone", res.data.contact[0].phone_number);
        setValue("address", res.data.contact[0].address);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [editMode]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    axiosReq
      .put(`/user/profile/${id}`, data)
      .then((res) => {
        console.log(res.data);
        setEditMode(false);
        toast.success("Updated successfully!!")
      })
      .catch((err) => {
        console.log(err);
      });
    console.log("Updated Data:", data);
  };

  const handleFileChange = (e) => {

    const url=URL.createObjectURL(e.target.files[0]);
    setProfileImg(url);
    const formData=new FormData();
    formData.append("image",e.target.files[0])
    axiosReq
      .put(`/user/profileImage/${id}`, formData)
      .then((res) => {
        toast.success("Profile picture is updated successfully!!")
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className={styles.profile_container}>
      <Card className={styles.profile_card}>
        <CardContent>
          <Grid container spacing={3}>
            {/* Profile Image */}
            <Grid
              item
              xs={12}
              md={4}
              className={styles.profile_image_container}
            >
              <Button component="label">
                <Avatar
                  src={profileImg}
                  alt="Profile"
                  className={styles.profile_avatar}
                />
                <input
                  type="file"
                  hidden
                  onChange={(e) => handleFileChange(e)}
                />
              </Button>
            </Grid>

            <Grid item xs={12} md={8}>
              {editMode ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Controller
                    name="username"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="UserName"
                        fullWidth
                        margin="dense"
                        error={!!errors.username}
                        helperText={errors.username?.message}
                      />
                    )}
                  />
                  <Controller
                    name="about"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="About Me"
                        fullWidth
                        margin="dense"
                        error={!!errors.about}
                        helperText={errors.about?.message}
                      />
                    )}
                  />

                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        label="Description"
                        fullWidth
                        margin="dense"
                        error={!!errors.description}
                        helperText={errors.description?.message}
                      />
                    )}
                  />

                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Phone"
                        fullWidth
                        margin="dense"
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                      />
                    )}
                  />

                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Address"
                        fullWidth
                        margin="dense"
                        error={!!errors.address}
                        helperText={errors.address?.message}
                      />
                    )}
                  />
                  <Box className={styles.buttonContainer}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      className={styles.save_button}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => setEditMode(false)}
                      variant="outlined"
                      color="secondary"
                      className={styles.cancel_button}
                    >
                      Cancel
                    </Button>
                  </Box>
                </form>
              ) : (
                <>
                  <Typography variant="h5" className={styles.profile_heading}>
                    Username
                  </Typography>
                  <Typography variant="body1" className={styles.profile_text}>
                    {username}
                  </Typography>
                  <Typography variant="body1" className={styles.profile_text}>
                    {about}
                  </Typography>

                  <Typography variant="h6" className={styles.profile_heading}>
                    Description
                  </Typography>
                  <Typography variant="body1" className={styles.profile_text}>
                    {description}
                  </Typography>

                  <Typography variant="h6" className={styles.profile_heading}>
                    Contact Information
                  </Typography>
                  <Typography variant="body1" className={styles.profile_text}>
                    📞 Phone: {phone}
                  </Typography>
                  <Typography variant="body1" className={styles.profile_text}>
                    📍 Address: {address}
                  </Typography>

                  <Box className={styles.buttonContainer}>
                    <Button
                      onClick={() => setEditMode(true)}
                      variant="contained"
                      color="primary"
                      className={styles.edit_button}
                    >
                      Edit
                    </Button>
                  </Box>
                </>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};
