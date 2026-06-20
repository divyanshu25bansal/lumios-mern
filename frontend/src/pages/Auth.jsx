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
    setError(null);
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
    <div className="min-h-screen bg-base-200 text-base-content transition-colors duration-200">
      <Header />

      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
        <div className="grid w-full max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left Side */}
          <div className="hidden lg:block">
            <h1 className="mt-8 text-5xl font-extrabold leading-tight tracking-tight">
              Build healthier{" "}
              <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                habits
              </span>
              <br />
              every day.
            </h1>

            <p className="mt-4 max-w-lg text-lg text-base-content/70">
              Track hydration, sleep, nutrition, habits and get AI-powered
              insights to improve your wellness journey.
            </p>
          </div>

          {/* Auth Card */}
          <div className="mx-auto w-full max-w-md">
            <div className="rounded-3xl border border-base-300/60 bg-base-100 p-8 shadow-xl">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold tracking-tight">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h2>

                <p className="mt-2 text-sm text-base-content/60">
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
                      className="input input-bordered w-full bg-base-200/40 text-base-content"
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
                      className="input input-bordered w-full bg-base-200/40 text-base-content"
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
                    className="input input-bordered w-full bg-base-200/40 text-base-content"
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
                    className="input input-bordered w-full bg-base-200/40 text-base-content"
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
                    className="input input-bordered w-full bg-base-200/40 text-base-content"
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
                    className="input input-bordered w-full bg-base-200/40 text-base-content"
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
                <div className="alert alert-error mt-4 rounded-xl p-3 text-sm font-medium shadow-xs">
                  <span>{error}</span>
                </div>
              )}

              <button
                className="btn btn-primary mt-6 h-12 w-full rounded-xl text-base text-primary-content border-none shadow-md shadow-primary/10"
                onClick={isLogin ? handleLogIn : handleSignUp}
              >
                {isLogin ? "Log In" : "Create Account"}
              </button>

              <div className="divider text-base-content/30 my-6 text-xs uppercase font-semibold tracking-wider">
                OR
              </div>

              <button
                onClick={authChange}
                className="w-full text-center text-sm font-medium text-primary hover:underline transition-all"
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
