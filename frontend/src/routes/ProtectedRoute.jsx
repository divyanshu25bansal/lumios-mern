import { Navigate, Outlet, useLocation } from "react-router";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { checkUserProfileData } from "../utils/userRedirectURL";

export default function ProtectedRoute() {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const isProfileCompleted = checkUserProfileData(user);

  if (!user) {
    return <Navigate to={"/login"} replace />;
  }

  if (!isProfileCompleted && location.pathname !== "/profile") {
    return <Navigate to="/profile" replace />;
  }

  // replace is simply a boolean prop of Navigate component.
  // replace prevents browser back button from returning to blocked protected page

  return <Outlet />;
}
