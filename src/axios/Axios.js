import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

export const axiosReq = axios.create({
  baseURL: process.env.REACT_APP_BASEURL,
  withCredentials: true,
});


