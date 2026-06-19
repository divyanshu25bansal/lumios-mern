import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { BASE_URL } from "../utils/constant";
import { Navigate, Route, Routes } from "react-router";
import ProtectedRoute from "./ProtectedRoute";
import Authentication from "../pages/Auth";
import Onboarding from "../pages/Onboarding";
import Profile from "../pages/Profile";
import Loading from "../pages/Loading";
import { UserRedirectURL } from "../utils/userRedirectURL";
import NotFound from "../pages/404";
import Dashboard from "../pages/Dashboard";
import Hydration from "../pages/Hydration";
import Nutrition from "../pages/Nutrition";
import Habits from "../pages/Habits";
import SleepBoard from "../pages/Sleep";

export default function AuthLoader() {
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const startTime = Date.now();

      try {
        const response = await axios.get(BASE_URL + "/profile", {
          withCredentials: true,
        });

        setUser(response.data);
      } catch (err) {
        setUser(null);
      } finally {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(1000 - elapsed, 0);

        setTimeout(() => {
          setLoading(false);
        }, remaining);
      }
    };

    loadUser();
  }, [setUser]);

  if (loading) {
    return <Loading message="Loading your page..." />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <Navigate to={UserRedirectURL(user)} replace />
          ) : (
            <Onboarding />
          )
        }
      />

      <Route
        path="/login"
        element={
          user ? (
            <Navigate to={UserRedirectURL(user)} replace />
          ) : (
            <Authentication />
          )
        }
      />

      <Route
        path="/signup"
        element={
          user ? (
            <Navigate to={UserRedirectURL(user)} replace />
          ) : (
            <Authentication />
          )
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/hydration" element={<Hydration />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/sleep" element={<SleepBoard />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
