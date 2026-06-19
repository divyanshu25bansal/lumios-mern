import { UserContext } from "../context/UserContext";
import Sidebar from "../components/Sidebar";
import {
  Apple,
  Bell,
  CheckCircle2,
  Droplets,
  Flame,
  ChevronLeft,
  ChevronRight,
  Moon,
  TrendingUp,
} from "lucide-react";
import { useContext, useState, useEffect } from "react";

const statsConfig = [
  {
    label: "Hydration",
    value: "1.6L",
    detail: "64% completed",
    progress: 64,
    color: "progress-info",
    bgColor: "bg-sky-50 text-sky-600",
    icon: Droplets,
  },
  {
    label: "Sleep",
    value: "6h 20m",
    detail: "-1h vs avg",
    progress: 72,
    color: "progress-secondary",
    bgColor: "bg-purple-50 text-purple-600",
    icon: Moon,
  },
  {
    label: "Habits",
    value: "3 / 5",
    detail: "Completed today",
    progress: 60,
    color: "progress-success",
    bgColor: "bg-emerald-50 text-emerald-600",
    icon: CheckCircle2,
  },
  {
    label: "Calories",
    value: "1,480",
    detail: "kcal left",
    progress: 74,
    color: "progress-warning",
    bgColor: "bg-orange-50 text-orange-600",
    icon: Flame,
  },
];

const initialWeekDays = [
  { day: "13", completed: true },
  { day: "14", completed: true },
  { day: "15", completed: true },
  { day: "16", completed: true },
  { day: "17", completed: false, isToday: true },
  { day: "18", completed: false },
  { day: "19", completed: false },
];

const trendData = [
  { label: "Mon", hydration: 40, sleep: 60, calories: 50 },
  { label: "Tue", hydration: 65, sleep: 75, calories: 70 },
  { label: "Wed", hydration: 50, sleep: 55, calories: 60 },
  { label: "Thu", hydration: 85, sleep: 90, calories: 80 },
  { label: "Fri", hydration: 60, sleep: 65, calories: 55 },
  { label: "Sat", hydration: 55, sleep: 45, calories: 65 },
  { label: "Sun", hydration: 75, sleep: 80, calories: 70 },
];

const getGreetingText = () => {
  const hour = new Date().getHours();
  const morning = ["☀️ Good Morning", "🌅 Rise and Shine", "💪 Ready for a Healthy Day?"];
  const afternoon = ["☕ Good Afternoon", "🚀 Keep the Momentum Going", "🔥 You're Doing Great"];
  const evening = ["🌆 Good Evening", "✨ Time to Reflect", "🍃 Take a Moment for Yourself"];
  const night = ["✨ Working Late?", "🌙 Late Night Check-In", "⭐ Evening Wellness Check"];

  const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
  if (hour < 12) return randomItem(morning);
  if (hour < 17) return randomItem(afternoon);
  if (hour < 21) return randomItem(evening);
  return randomItem(night);
};

