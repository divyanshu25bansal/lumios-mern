import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function Authentication() {
  const location = useLocation();
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

  const handleSignUp = () => {
    try {
    } catch (err) {
      setError(err?.message || "Something went wrong!!");
    }
  };

  const handleLogIn = () => {
    try {
    } catch (err) {
      setError(err?.message || "Something went wrong!!");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#0d0a33] via-[#8332b1] to-[#0d0a33] text-white flex flex-col flex-1 justify-between items-center">
      <Header />
      <div className="card bg-base-100 max-w-sm shadow-sm">
        <div className="card-body items-center text-center">
          <h2 className="text-3xl">{isLogin ? "Log In" : "Sign Up"}</h2>
          {isLogin ? (
            <div>
              <input
                type="email"
                placeholder="Email"
                title="Email"
                className="input input-bordered w-full mt-2"
                value={authDetails.email}
                onChange={(e) => {
                  setAuthDetails({ ...authDetails, email: e.target.value });
                }}
              />
              <input
                type="password"
                placeholder="Password"
                title="Password"
                className="input input-bordered w-full mt-2"
                value={authDetails.password}
                onChange={(e) => {
                  setAuthDetails({ ...authDetails, password: e.target.value });
                }}
              />
            </div>
          ) : (
            <div>
              <input
                type="text"
                placeholder="Firstname"
                title="Firstname"
                className="input input-bordered w-full mt-2"
                value={authDetails.firstName}
                onChange={(e) => {
                  setAuthDetails({ ...authDetails, firstName: e.target.value });
                }}
              />
              <input
                type="text"
                placeholder="Lastname"
                title="Lastname"
                className="input input-bordered w-full mt-2"
                value={authDetails.lastName}
                onChange={(e) => {
                  setAuthDetails({ ...authDetails, lastName: e.target.value });
                }}
              />
              <input
                type="email"
                placeholder="Email"
                title="Email"
                className="input input-bordered w-full mt-2"
                value={authDetails.email}
                onChange={(e) => {
                  setAuthDetails({ ...authDetails, email: e.target.value });
                }}
              />
              <input
                type="password"
                placeholder="Password"
                title="Password"
                className="input input-bordered w-full mt-2"
                value={authDetails.password}
                onChange={(e) => {
                  setAuthDetails({ ...authDetails, password: e.target.value });
                }}
              />
            </div>
          )}

          <p className="mt-2 text-[14px] text-red-600">{error}</p>
          <button className="btn btn-primary mt-4 w-full">
            {isLogin ? "Log In" : "Create Account"}
          </button>
          <p
            className="text-center mt-2 cursor-pointer text-sm link"
            onClick={authChange}
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Log in"}
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
