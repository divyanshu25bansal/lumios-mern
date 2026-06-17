import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { BASE_URL } from "../utils/constant";
import { Link } from "react-router-dom";
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
} from "lucide-react";

export default function Sidebar() {
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
    { name: "Hydration", icon: Droplets, url: "/hydration" },
    { name: "Sleep", icon: Moon, url: "/sleep" },
    { name: "Habits", icon: CheckSquare, url: "/habits" },
    { name: "Nutrition", icon: Apple, url: "/nutrition" },
    { name: "AI Companion", icon: Bot, url: "/profile" },
    { name: "Reports", icon: BarChart3, url: "/profile" },
    { name: "Profile", icon: User, url: "/profile" },
    { name: "Log out", icon: LogOut, url: "" },
  ];

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
<aside className="sticky top-0 h-screen w-64 hidden lg:block text-black border-r border-gray-200 shadow-[12px_0_30px_rgba(0,0,0,0.12)]">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <img src="/icon.png" alt="logo" className="w-10" />
          <h1 className="text-2xl font-bold">Lumios</h1>
        </div>
      </div>

      <ul className="menu w-full px-4 gap-2">
        {menuItems.map((item) => (
          <li key={item.name}>
            <Link
              to={item.url}
              onClick={item.name === "Log out" ? handleLogOut : null}
            >
              <item.icon size={25} />
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
      <div className="absolute bottom-0 w-64 p-4 hidden xl:block">
        <div className="card bg-transparen border-3 border-violet-900 rounded-2xl">
          <div className="card-body">
            <h2 className="card-title">Upgrade to Pro</h2>
            <p className="text-sm">
              Unlock advanced insights and recommendations.
            </p>

            <button className="btn btn-primary mt-2">Upgrade</button>
          </div>
        </div>
      </div>
    </aside>
  );
}
