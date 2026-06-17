import { Navigate, Outlet } from "react-router";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";

export default function ProtectedRoute() {
  const { user } = useContext(UserContext);
  if (!user) {
    return <Navigate to={"/login"} replace />;
  }

  return <Outlet />;
}
