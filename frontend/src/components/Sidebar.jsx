import axios from "axios";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { BASE_URL } from "../utils/constant";

import {
  LayoutDashboard,
  Droplets,
  Moon,
  CheckSquare,
  Apple,
  Bot,
  BarChart3,
  User,
  LogOut,
  Menu,
  Sparkles,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
  { name: "Hydration", icon: Droplets, url: "/hydration" },
  { name: "Sleep", icon: Moon, url: "/sleep" },
  { name: "Habits", icon: CheckSquare, url: "/habits" },
  { name: "Nutrition", icon: Apple, url: "/nutrition" },
  { name: "AI Companion", icon: Bot, url: "/companion" },
  { name: "Reports", icon: BarChart3, url: "/reports" },
  { name: "Profile", icon: User, url: "/profile" },
];

const closeDrawer = () => {
  const drawer = document.getElementById("sidebar-drawer");
  if (drawer) drawer.checked = false;
};

export default function Sidebar({ children }) {
  const { setUser } = useContext(UserContext);

  const handleLogOut = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="drawer min-h-screen bg-base-200 text-base-content lg:drawer-open transition-colors duration-200">
      <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex min-h-screen flex-col">
        {/* Mobile Header Navbar */}
        <div className="navbar sticky top-0 z-30 border-b border-base-300 bg-base-100/95 px-3 shadow-xs backdrop-blur lg:hidden">
          <label htmlFor="sidebar-drawer" className="btn btn-square btn-ghost">
            <Menu size={22} />
          </label>

          <div className="ml-2 flex items-center gap-2">
            <img src="/icon.png" alt="Lumios logo" className="h-8 w-8" />
            <span className="text-lg font-bold text-primary tracking-tight">Lumios</span>
          </div>
        </div>

        {children}
      </div>

      <div className="drawer-side z-40 lg:overflow-hidden">
        <label htmlFor="sidebar-drawer" className="drawer-overlay" />

        <aside className="flex h-dvh w-72 flex-col overflow-hidden border-r border-base-300 bg-base-100 shadow-md">
          {/* Logo Heading Header */}
          <div className="shrink-0 border-b border-base-200 px-5 py-4">
            <div className="flex items-center gap-3">
              <img src="/icon.png" alt="Lumios logo" className="h-10 w-10" />

              <div>
                <h1 className="text-2xl font-bold text-primary tracking-tight">Lumios</h1>
                <p className="text-xs text-base-content/60 font-medium">Health dashboard</p>
              </div>
            </div>
          </div>

          {/* Core Navigation Items */}
          <ul className="menu min-h-0 flex-1 gap-1 overflow-y-auto px-3 py-3">
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.url}
                  onClick={closeDrawer}
                  className={({ isActive }) =>
                    `flex! h-11 items-center gap-3 rounded-xl px-3 py-0 font-medium leading-none transition-all ${
                      isActive
                        ? "bg-primary text-primary-content shadow-xs"
                        : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                    }`
                  }
                >
                  <item.icon size={20} className="shrink-0" />
                  <span className="leading-none">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Premium & User Settings Footer actions */}
          <div className="shrink-0 space-y-2 p-3 border-t border-base-200">
            <div className="rounded-2xl border border-primary/20 bg-linear-to-br from-primary/5 to-secondary/5 p-4">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles size={18} className="fill-primary/20" />
                <h2 className="font-semibold text-sm">Upgrade to Pro</h2>
              </div>

              <p className="mt-1.5 text-xs text-base-content/70 leading-normal">
                Unlock advanced insights and AI-powered recommendations.
              </p>

              <button className="btn btn-primary btn-sm mt-3 w-full border-none text-primary-content shadow-xs">
                Upgrade
              </button>
            </div>

            <button
              type="button"
              onClick={handleLogOut}
              className="btn btn-ghost w-full justify-start gap-3 rounded-xl text-error hover:bg-error/10 hover:text-error border-none"
            >
              <LogOut size={20} />
              Log out
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}