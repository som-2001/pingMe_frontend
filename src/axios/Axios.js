import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

export const axiosReq = axios.create({
  baseURL: process.env.REACT_APP_BASEURL,
  withCredentials: true,
});

axiosReq.interceptors.response.use(
  (response) => {
    // If the response is successful, just return the data
    return response;
  },
  (error) => {
    if (error.response) {
 
      console.error("Response Error:", error.response);
      if (error.response.status === 403 || error.response.status === 401) {
        toast.error("Session has expired.");
      } else if (error.response.status === 500) {
        toast.error("Server error occurred.");
      } else {
        toast.error("Unexpected response error.");
      }
    } else if (error.request) {
      console.error("No response from server:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    toast.error("An error occurred. Please try again later.");
    Cookies.remove("refreshToken");
    window.location.href = "/signin";

    return Promise.reject(error);
  }
);
