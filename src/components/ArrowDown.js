import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useEffect, useState } from "react";

export const ArrowDown = () => {
  const [scrollPosition, setScrollPosition] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    scrollPosition > 20 && (
      <ArrowDownwardIcon
        sx={{
          position: "fixed",
          bottom: "85px",
          right: "18px",
          backgroundColor: "whitesmoke",
          padding: "10px",
          borderRadius: "10px",
        }}
      />
    )
  );
};
