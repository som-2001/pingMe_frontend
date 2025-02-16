import {
  Avatar,
  Box,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { NoChatsFound } from "../NoChatsFound";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import styles from "../../styles/Dashboard.module.css";

export const MessageList = ({
  users,
  sender_id,
  selectedUser,
  setSelectedUser,
}) => {
  const navigate = useNavigate();

  return users?.length === 0 ? (
    <NoChatsFound />
  ) : (
    users.map((user) => (
      <ListItem
        key={user.id}
        className={`${styles.listItem} ${
          selectedUser?.id === user?.id ? styles.selected : ""
        }`}
        onClick={() => {
          navigate(
            `/chat/${
              user?.sender?._id === sender_id
                ? user?.receiver?._id
                : user?.sender?._id
            }`,
            {
              state: {
                userDetails:
                  user?.sender?._id === sender_id ? user?.receiver : user?.sender,
              },
            }
          );
          setSelectedUser(user);
        }}
      >
        <ListItemAvatar>
          <Avatar
            src={
              user?.sender?._id === sender_id
                ? user?.receiver?.profileImage
                : user?.sender?.profileImage
            }
            className={styles.avatar}
          />
        </ListItemAvatar>
        <ListItemText
          sx={{ padding: "10px" }}
          primary={
            <span className={styles.flexContainer}>
              {user?.sender?._id === sender_id
                ? user?.receiver?.username
                : user?.sender?.username}
             
                <Typography variant="body2">
                  {dayjs().diff(dayjs(user?.sortedComments?.createdAt), "hours") <
                  24
                    ? dayjs(user?.sortedComments?.createdAt).format("h:mm A")
                    : dayjs(user?.sortedComments?.createdAt).format("DD/MM/YY")}
                </Typography>
                
            
            </span>
          }
          secondary={
            user?.sortedComments?.message.startsWith(
              "https://res.cloudinary.com/dpacclyw4/image"
            ) ? (
              <Box
                sx={{
                  display: "flex",
                  gap: "2px",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "11px" }}>
                  {user?.sortedComments?.sender_id === sender_id
                    ? "you"
                    : user?.sortedComments?.username.length > 15
                    ? `${user?.sortedComments?.username?.slice(0, 15)}...`
                    : user?.sortedComments?.username}
                </span>
                :
                <img
                  src={user?.sortedComments?.message}
                  alt=""
                  style={{
                    width: "30px",
                    height: "30px",
                    objectFit: "contain",
                    borderRadius: "10px",
                  }}
                />
                <Typography variant="body2">
                  {user?.unread?.count===0 ? null: user?.unread?.id === sender_id
                    ? `${user?.unread?.count} unseen`
                    : user?.unread?.count}
                </Typography>
              </Box>
            ) : user?.sortedComments?.message?.length > 15 ? (
              <Box
                sx={{
                  display: "flex",
                  gap: "2px",

                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "11px" }}>
                  {user?.sortedComments?.sender_id === sender_id
                    ? "you"
                    : user?.sortedComments?.username.split(" ")[0]}
                </span>
                :
                <span style={{ fontSize: "11px" }}>
                  {user?.sortedComments?.message?.slice(0, 15)}...
                </span>
                <Typography variant="body2">
                  {user?.unread?.count===0 ? null: user?.unread?.id === sender_id
                    ? <span className={styles.unseen_badge}>{user?.unread?.count} unseen</span>
                    : <span className={styles.unread_badge}>{user?.unread?.count}</span>}
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  gap: "2px",

                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "11px" }}>
                  {user?.sortedComments?.sender_id === sender_id
                    ? "you"
                    : user?.sortedComments?.username.split(" ")[0]}
                </span>
                :
                
                  <span style={{ fontSize: "11px" }}>
                    {user?.sortedComments?.message}
                  </span>
                  
                   <Typography variant="body2">
                  {user?.unread?.count===0 ? null: user?.unread?.id === sender_id
                    ? <span className={styles.unseen_badge}>{user?.unread?.count} unseen</span>
                    : <span className={styles.unread_badge}>{user?.unread?.count}</span>}
                </Typography>
                
              </Box>
            )
          }
        />
      </ListItem>
    ))
  );
};
