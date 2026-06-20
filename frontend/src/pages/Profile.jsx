import { useContext, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { UserContext } from "../context/UserContext";
import {
  Camera,
  ChevronRight,
  LogOut,
  Mail,
  Phone,
  Shield,
  UserRound,
} from "lucide-react";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { BASE_URL } from "../utils/constant";
import { useNavigate } from "react-router";
import { checkUserProfileData } from "../utils/userRedirectURL";

const createProfileObject = (userData = {}) => ({
  firstName: userData.firstName || "",
  lastName: userData.lastName || "",
  gender: userData.gender || "",
  height: userData.height || "",
  weight: userData.weight || "",
  age: userData.age || "",
});

const themeOptions = [
  "light",
  "dark",
  "abyss",
  "cupcake",
  "synthwave",
  "halloween",
  "caramellatte",
  "valentine",
  "aqua",
  "night",
  "coffee",
  "dim",
  "black",
  "retro",
  "business",
  "forest",
];

export default function Profile() {
  const navigate = useNavigate();
  const { user = {}, setUser, theme, setTheme } = useContext(UserContext);
  const [profile, setProfile] = useState("profile");
  const [isEdit, setIsEdit] = useState(false);
  const [profileData, setProfileData] = useState(() =>
    createProfileObject(user),
  );
  const [originalProfileData, setOriginalProfileData] = useState(() =>
    createProfileObject(user),
  );

  const settingsItems = [
    "Change Password",
    "Notification Settings",
    "Privacy Settings",
    "Delete Account",
  ];

  const fullName =
    [profileData.firstName, profileData.lastName].filter(Boolean).join(" ") ||
    "Lumios User";

  const handleLogOut = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      setUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async () => {
    const toastId = toast.loading("Saving profile...");

    try {
      if (!checkUserProfileData(profileData)) {
        toast.error("Please fill all required fields", { id: toastId });
        return false;
      }

      const response = await axios.patch(
        BASE_URL + "/profile/edit",
        profileData,
        { withCredentials: true },
      );

      const savedData = response.data?.data || response.data;
      setProfileData(createProfileObject(savedData));
      setOriginalProfileData(createProfileObject(savedData));
      setUser(savedData);
      setIsEdit(false);
      toast.success("Profile saved successfully", { id: toastId });
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || "Failed to save profile";
      toast.error(errorMessage, { id: toastId });
    }
  };

  const handleDiscard = () => {
    setProfileData(originalProfileData);
    setIsEdit(false);
    toast("Changes discarded", { variant: "default" });
  };

  const handleDeleteProfile = async () => {
    try {
      await axios.delete(BASE_URL + "/profile", {
        withCredentials: true,
      });
      setUser(null);
      navigate("/");
    } catch {
      toast.error("Failed to delete profile");
    }
  };

  const handleTheme = (e) => {
    setTheme(e.target.value);
    document.documentElement.setAttribute("data-theme", e.target.value);
    localStorage.setItem("data-theme", e.target.value);
  };

  return (
    <>
      <Toaster richColors position="top-center" duration={2000} />

      <Sidebar>
        <main className="flex-1 bg-base-200 p-6 text-base-content min-h-screen transition-colors duration-200">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium text-primary">Account</p>
                <h1 className="text-3xl font-bold text-base-content">
                  Profile Settings
                </h1>
                <p className="mt-1 text-base-content/60">
                  Manage your personal information and preferences.
                </p>
              </div>

              <div className="flex gap-3">
                {isEdit && (
                  <button
                    onClick={handleDiscard}
                    className="btn btn-outline border-base-300 bg-base-100 text-base-content hover:bg-base-300"
                  >
                    Discard
                  </button>
                )}

                <button
                  onClick={() => (isEdit ? handleSave() : setIsEdit(true))}
                  className="btn btn-primary text-primary-content border-none"
                >
                  {isEdit ? "Save Changes" : "Edit Profile"}
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="tabs rounded-2xl border border-base-300/60 bg-base-100 p-1 shadow-xs w-fit flex gap-1">
                <button
                  className={`tab rounded-xl font-medium transition-all ${
                    profile === "profile"
                      ? "bg-primary/10 text-primary"
                      : "text-base-content/70 hover:text-base-content"
                  }`}
                  onClick={() => setProfile("profile")}
                >
                  Profile
                </button>

                <button
                  className={`tab rounded-xl font-medium transition-all ${
                    profile === "settings"
                      ? "bg-primary/10 text-primary"
                      : "text-base-content/70 hover:text-base-content"
                  }`}
                  onClick={() => setProfile("settings")}
                >
                  Settings
                </button>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-12">
              {/* Left Card */}
              <div className="xl:col-span-4">
                <div className="overflow-hidden rounded-3xl border border-base-300/60 bg-base-100 shadow-md">
                  <div className="h-24 bg-linear-to-r from-primary via-secondary to-accent" />

                  <div className="p-6">
                    <div className="-mt-20 flex justify-center">
                      <div className="relative">
                        <div className="h-36 w-36 overflow-hidden rounded-full border-4 border-base-100 shadow-xl">
                          <img
                            src="https://i.pravatar.cc/200"
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <label className="btn btn-circle btn-primary absolute bottom-1 right-1 btn-sm text-primary-content">
                          <Camera size={14} />
                          <input type="file" className="hidden" />
                        </label>
                      </div>
                    </div>

                    <div className="mt-4 text-center">
                      <h2 className="text-2xl font-bold">{fullName}</h2>
                      <p className="text-base-content/60">Wellness Member</p>
                    </div>

                    <div className="mt-6 space-y-3">
                      <div className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-primary/5 p-3">
                        <Mail size={18} className="text-primary" />
                        <span className="text-sm font-medium">
                          {user.email}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-base-200/60 p-4 text-center">
                        <p className="text-xs text-base-content/50">
                          Member Since
                        </p>
                        <p className="font-bold text-primary mt-0.5">
                          May 2024
                        </p>
                      </div>

                      <div className="rounded-2xl bg-base-200/60 p-4 text-center">
                        <p className="text-xs text-base-content/50">
                          Total Days
                        </p>
                        <p className="font-bold text-primary mt-0.5">22 Days</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side */}
              <div className="xl:col-span-8">
                {profile === "profile" ? (
                  <div className="rounded-3xl border border-base-300/60 bg-base-100 p-6 shadow-md">
                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <UserRound size={20} className="text-primary" />
                      </div>

                      <h2 className="text-lg font-semibold">
                        Personal Information
                      </h2>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <input
                        className="input input-bordered w-full bg-base-200/40 text-base-content"
                        placeholder="First Name"
                        value={profileData.firstName}
                        onChange={(e) => {
                          setProfileData((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }));
                        }}
                        readOnly={!isEdit}
                      />

                      <input
                        className="input input-bordered w-full bg-base-200/40 text-base-content"
                        placeholder="Last Name"
                        value={profileData.lastName}
                        onChange={(e) => {
                          setProfileData((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }));
                        }}
                        readOnly={!isEdit}
                      />

                      <input
                        className="input input-bordered w-full bg-base-200/20 text-base-content/60 cursor-not-allowed"
                        placeholder="Email"
                        value={user.email}
                        readOnly
                      />

                      <select
                        className={`select select-bordered w-full bg-base-200/40 text-base-content ${!isEdit ? "pointer-events-none opacity-80" : ""}`}
                        value={profileData.gender}
                        onChange={(e) => {
                          setProfileData((prev) => ({
                            ...prev,
                            gender: e.target.value,
                          }));
                        }}
                        disabled={!isEdit}
                      >
                        <option value={""}>Select Gender</option>
                        <option value={"male"}>Male</option>
                        <option value={"female"}>Female</option>
                        <option value={"other"}>Prefer not to say</option>
                      </select>

                      <input
                        className="input input-bordered w-full bg-base-200/40 text-base-content"
                        placeholder="Age"
                        value={profileData.age}
                        onChange={(e) => {
                          setProfileData((prev) => ({
                            ...prev,
                            age: e.target.value,
                          }));
                        }}
                        readOnly={!isEdit}
                      />

                      <input
                        className="input input-bordered w-full bg-base-200/40 text-base-content"
                        placeholder="Height"
                        value={profileData.height}
                        onChange={(e) => {
                          setProfileData((prev) => ({
                            ...prev,
                            height: e.target.value,
                          }));
                        }}
                        readOnly={!isEdit}
                      />

                      <input
                        className="input input-bordered w-full bg-base-200/40 text-base-content"
                        placeholder="Weight"
                        type="number"
                        min="1"
                        inputMode="numeric"
                        value={profileData.weight}
                        onChange={(e) => {
                          setProfileData((prev) => ({
                            ...prev,
                            weight: e.target.value,
                          }));
                        }}
                        readOnly={!isEdit}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-base-300/60 bg-base-100 p-6 shadow-md">
                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <Shield size={20} className="text-primary" />
                      </div>

                      <h2 className="text-lg font-semibold">
                        Account Settings
                      </h2>
                    </div>

                    <div className="space-y-3">
                      <div
                        className={`flex w-full items-center justify-between rounded-2xl border px-4 py-1.5 transition-all border-base-300 hover:bg-primary/5 text-base-content"
                          }`}
                      >
                        <span className="font-medium text-sm">
                          Change theme
                        </span>
                        <div className="w-28 sm:w-40">
                          <select
                            onChange={handleTheme}
                            className="select"
                            defaultValue={theme}
                          >
                            {themeOptions.map((theme, index) => (
                              <option key={index} value={theme}>
                                {theme}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      {settingsItems.map((item) => (
                        <button
                          key={item}
                          onClick={
                            item === "Delete Account"
                              ? handleDeleteProfile
                              : null
                          }
                          className={`flex w-full items-center justify-between rounded-2xl border p-4 transition-all ${
                            item === "Delete Account"
                              ? "border-error/30 hover:bg-error/10 text-error"
                              : "border-base-300 hover:bg-primary/5 text-base-content"
                          }`}
                        >
                          <span className="font-medium text-sm">{item}</span>
                          <ChevronRight size={18} className="opacity-70" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </Sidebar>
    </>
  );
}
