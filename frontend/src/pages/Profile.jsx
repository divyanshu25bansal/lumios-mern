import { useContext, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { UserContext } from "../context/UserContext";
import { ChevronRight, LogOut, Camera } from "lucide-react";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { BASE_URL } from "../utils/constant";
import { useNavigate } from "react-router";
import { checkUserProfileData } from "../utils/userRedirectURL";

const createProfileObject = (userData) => ({
  firstName: userData.firstName || "",
  lastName: userData.lastName || "",
  gender: userData.gender || "",
  height: userData.height || "",
  weight: userData.weight || "",
  age: userData.age || "",
});

export default function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [profile, setProfile] = useState("profile");
  const [isEdit, setIsEdit] = useState(false);
  const [profileData, setProfileData] = useState(createProfileObject({}));
  const [originalProfileData, setOriginalProfileData] = useState(profileData);

  useEffect(() => {
    const initialProfile = createProfileObject(user);
    setProfileData(initialProfile);
    setOriginalProfileData(initialProfile);
  }, [user]);

  const settingsItems = [
    "Change Password",
    "Notification Settings",
    "Privacy Settings",
    "Delete Account",
  ];

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
      setProfileData(savedData);
      setOriginalProfileData(savedData);
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

  return (
    <div className="flex">
      <Toaster richColors position="top-center" duration={2000} />
      <Sidebar />

      <div className="flex-1 p-4 md:p-8 bg-white min-h-screen text-black">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-black">Profile</h1>
            <p className="text-md opacity-80 text-black">
              Manage your personal information.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {isEdit && (
              <button
                onClick={handleDiscard}
                className="btn btn-outline text-black rounded-full px-8 border-gray-300 hover:bg-gray-100"
              >
                Discard
              </button>
            )}

            <button
              onClick={() => (isEdit ? handleSave() : setIsEdit(true))}
              className={`btn text-white rounded-full px-8 ${
                !isEdit
                  ? "bg-blue-600 hover:bg-blue-700 border-none"
                  : "bg-pink-700 hover:bg-pink-700 border-none"
              }`}
            >
              {isEdit ? "Save Profile" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* Main Container */}
        <div className="bg-white rounded-2xl mt-8 p-8 shadow-lg border border-gray-200">
          {/* Tabs */}
          <div role="tablist" className="tabs tabs-bordered mb-8 gap-10">
            <button
              className={`pb-3 cursor-pointer ${profile === "profile" ? " border-blue-600 text-blue-600 font-medium border-b-2" : ""}`}
              onClick={() => setProfile("profile")}
            >
              Profile
            </button>

            {/* <button
              className={`pb-3 cursor-pointer ${profile === "goals" ? " border-blue-600 text-blue-600 font-medium border-b-2" : ""}`}
              onClick={() => setProfile("goals")}
            >
              Goals
            </button> */}

            <button
              className={`pb-3 cursor-pointer ${profile === "settings" ? " border-blue-600 text-blue-600 font-medium border-b-2" : ""}`}
              onClick={() => setProfile("settings")}
            >
              Settings
            </button>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Card */}
            <div className="lg:col-span-4">
              <div className="card bg-white shadow-xl border border-gray-200 rounded-2xl">
                <div className="card-body items-center text-center">
                  <div className="avatar">
                    <div className="relative w-36 h-36">
                      <label className="cursor-pointer">
                        <div className="w-36 h-36 rounded-full overflow-hidden ring ring-gray-100 ring-offset-4">
                          <img
                            src={"https://i.pravatar.cc/200"}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full text-white">
                          <Camera size={16} />
                        </div>

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold mt-3">Divyanshu Bansal</h2>

                  <p className="text-sm opacity-70">divyanshu@email.com</p>

                  <p className="text-sm opacity-70">+91 98765 43210</p>

                  <div className="divider"></div>

                  <div className="flex justify-between w-full">
                    <div>
                      <p className="text-xs opacity-60">Member Since</p>

                      <p className="font-semibold">May 2024</p>
                    </div>

                    <div>
                      <p className="text-xs opacity-60">Total Days</p>

                      <p className="font-semibold">22 Days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form */}
            {profile === "profile" ? (
              <div className="lg:col-span-8">
                <div className="card bg-white shadow-xl border border-gray-200 rounded-2xl">
                  <div className="card-body">
                    <h2 className="font-semibold mb-4">Personal Information</h2>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      <div>
                        <label className="label">
                          <span className="label-text">First Name</span>
                        </label>

                        <input
                          className="input w-full bg-white border border-gray-200 focus:outline-none"
                          placeholder="Captain Jack"
                          value={profileData.firstName}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              firstName: e.target.value,
                            }))
                          }
                          readOnly={!isEdit ? true : false}
                        />
                      </div>

                      <div>
                        <label className="label">
                          <span className="label-text">Last Name</span>
                        </label>

                        <input
                          className="input w-full bg-white border border-gray-200 focus:outline-none"
                          placeholder="sparrow"
                          value={profileData.lastName}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              lastName: e.target.value,
                            }))
                          }
                          readOnly={!isEdit ? true : false}
                        />
                      </div>

                      <div>
                        <label className="label">
                          <span className="label-text">Email</span>
                        </label>

                        <input
                          className="input w-full bg-white border border-gray-200 focus:outline-none cursor-not-allowed"
                          placeholder="blackPearl@davyjones.com"
                          type="email"
                          value={user.email}
                          readOnly
                        />
                      </div>

                      <div>
                        <label className="label">
                          <span className="label-text">Gender</span>
                        </label>

                        <select
                          className="input cursor-default w-full bg-white border border-gray-200 focus:outline-none"
                          value={profileData.gender}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              gender: e.target.value,
                            }))
                          }
                          readOnly={!isEdit ? true : false}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Prefer not to say</option>
                        </select>
                      </div>

                      <div>
                        <label className="label">
                          <span className="label-text">Age</span>
                        </label>

                        <input
                          className="input w-full bg-white border border-gray-200 focus:outline-none"
                          value={profileData.age}
                          placeholder="50"
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              age: e.target.value,
                            }))
                          }
                          readOnly={!isEdit ? true : false}
                        />
                      </div>

                      <div>
                        <label className="label">
                          <span className="label-text">Height</span>
                        </label>

                        <input
                          className="input w-full bg-white border border-gray-200 focus:outline-none"
                          value={profileData.height}
                          placeholder="175"
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              height: e.target.value,
                            }))
                          }
                          readOnly={!isEdit ? true : false}
                        />
                      </div>

                      <div>
                        <label className="label">
                          <span className="label-text">Weight</span>
                        </label>

                        <input
                          className="input w-full bg-white border border-gray-200 focus:outline-none"
                          value={profileData.weight}
                          placeholder="68"
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              weight: e.target.value,
                            }))
                          }
                          readOnly={!isEdit ? true : false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="lg:col-span-8">
                <div className="card bg-white shadow-xl border border-gray-200 rounded-2xl">
                  <div className="card-body">
                    <h2 className="font-semibold mb-5">Account Settings</h2>
                    <div>
                      <div className="flex justify-between items-center pb-3.5 border-b border-gray-200 cursor-pointer hover:bg-gray-50 px-2 rounded-lg transition">
                        <p>Change Theme</p>
                        <select className="select-info">
                          <option value="dark">Dark</option>
                          <option value="light">Light</option>
                        </select>
                      </div>
                      {settingsItems.map((item) => (
                        <div
                          key={item}
                          className="flex justify-between items-center py-3.5 border-b border-gray-200 cursor-pointer hover:bg-gray-50 px-2 rounded-lg transition"
                        >
                          <p>{item}</p>
                          <ChevronRight size={18} />
                        </div>
                      ))}
                      <div className="flex gap-2 items-center p-3.5 cursor-pointer border-gray-200  hover:bg-gray-50 px-2 rounded-lg transition">
                        <LogOut className="text-red-600" />
                        <button
                          className="text-red-600 cursor-pointer"
                          onClick={handleLogOut}
                        >
                          Log Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
