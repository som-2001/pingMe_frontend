import React from "react";
import styles from "../styles/NoChatFound.module.css";

export const NoChatsFound = () => {
  return (
    <div className={styles.container}>
      <div className={styles.imageSection}>
        <img
          src="../../images/noChat.jpg"
          alt="No Chats Illustration"
          className={styles.image}
        />
      </div>
      <div className={styles.textSection}>
        <h1 className={styles.title}>No Chats Available</h1>
        <p className={styles.description}>
          It seems like there are no chats at the moment. Start a new conversation by clicking Explore Now button or check back later for updates.
        </p>
      </div>
    </div>
  );
};

