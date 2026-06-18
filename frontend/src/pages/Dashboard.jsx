import { UserContext } from "../context/UserContext";
import Sidebar from "../components/Sidebar";
import {
  Apple,
  Bell,
  CheckCircle2,
  Droplets,
  Flame,
  FlameIcon,
  Moon,
  TrendingUp,
} from "lucide-react";
import { useContext } from "react";

const stats = [
  {
    label: "Hydration",
    value: "1.6L",
    detail: "64% completed",
    progress: 64,
    color: "progress-info",
    icon: Droplets,
  },
  {
    label: "Sleep",
    value: "6h 20m",
    detail: "-1h vs avg",
    progress: 72,
    color: "progress-secondary",
    icon: Moon,
  },
  {
    label: "Habits",
    value: "3 / 5",
    detail: "Completed today",
    progress: 60,
    color: "progress-success",
    icon: CheckCircle2,
  },
  {
    label: "Calories",
    value: "1480",
    detail: "kcal left",
    progress: 74,
    color: "progress-warning",
    icon: Flame,
  },
];

const weekDays = ["13", "14", "15", "16", "17", "18", "19"];
const trendDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const getGreeting = () => {
  const hour = new Date().getHours();

  const morningGreetings = [
    "☀️ Good Morning",
    "🌅 Rise and Shine",
    "💪 Ready for a Healthy Day?",
    "✨ Let's Start Strong",
    "🌞 Time to Shine",
  ];

  const afternoonGreetings = [
    "☕ Good Afternoon",
    "🚀 Keep the Momentum Going",
    "💧 Stay Hydrated",
    "🔥 You're Doing Great",
    "⚡ Keep Crushing It",
  ];

  const eveningGreetings = [
    "🌆 Good Evening",
    "✨ Time to Reflect",
    "📈 How Was Your Day?",
    "🌙 Winding Down?",
    "🍃 Take a Moment for Yourself",
  ];

  const nightGreetings = [
    "✨ Working Late?",
    "🌃 Burning the Midnight Oil?",
    "🌙 Late Night Check-In",
    "⭐ Evening Wellness Check",
    "🚀 Let's Finish Strong",
  ];

  const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

  if (hour < 12) return randomItem(morningGreetings);
  if (hour < 17) return randomItem(afternoonGreetings);
  if (hour < 21) return randomItem(eveningGreetings);

  return randomItem(nightGreetings);
};

export default function Dashboard() {
  const { user } = useContext(UserContext);
  return (
    <Sidebar>
      <main className="flex-1 bg-slate-50 p-4 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-violet-600">Today</p>

              <h1 className="mt-1 text-3xl font-bold text-slate-800 lg:text-4xl">
                {getGreeting()}, {user.firstName}👋
              </h1>

              <p className="mt-2 text-slate-500">
                Here's your wellness overview for today.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-3xl px-6 py-4 bg-linear-to-br from-orange-500 via-amber-500 to-yellow-500 text-white shadow-lg">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white">
                Current Streak
              </p>

              <div className="mt-1 flex items-end gap-1">
                <span className="text-3xl font-black">12</span>
                <span className="mb-1 text-xs text-white">days</span>
              </div>

              <div className="mt-3 flex items-center justify-between rounded-xl bg-white/15 px-3 py-1.5 backdrop-blur-sm gap-1">
                <span className="text-xs text-white">Personal Best:</span>

                <span className="font-bold text-white">28 Days</span>
              </div>
            </div>
          </div>

          {/* Hero */}
          <div className="relative mb-6 overflow-hidden rounded-3xl bg-linear-to-r from-violet-600 via-purple-600 to-indigo-600 p-8 text-white shadow-xl">
            <div className="max-w-2xl">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/80">
                <TrendingUp size={18} />
                Daily Insight
              </div>

              <h2 className="text-2xl font-bold lg:text-3xl">
                You slept 1 hour less than your weekly average
              </h2>

              <p className="mt-3 text-white/80">
                Prioritize hydration and stick to your bedtime routine today to
                improve recovery.
              </p>
            </div>

            <img
              src="/lumios_loader.png"
              alt=""
              className="hidden md:block absolute -bottom-11 -right-6 h-44 w-44 object-contain opacity-95"
            />
          </div>

          {/* Stats */}
          <div className="mb-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">
                    {stat.label}
                  </span>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100">
                    <stat.icon size={22} className="text-violet-700" />
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-slate-800">
                  {stat.value}
                </h3>

                <p className="mt-1 text-sm text-slate-500">{stat.detail}</p>

                <progress
                  className={`progress ${stat.color} mt-4 w-full`}
                  value={stat.progress}
                  max="100"
                />
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div className="grid gap-6 xl:grid-cols-2">
            {/* Weekly Progress */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Weekly Progress</h2>

                <div className="rounded-xl bg-green-100 px-3 py-1 font-semibold text-green-700">
                  71%
                </div>
              </div>

              <p className="mb-3 text-slate-500">22 / 31 days completed</p>

              <progress
                className="progress progress-success w-full"
                value="71"
                max="100"
              />

              <div className="mt-8 grid grid-cols-7 gap-2">
                {weekDays.map((day, index) => (
                  <div key={day} className="flex flex-col items-center gap-2">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
                        index < 4
                          ? "bg-green-500 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {index < 4 ? <CheckCircle2 size={18} /> : day}
                    </div>

                    <span className="text-xs text-slate-400">{day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Trends */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold">Health Trends</h2>

                <select className="select border-slate-200 bg-slate-50">
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>Last 6 Month</option>
                </select>
              </div>

              <div className="mb-5 flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1 text-slate-600">
                  <Droplets size={14} className="text-sky-500" />
                  Hydration
                </span>

                <span className="flex items-center gap-1 text-slate-600">
                  <Moon size={14} className="text-violet-500" />
                  Sleep
                </span>

                <span className="flex items-center gap-1 text-slate-600">
                  <Apple size={14} className="text-amber-500" />
                  Calories
                </span>
              </div>

              <div className="flex h-56 items-end gap-2">
                {[45, 70, 55, 90, 65, 60, 80].map((height, index) => (
                  <div
                    key={trendDays[index]}
                    className="flex flex-1 flex-col items-center"
                  >
                    <div
                      className="w-full rounded-t-2xl bg-linear-to-t from-violet-600 to-indigo-400"
                      style={{
                        height: `${height}%`,
                      }}
                    />

                    <span className="mt-2 text-xs text-slate-500">
                      {trendDays[index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </Sidebar>
  );
}
