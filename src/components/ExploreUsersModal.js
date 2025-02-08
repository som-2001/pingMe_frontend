import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
  Typography,
} from "@mui/material";
import styles from "../styles/Dashboard.module.css";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useEffect, useRef, useState } from "react";
import { axiosReq } from "../axios/Axios";
import toast from "react-hot-toast";

export const ExploreUsersModal = ({ open, setOpen }) => {
  const [load, setLoad] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [users, setUsers] = useState([]);
  const loadRef = useRef(null);

  // ✅ Fetch Users on Page Change
  useEffect(() => {
    setLoad(true);
    axiosReq
      .post("/user/userList", { page: page })
      .then((res) => {
        console.log(res.data);
        setUsers((prevUsers) => [...prevUsers, ...res.data.users]);
        setTotal(res.data.total);
      })
      .catch((err) => {
        console.error(err);
        toast.error(err?.response?.data?.message);
      })
      .finally(() => {
        setLoad(false);
      });
  }, [page]);

  //   useEffect(() => {
  //     console.log("infiinite");

  //     const observer = new IntersectionObserver(
  //       (entries) => {
  //         const entry = entries[0];
  //         if (entry.isIntersecting && !load && page < total) {
  //           console.log("infiinite2");
  //           setPage((prev) => prev + 1);
  //         }
  //       },
  //       { threshold: 0.6 }
  //     );

  //     if (loadRef.current) {
  //       observer.observe(loadRef.current);
  //     }
  //     return () => {
  //       if (loadRef.current) {
  //         observer.unobserve(loadRef.current);
  //       } // ✅ Ensure cleanup
  //     };
  //   }, [load, page, total]);

  return (
    <Modal open={open} onClose={() => setOpen(false)} className={styles.modal}>
      <Box className={styles.modalContent}>
        <Box className={styles.flex}>
          <Typography variant="h6" className={styles.modalHeader}>
            Explore People
          </Typography>

          <CloseIcon sx={{cursor:"pointer"}} onClick={(e)=>setOpen(false)}/>
        </Box>
        <List className={styles.list}>
          {users.map((user) => (
            <ListItem key={user.id} className={styles.listItem}>
              <ListItemAvatar>
                <Avatar src={user?.avatar} className={styles.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={user?.username}
                secondary={user?.description}
              />
              <ChevronRightIcon className={styles.chevronIcon} />
            </ListItem>
          ))}
        </List>

        {/* ✅ Loading Indicator for Infinite Scroll */}

        <Box>{load && <CircularProgress />}</Box>
        <Button
          variant="contained"
          color="error"
          ref={loadRef}
          onClick={(e) => {
            setLoad(true);
            setPage((prev) => prev + 1);
          }}
          className={styles.closeButton}
        >
          Load More
        </Button>
      </Box>
    </Modal>
  );
};