export default function Dashboard() {
  const { user } = useContext(UserContext);
  const [greeting, setGreeting] = useState("✨ Welcome");

  useEffect(() => {
    setGreeting(getGreetingText());
  }, []);

  return (
    <Sidebar>
      <main className="flex-1 bg-slate-50 p-4 lg:p-8 min-h-screen">
        <div className="mx-auto max-w-7xl space-y-6">
          
          {/* Header Row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Overview</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900 lg:text-3xl tracking-tight">
                {greeting}, {user?.firstName || "User"} 👋
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Here's your wellness summary for today.
              </p>
            </div>

            {/* Streak Widget */}
            <div className="relative overflow-hidden rounded-2xl px-5 py-3.5 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 text-white shadow-md sm:w-64">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/90">
                Current Streak
              </p>
              <div className="mt-0.5 flex items-end gap-1">
                <span className="text-3xl font-black leading-none">12</span>
                <span className="mb-0.5 text-xs font-medium text-orange-100">days</span>
              </div>
              <div className="mt-2.5 flex items-center justify-between rounded-lg bg-white/10 px-2.5 py-1 text-[11px] backdrop-blur-sm">
                <span className="text-white/80">Personal Best:</span>
                <span className="font-bold">28 Days</span>
              </div>
            </div>
          </div>

          {/* Hero Insights Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 lg:p-8 text-white shadow-xl">
            <div className="max-w-xl relative z-10">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/80">
                <TrendingUp size={14} />
                Daily Insight
              </div>
              <h2 className="text-xl font-bold lg:text-2xl leading-snug">
                You slept 1 hour less than your weekly average
              </h2>
              <p className="mt-2 text-sm text-white/80 leading-relaxed">
                Prioritize hydration and stick to your bedtime routine today to improve optimal muscle recovery.
              </p>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-1/3 hidden md:flex items-center justify-center opacity-15 pointer-events-none">
              <Moon size={140} className="text-white stroke-[1]" />
            </div>
          </div>

          {/* Core Stats Grid Grid */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statsConfig.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {stat.label}
                    </span>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bgColor}`}>
                      <IconComponent size={20} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                    {stat.value}
                  </h3>
                  <p className="mt-0.5 text-xs font-medium text-slate-400">{stat.detail}</p>
                  <progress
                    className={`progress ${stat.color} mt-4 w-full h-2`}
                    value={stat.progress}
                    max="100"
                  />
                </div>
              );
            })}
          </div>

          {/* Bottom Analytical Panels Split */}
          <div className="grid gap-6 xl:grid-cols-2">
            
            {/* Weekly Progress Tracking Card */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-800">Weekly Progress</h2>
                  <div className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">
                    71%
                  </div>
                </div>
                <p className="text-sm text-slate-500 mb-3">22 / 31 days completed</p>
                <progress
                  className="progress progress-success w-full h-2"
                  value="71"
                  max="100"
                />
              </div>

              {/* Day Circle Checkmarks Row */}
              <div className="mt-6 grid grid-cols-7 gap-2">
                {initialWeekDays.map((item) => (
                  <div key={item.day} className="flex flex-col items-center gap-1.5">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                        item.completed
                          ? "bg-emerald-500 text-white"
                          : item.isToday
                          ? "border-2 border-indigo-500 text-indigo-600 bg-indigo-50"
                          : "bg-slate-50 text-slate-400"
                      }`}
                    >
                      {item.completed ? <CheckCircle2 size={16} /> : item.day}
                    </div>
                    <span className="text-[10px] font-medium text-slate-400">Day {item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Trends Visual Card */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-base font-bold text-slate-800">Health Trends</h2>
                <select className="select select-sm border-slate-200 bg-slate-50 font-medium text-xs rounded-xl focus:outline-none">
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>Last 6 Months</option>
                </select>
              </div>

              {/* Multi-category Custom Inline Legends */}
              <div className="mb-6 flex flex-wrap gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1 text-slate-500">
                  <span className="w-2.5 h-2.5 bg-sky-400 rounded-full inline-block" /> Hydration
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full inline-block" /> Sleep
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  <span className="w-2.5 h-2.5 bg-amber-400 rounded-full inline-block" /> Calories
                </span>
              </div>

              {/* Bar Metric Stack Layout */}
              <div className="flex h-48 items-end gap-3 px-2 pt-4 border-b border-slate-100">
                {trendData.map((data) => (
                  <div key={data.label} className="flex flex-1 flex-col items-center h-full justify-end group relative">
                    
                    {/* Visual Composite Bar Container */}
                    <div className="w-full max-w-[20px] flex flex-col justify-end h-full rounded-t-md overflow-hidden bg-slate-50">
                      <div 
                        className="w-full bg-gradient-to-t from-indigo-600 to-sky-400 rounded-t-sm transition-all duration-500" 
                        style={{ height: `${data.sleep}%` }} 
                      />
                    </div>

                    <span className="mt-2 text-[11px] font-bold text-slate-400">
                      {data.label}
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