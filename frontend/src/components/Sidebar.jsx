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
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Hydration", icon: Droplets },
    { name: "Sleep", icon: Moon },
    { name: "Habits", icon: CheckSquare },
    { name: "Nutrition", icon: Apple },
    { name: "AI Companion", icon: Bot },
    { name: "Reports", icon: BarChart3 },
    { name: "Profile", icon: User },
    { name: "Log out", icon: LogOut },
  ];

  return (
    <aside className="w-64 hidden md:block min-h-screen bg-base-200">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <img src="/icon.png" alt="logo" className="w-10" />
          <h1 className="text-2xl font-bold">Lumios</h1>
        </div>
      </div>

      <ul className="menu w-full px-4 gap-2">
        {menuItems.map((item) => (
          <li key={item.name}>
            <a>
              <item.icon size={25} />
              {item.name}
            </a>
          </li>
        ))}
      </ul>
      <div className="absolute bottom-0 w-64 p-4">
        <div className="card bg-transparen text-primary-content border-3 border-violet-900 rounded-2xl">
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
