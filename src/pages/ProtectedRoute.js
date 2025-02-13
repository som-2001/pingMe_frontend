import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";
export const ProtectedRoute = () => {

  const token = Cookies?.get("refreshToken")


  if (!token) return <Navigate to="/signin" />;

  return <Outlet />;
};
