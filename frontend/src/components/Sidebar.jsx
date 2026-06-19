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
    <div className="drawer min-h-screen bg-slate-50 text-slate-800 lg:drawer-open">
      <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex min-h-screen flex-col">
        <div className="navbar top-0 z-30 border-b border-slate-200 bg-white/95 px-3 shadow-sm backdrop-blur lg:hidden">
          <label htmlFor="sidebar-drawer" className="btn btn-square btn-ghost">
            <Menu size={22} />
          </label>

          <div className="ml-2 flex items-center gap-2">
            <img src="/icon.png" alt="Lumios logo" className="h-8 w-8" />
            <span className="text-lg font-bold text-violet-700">Lumios</span>
          </div>
        </div>

        {children}
      </div>

      <div className="drawer-side z-40 lg:overflow-hidden">
        <label htmlFor="sidebar-drawer" className="drawer-overlay" />

        <aside className="flex h-dvh w-72 flex-col overflow-hidden border-r border-slate-200 bg-white shadow-lg">
          {/* Logo */}
          <div className="shrink-0 border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <img src="/icon.png" alt="Lumios logo" className="h-10 w-10" />

              <div>
                <h1 className="text-2xl font-bold text-violet-700">Lumios</h1>

                <p className="text-xs text-slate-700">Health dashboard</p>
              </div>
            </div>
          </div>

          {/* Menu */}
          <ul className="menu min-h-0 flex-1 gap-1 overflow-y-auto px-3 py-3">
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.url}
                  onClick={closeDrawer}
                  className={({ isActive }) =>
                    `flex! h-11 items-center gap-3 rounded-xl px-3 py-0 font-medium leading-none transition-all ${
                      isActive
                        ? "bg-violet-600 text-white shadow-md"
                        : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                    }`
                  }
                >
                  <item.icon size={20} className="shrink-0" />
                  <span className="leading-none">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Bottom */}
          <div className="shrink-0 space-y-2 p-3">
            <div className="rounded-2xl border border-violet-100 bg-linear-to-br from-violet-50 to-indigo-50 p-3">
              <div className="flex items-center gap-2 text-violet-700">
                <Sparkles size={18} />
                <h2 className="font-semibold">Upgrade to Pro</h2>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Unlock advanced insights and AI-powered recommendations.
              </p>

              <button className="btn btn-sm mt-3 w-full border-0 bg-violet-600 text-white hover:bg-violet-700">
                Upgrade
              </button>
            </div>

            <button
              type="button"
              onClick={handleLogOut}
              className="btn btn-ghost w-full justify-start gap-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600"
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
