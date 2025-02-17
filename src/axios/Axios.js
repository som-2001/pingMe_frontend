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
   
  }
}
);
