import Sidebar from "../components/Sidebar";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle,
  Circle,
  Flame,
  Sparkles,
  TrendingUp,
  Activity,
  BookOpen,
  Calendar,
  Ban,
  Moon,
  Coffee,
  Heart,
  Droplet,
  Dumbbell,
} from "lucide-react";

export default function Habits() {
  const [activeTab, setActiveTab] = useState("All Habits");

  // Expanded dataset featuring 10 individual daily habits
  const [habits, setHabits] = useState([
    {
      id: 1,
      name: "Meditation",
      time: "10 min",
      status: "Completed",
      icon: Activity,
      color: "bg-emerald-50 text-emerald-600",
      completed: true,
    },
    {
      id: 2,
      name: "Reading",
      time: "20 min",
      status: "Completed",
      icon: BookOpen,
      color: "bg-emerald-50 text-emerald-600",
      completed: true,
    },
    {
      id: 3,
      name: "Morning Walk",
      time: "30 min",
      status: "Completed",
      icon: Calendar,
      color: "bg-emerald-50 text-emerald-600",
      completed: true,
    },
    {
      id: 4,
      name: "No Sugar",
      time: "All day",
      status: "0%",
      icon: Ban,
      color: "bg-slate-100 text-slate-400",
      completed: false,
    },
    {
      id: 5,
      name: "Early Bedtime",
      time: "Before 11 PM",
      status: "0%",
      icon: Moon,
      color: "bg-slate-100 text-slate-400",
      completed: false,
    },
    {
      id: 6,
      name: "Hydration Target",
      time: "2.5 Liters",
      status: "Completed",
      icon: Droplet,
      color: "bg-emerald-50 text-emerald-600",
      completed: true,
    },
    {
      id: 7,
      name: "Strength Training",
      time: "45 min",
      status: "0%",
      icon: Dumbbell,
      color: "bg-slate-100 text-slate-400",
      completed: false,
    },
    {
      id: 8,
      name: "Journaling",
      time: "5 min",
      status: "0%",
      icon: BookOpen,
      color: "bg-slate-100 text-slate-400",
      completed: false,
    },
    {
      id: 9,
      name: "Limit Caffeine",
      time: "After 2 PM",
      status: "Completed",
      icon: Coffee,
      color: "bg-emerald-50 text-emerald-600",
      completed: true,
    },
    {
      id: 10,
      name: "Stretching",
      time: "10 min",
      status: "0%",
      icon: Heart,
      color: "bg-slate-100 text-slate-400",
      completed: false,
    },
  ]);

  const weeklyTrends = [
    { day: "Mon", h: "80%" },
    { day: "Tue", h: "60%" },
    { day: "Wed", h: "90%" },
    { day: "Thu", h: "100%" },
    { day: "Fri", h: "40%" },
    { day: "Sat", h: "50%" },
    { day: "Sun", h: "70%" },
  ];

  const streakMetrics = [
    { label: "Hydration", value: 7, color: "text-blue-500" },
    { label: "Meditation", value: 3, color: "text-rose-500" },
    { label: "No Sugar", value: 12, color: "text-amber-500" },
  ];

  const toggleHabit = (id) => {
    setHabits(
      habits.map((h) => {
        if (h.id === id) {
          return {
            ...h,
            completed: !h.completed,
            status: !h.completed ? "Completed" : "0%",
            color: !h.completed
              ? "bg-emerald-50 text-emerald-600"
              : "bg-slate-100 text-slate-400",
          };
        }
        return h;
      }),
    );
  };

  const totalHabits = habits.length;
  const totalCompleted = habits.filter((h) => h.completed).length;
  const completionRate = Math.round((totalCompleted / totalHabits) * 100);

  // Dynamic advice engine tailored to handle massive habit loads safely
  const getDynamicTip = () => {
    if (totalHabits >= 8 && completionRate < 60) {
      return "You're balancing a lot of routines! Try 'Habit Stacking'—linking a new task (like Stretching) directly onto an old reliable one (like waiting for your Morning Coffee).";
    }
    if (completionRate >= 80) {
      return "Exceptional execution! Your consistency rating is elite. Keep guarding your streak momentum today.";
    }
    return "Small atomic wins aggregate fast. Focus on clearing just one more low-friction task to bump up your daily stats.";
  };

  return (
    <Sidebar>
      <main className="flex-1 bg-[#f8fafc] p-4 lg:p-6 min-h-screen font-sans">
        <div className="mx-auto max-w-7xl space-y-5">
          {/* Main Structural Dashboard Grid Split */}
          <div className="grid gap-5 lg:grid-cols-12 items-start mt-8">
            {/* Left Content Column (Habits List Management Workspace) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-4">
              {/* Habits Container Title Block */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-lg font-bold text-slate-900">
                    Your Habits
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Managing {totalHabits} habits routines
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <div className="join border border-slate-200 bg-white rounded-xl overflow-hidden h-8">
                    <button className="btn btn-ghost btn-xs join-item px-2 text-slate-400 hover:bg-slate-50">
                      <ChevronLeft size={13} />
                    </button>
                    <button className="btn btn-ghost btn-xs join-item normal-case font-medium text-[11px] px-2.5 text-slate-600 pointer-events-none">
                      Today, 20 May
                    </button>
                    <button className="btn btn-ghost btn-xs join-item px-2 text-slate-400 hover:bg-slate-50">
                      <ChevronRight size={13} />
                    </button>
                  </div>

                  <button className="btn btn-xs border-0 rounded-xl bg-[#6366f1] text-white hover:bg-indigo-700 font-semibold normal-case h-8 px-3 text-xs shadow-xs">
                    <Plus size={13} className="mr-0.5" /> Add Habit
                  </button>
                </div>
              </div>

              {/* Categorization Tabs */}
              <div className="flex items-center gap-1 border-b border-slate-100 pb-1">
                {["All Habits", "Morning", "Afternoon", "Night"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      activeTab === tab
                        ? "bg-indigo-50/70 text-[#6366f1]"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* High-Capacity Scroll Container explicitly keeping 10 habits highly scannable */}
              <div className="space-y-2 max-h-[465px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
                {habits.map((habit) => {
                  const CustomIcon = habit.icon;
                  return (
                    <div
                      key={habit.id}
                      onClick={() => toggleHabit(habit.id)}
                      className="flex items-center justify-between border border-slate-50 bg-white rounded-xl p-3 hover:bg-slate-50/70 cursor-pointer transition-all duration-150"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${habit.color}`}
                        >
                          <CustomIcon size={15} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-800 truncate leading-tight">
                            {habit.name}
                          </h4>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">
                            {habit.time}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-bold ${habit.completed ? "text-emerald-600" : "text-slate-400"}`}
                        >
                          {habit.status}
                        </span>
                        {habit.completed ? (
                          <CheckCircle
                            size={16}
                            className="text-emerald-500 fill-emerald-50 shrink-0"
                          />
                        ) : (
                          <Circle
                            size={16}
                            className="text-slate-200 shrink-0"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Content Column (Analytics Gauges, Performance Matrix & Trends) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Daily Completion Matrix Progress Donut Card */}
              <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-4">
                  <TrendingUp size={14} className="text-slate-400" /> Daily
                  Completion Matrix
                </h2>

                <div className="flex items-center justify-around gap-4 bg-slate-50/50 rounded-2xl p-3 border border-slate-100/50">
                  <div className="relative h-24 w-24 shrink-0">
                    <div
                      className="h-24 w-24 rounded-full transition-all duration-500"
                      style={{
                        background: `conic-gradient(#10b981 0% ${completionRate}%, #e2e8f0 ${completionRate}% 100%)`,
                      }}
                    />
                    <div className="absolute inset-3 flex items-center justify-center rounded-full bg-white shadow-xs">
                      <div className="text-center">
                        <span className="block text-xl font-black text-slate-800 tracking-tight">
                          {totalCompleted}/{totalHabits}
                        </span>
                        <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                          Done
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 text-xs font-bold w-full max-w-45">
                    <div className="border-l-3 border-emerald-500 pl-2">
                      <span className="text-slate-500 font-medium block text-xs">
                        Completion
                      </span>
                      <span className="text-slate-800 font-bold text-sm">
                        {completionRate}% Rate
                      </span>
                    </div>
                    <div className="border-l-3 border-indigo-500 pl-2">
                      <span className="text-slate-500 font-medium block text-xs">
                        Load Level
                      </span>
                      <span className="text-indigo-600 font-bold text-sm">
                        {totalHabits >= 8 ? "High Routine Count" : "Optimal"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekly Trends Component */}
              <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Weekly Performance
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Trend Matrix
                  </span>
                </div>
                <div className="flex h-24 items-end justify-between gap-1.5 border-b border-slate-50 pb-1">
                  {weeklyTrends.map((bar, idx) => (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center justify-end h-full group"
                    >
                      <div
                        className="w-full max-w-[10px] bg-[#6366f1]/90 group-hover:bg-indigo-600 rounded-t transition-all duration-300"
                        style={{ height: bar.h }}
                      />
                      <span className="text-[9px] font-bold text-slate-400 mt-2">
                        {bar.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Streak Footer Section mirroring layout reference */}
              <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="mb-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Habit Streaks
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {streakMetrics.map((streak, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50/60 border border-slate-100/80 rounded-xl p-2.5 text-center shadow-2xs"
                    >
                      <div className="flex items-baseline justify-center gap-0.5">
                        <span className="text-base font-black text-slate-800 tracking-tight">
                          {streak.value}
                        </span>
                        <Flame
                          size={12}
                          className={`${streak.color} fill-current`}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 mt-1 block truncate">
                        {streak.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Strategy Prompt Bubble Box */}
              <div className="rounded-3xl border border-indigo-100/50 bg-gradient-to-br from-indigo-50/60 to-purple-50/40 p-4 shadow-sm flex flex-row items-start gap-2.5">
                <div className="flex-1 text-xs">
                  <span className="font-bold text-indigo-950 flex items-center gap-1.5 mb-1">
                    <Sparkles size={14} className="text-indigo-600" /> AI
                    Companion Insight
                  </span>
                  <p className="text-indigo-900/90 leading-relaxed font-medium text-[11px]">
                    {getDynamicTip()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Sidebar>
  );
}
