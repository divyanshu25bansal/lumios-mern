import { useContext, useState } from "react";
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

export default function Profile() {
  const navigate = useNavigate();
  const { user = {}, setUser } = useContext(UserContext);
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

  const updateField = (field) => (e) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <>
      <Toaster richColors position="top-center" duration={2000} />

      <Sidebar>
        <main className="flex-1 bg-slate-50 p-6 text-black">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium text-violet-600">Account</p>
                <h1 className="text-3xl font-bold text-slate-800">
                  Profile Settings
                </h1>
                <p className="mt-1 text-slate-500">
                  Manage your personal information and preferences.
                </p>
              </div>

              <div className="flex gap-3">
                {isEdit && (
                  <button
                    onClick={handleDiscard}
                    className="btn border-slate-300 bg-white text-base-300"
                  >
                    Discard
                  </button>
                )}

                <button
                  onClick={() => (isEdit ? handleSave() : setIsEdit(true))}
                  className="btn border-none bg-linear-to-r from-violet-600 to-indigo-600 text-white"
                >
                  {isEdit ? "Save Changes" : "Edit Profile"}
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="tabs rounded-2xl border border-slate-200 bg-white p-1 shadow-sm w-fit">
                <button
                  className={`tab rounded-xl text-black ${
                    profile === "profile" ? "bg-violet-100 text-violet-700" : ""
                  }`}
                  onClick={() => setProfile("profile")}
                >
                  Profile
                </button>

                <button
                  className={`tab rounded-xl text-black ${
                    profile === "settings"
                      ? "bg-violet-100 text-violet-700"
                      : ""
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
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
                  <div className="h-24 bg-linear-to-r from-violet-600 via-purple-600 to-indigo-600" />

                  <div className="p-6">
                    <div className="-mt-20 flex justify-center">
                      <div className="relative">
                        <div className="h-36 w-36 overflow-hidden rounded-full border-4 border-white shadow-xl">
                          <img
                            src="https://i.pravatar.cc/200"
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <label className="btn btn-circle btn-primary absolute bottom-1 right-1 btn-sm">
                          <Camera size={14} />
                          <input type="file" className="hidden" />
                        </label>
                      </div>
                    </div>

                    <div className="mt-4 text-center">
                      <h2 className="text-2xl font-bold">{fullName}</h2>

                      <p className="text-slate-500">Wellness Member</p>
                    </div>

                    <div className="mt-6 space-y-3">
                      <div className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-violet-50 p-3">
                        <Mail size={18} className="text-violet-600" />
                        <span>{user.email}</span>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-slate-50 p-4 text-center">
                        <p className="text-xs text-slate-500">Member Since</p>
                        <p className="font-bold text-violet-700">May 2024</p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4 text-center">
                        <p className="text-xs text-slate-500">Total Days</p>
                        <p className="font-bold text-violet-700">22 Days</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side */}
              <div className="xl:col-span-8">
                {profile === "profile" ? (
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
                        <UserRound size={20} className="text-violet-700" />
                      </div>

                      <h2 className="text-lg font-semibold">
                        Personal Information
                      </h2>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <input
                        className="input border-slate-200 bg-slate-50"
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
                        className="input border-slate-200 bg-slate-50"
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
                        className="input border-slate-200 bg-slate-50 cursor-not-allowed"
                        placeholder="Email"
                        value={user.email}
                        readOnly
                      />

                      <select
                        className={`select border-slate-200 bg-slate-50 ${!isEdit && "pointer-events-none"}`}
                        value={profileData.gender}
                        onChange={(e) => {
                          setProfileData((prev) => ({
                            ...prev,
                            gender: e.target.value,
                          }));
                        }}
                      >
                        <option value={""}>Select Gender</option>
                        <option value={"male"}>Male</option>
                        <option value={"female"}>Female</option>
                        <option value={"other"}>Prefer not to say</option>
                      </select>

                      <input
                        className="input border-slate-200 bg-slate-50"
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
                        className="input border-slate-200 bg-slate-50"
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
                        className="input border-slate-200 bg-slate-50"
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
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
                        <Shield size={20} className="text-violet-700" />
                      </div>

                      <h2 className="text-lg font-semibold">
                        Account Settings
                      </h2>
                    </div>

                    <div className="space-y-3">
                      {settingsItems.map((item) => (
                        <button
                          key={item}
                          className={`flex w-full items-center justify-between rounded-2xl border p-4 transition-all ${
                            item === "Delete Account"
                              ? "border-red-200 hover:bg-red-50 text-red-500"
                              : "border-slate-200 hover:bg-violet-50"
                          }`}
                        >
                          <span>{item}</span>
                          <ChevronRight size={18} />
                        </button>
                      ))}
                    </div>

                    <button
                      className="btn btn-ghost mt-6 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={handleLogOut}
                    >
                      <LogOut size={18} />
                      Log Out
                    </button>
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
