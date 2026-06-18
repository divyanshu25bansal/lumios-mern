import { useContext, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";
import { BASE_URL } from "../utils/constant";
import { UserRedirectURL } from "../utils/userRedirectURL";
import { UserContext } from "../context/UserContext";

export default function Authentication() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(
    location.pathname === "/login" ? true : false,
  );
  const [authDetails, setAuthDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);

  // context
  const { user, setUser } = useContext(UserContext);

  // auth state change
  const authChange = () => {
    setIsLogin((prev) => !prev);
    setAuthDetails({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });
    return true;
  };

  const handleSignUp = async () => {
    try {
      const response = await axios.post(
        BASE_URL + "/signup",
        {
          authDetails,
        },
        { withCredentials: true },
      );
      setUser(response.data.userInfo);
      navigate(UserRedirectURL(response.data.userInfo));
    } catch (err) {
      setError("Please enter valid credentials!!");
    }
  };

  const handleLogIn = async () => {
    try {
      const response = await axios.post(
        BASE_URL + "/login",
        {
          authDetails,
        },
        {
          withCredentials: true,
        },
      );
      setUser(response.data.userInfo);
      navigate(UserRedirectURL(response.data.userInfo));
    } catch (err) {
      setError("Please enter valid credentials!!");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#0d0a33] via-[#6d28d9] to-[#0d0a33] text-white">
      <Header />

      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
        <div className="grid w-full max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left Side */}
          <div className="hidden lg:block">
            <h1 className="mt-8 text-5xl font-extrabold leading-tight">
              Build healthier
              <span className="bg-linear-to-r from-violet-300 to-pink-300 bg-clip-text text-transparent">
                {" "}
                habits
              </span>
              <br />
              every day.
            </h1>

            <p className="mt-4 max-w-lg text-lg text-white/70">
              Track hydration, sleep, nutrition, habits and get AI-powered
              insights to improve your wellness journey.
            </p>
          </div>

          {/* Auth Card */}
          <div className="mx-auto w-full max-w-md">
            <div className="rounded-4xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h2>

                <p className="mt-2 text-sm text-white/60">
                  {isLogin
                    ? "Sign in to continue your wellness journey"
                    : "Start tracking your health with Lumios"}
                </p>
              </div>

              {!isLogin ? (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="input input-bordered w-full border-white/10 bg-white/10 text-white placeholder:text-white/40"
                      value={authDetails.firstName}
                      onChange={(e) =>
                        setAuthDetails({
                          ...authDetails,
                          firstName: e.target.value,
                        })
                      }
                    />

                    <input
                      type="text"
                      placeholder="Last Name"
                      className="input input-bordered w-full border-white/10 bg-white/10 text-white placeholder:text-white/40"
                      value={authDetails.lastName}
                      onChange={(e) =>
                        setAuthDetails({
                          ...authDetails,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <input
                    type="email"
                    placeholder="Email Address"
                    className="input input-bordered w-full border-white/10 bg-white/10 text-white placeholder:text-white/40"
                    value={authDetails.email}
                    onChange={(e) =>
                      setAuthDetails({
                        ...authDetails,
                        email: e.target.value,
                      })
                    }
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    className="input input-bordered w-full border-white/10 bg-white/10 text-white placeholder:text-white/40"
                    value={authDetails.password}
                    onChange={(e) =>
                      setAuthDetails({
                        ...authDetails,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="input input-bordered w-full border-white/10 bg-white/10 text-white placeholder:text-white/40"
                    value={authDetails.email}
                    onChange={(e) =>
                      setAuthDetails({
                        ...authDetails,
                        email: e.target.value,
                      })
                    }
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    className="input input-bordered w-full border-white/10 bg-white/10 text-white placeholder:text-white/40"
                    value={authDetails.password}
                    onChange={(e) =>
                      setAuthDetails({
                        ...authDetails,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              {error && (
                <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-300">
                  {error}
                </p>
              )}

              <button
                className="btn btn-primary mt-6 h-12 w-full rounded-xl text-base"
                onClick={isLogin ? handleLogIn : handleSignUp}
              >
                {isLogin ? "Log In" : "Create Account"}
              </button>

              <div className="divider divider-neutral text-white/40">OR</div>

              <button
                onClick={authChange}
                className="w-full text-center text-sm text-violet-300 transition hover:text-violet-200"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Log in"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
