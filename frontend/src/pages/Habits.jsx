import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle,
  Circle,
  Flame,
  Sparkles,
  TrendingUp,
  ChevronUp,
  ChevronDown,
  Clock,
  X,
} from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { PageLoader } from "../components/LoadPage";

export default function Habits() {
  const [activeTab, setActiveTab] = useState("All Habits");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedHabitId, setExpandedHabitId] = useState(null);
  const [habits, setHabits] = useState([]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
  });

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  function getDayKey(tz) {
    const parts = new Intl.DateTimeFormat("en", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());

    const year = parts.find((p) => p.type === "year").value;
    const month = parts.find((p) => p.type === "month").value;
    const day = parts.find((p) => p.type === "day").value;

    return `${year}/${month}/${day}`;
  }

  // Pure function checking completion match safely during renders
  const isHabitCompleted = (habit) => {
    return getDayKey(timezone) === habit.lastCompletedDate;
  };

  const [habitInput, setHabitInput] = useState({
    title: "",
    duration: "",
    habitTime: "",
    lastCompletedDate: null,
  });

  const streakMetrics = [
    { label: "Hydration", value: 7, color: "text-info" },
    { label: "Meditation", value: 3, color: "text-error" },
    { label: "No Sugar", value: 12, color: "text-warning" },
  ];

  const getHabits = async () => {
    try {
      const response = await axios.get(BASE_URL + "/habits", {
        withCredentials: true,
      });
      if (response.data) {
        setHabits(response.data);
      }
    } catch {
      console.error("Could not fetch habit records.");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 400);
    }
  };

  const createHabit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await axios.post(
        BASE_URL + "/habit/create",
        { ...habitInput },
        { withCredentials: true },
      );
      if (response.data) {
        setHabits((prev) => [...prev, response.data]);
      }
    } catch {
      console.error("Could not create habit record.");
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false);
      setHabitInput({
        title: "",
        duration: "",
        habitTime: "",
        lastCompletedDate: null,
      });
    }
  };

  useEffect(() => {
    getHabits();
  }, []);

  /**
   * 🛠️ FIXED: Updates the UI immediately (Optimistic state update)
   * then updates the backend server seamlessly in the background.
   */
  const handleCompleteHabit = async (habit) => {
    const currentTodayStr = getDayKey(timezone);

    // Determine the next target value based on current completion status
    const isCurrentlyDone = habit.lastCompletedDate === currentTodayStr;
    const nextCompletedDateValue = isCurrentlyDone ? null : currentTodayStr;

    // 1. Instantly update UI layout state
    setHabits((prevHabits) =>
      prevHabits.map((h) =>
        h._id === habit._id
          ? { ...h, lastCompletedDate: nextCompletedDateValue }
          : h,
      ),
    );

    // 2. Dispatch to your backend API route matching your controllers
    try {
      await axios.patch(
        `${BASE_URL}/habit/${habit._id}`,
        {
          job: "complete",
          habit,
        },
        { withCredentials: true },
      );
    } catch (err) {
      console.error(
        "Failed to sync progress to database, rolling back UI.",
        err,
      );
      // Fallback rollback option if connection completely cuts out:
      setHabits((prevHabits) =>
        prevHabits.map((h) =>
          h._id === habit._id
            ? { ...h, lastCompletedDate: habit.lastCompletedDate }
            : h,
        ),
      );
    }
  };

  // Compute stats metrics calculations inline directly from current database array strings
  const totalHabits = habits.length;
  const totalCompleted = habits.filter(isHabitCompleted).length;
  const completionRate =
    totalHabits > 0 ? Math.round((totalCompleted / totalHabits) * 100) : 0;

  return (
    <Sidebar>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn">
          <div
            className="bg-base-100 border border-base-300 w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-xl relative"
            role="dialog"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-base-content/70 hover:text-base-content"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold flex items-center gap-2">
              <Clock className="text-primary" size={18} /> Add New Habit Record
            </h3>

            <form onSubmit={createHabit} className="space-y-4 mt-4">
              <div className="form-control flex flex-col gap-3">
                <div>
                  <label className="label font-semibold text-xs pb-1.5 opacity-80">
                    Habit Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Morning walk"
                    value={habitInput.title}
                    onChange={(e) =>
                      setHabitInput((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="input input-bordered w-full rounded-xl focus:outline-none focus:border-primary text-base"
                  />
                </div>
                <div>
                  <label className="label font-semibold text-xs pb-1.5 opacity-80">
                    Duration
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 30 minutes"
                    value={habitInput.duration}
                    onChange={(e) =>
                      setHabitInput((prev) => ({
                        ...prev,
                        duration: e.target.value,
                      }))
                    }
                    className="input input-bordered w-full rounded-xl focus:outline-none focus:border-primary text-base"
                  />
                </div>
                <div>
                  <label className="label font-semibold text-xs pb-1.5 opacity-80">
                    Habit Time
                  </label>
                  <select
                    required
                    className="select select-bordered w-full rounded-xl focus:outline-none focus:border-primary text-base"
                    value={habitInput.habitTime}
                    onChange={(e) =>
                      setHabitInput((prev) => ({
                        ...prev,
                        habitTime: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select Time</option>
                    <option value="morning">In Morning</option>
                    <option value="afternoon">In Afternoon</option>
                    <option value="night">In Night</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2 max-sm:flex-col-reverse">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-ghost rounded-xl flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary rounded-xl flex-1 gap-2 shadow-md"
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          {" "}
          <PageLoader />
        </div>
      ) : (
        <main className="flex-1 bg-base-200 text-base-content p-4 lg:p-6 min-h-screen font-sans transition-colors duration-200">
          <div className="mx-auto max-w-7xl space-y-5">
            <div className="grid gap-5 lg:grid-cols-12 items-start mt-8">
              {/* Left Column Layout Container */}
              <div className="lg:col-span-7 bg-base-100 rounded-3xl border border-base-300 shadow-xs p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h1 className="text-lg font-bold text-base-content">
                      Your Habits
                    </h1>
                    <p className="text-xs opacity-60 mt-0.5">
                      Managing {totalHabits} habit routines
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <div className="join border border-base-300 bg-base-100 rounded-xl overflow-hidden h-8">
                      <button className="btn btn-ghost btn-xs join-item px-2 opacity-50 hover:bg-base-200">
                        <ChevronLeft size={13} />
                      </button>
                      <button className="btn btn-ghost btn-xs join-item normal-case font-medium text-[11px] px-2.5 pointer-events-none">
                        Today, {today}
                      </button>
                      <button className="btn btn-ghost btn-xs join-item px-2 opacity-50 hover:bg-base-200">
                        <ChevronRight size={13} />
                      </button>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="btn btn-xs border-0 rounded-xl bg-primary text-primary-content hover:bg-primary-focus font-semibold h-8 px-3 text-xs"
                    >
                      <Plus size={13} className="mr-0.5" /> Add Habit
                    </button>
                  </div>
                </div>

                {/* Filtering Tab Group Row */}
                <div className="flex items-center gap-1 border-b border-base-300 pb-1">
                  {["All Habits", "Morning", "Afternoon", "Night"].map(
                    (tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                          activeTab === tab
                            ? "bg-primary/10 text-primary"
                            : "opacity-50 hover:opacity-100"
                        }`}
                      >
                        {tab}
                      </button>
                    ),
                  )}
                </div>

                {/* Dynamic Scrollable Track Listing Cards Wrapper */}
                <div className="space-y-2 max-h-116.25 overflow-y-auto pr-1 scrollbar-thin">
                  {habits
                    .filter(
                      (h) =>
                        activeTab === "All Habits" ||
                        h.habitTime?.toLowerCase() === activeTab.toLowerCase(),
                    )
                    .map((habit) => {
                      const isCompleted = isHabitCompleted(habit);
                      const isExpanded = expandedHabitId === habit._id;

                      return (
                        <div
                          key={habit._id}
                          className="flex flex-col border border-base-200 bg-base-100 rounded-xl overflow-hidden transition-all duration-150"
                        >
                          <div className="flex items-center justify-between p-3 hover:bg-base-200/50">
                            {/* Clicking the text/details content marks it complete */}
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isCompleted ? "bg-success/10 text-success" : "bg-base-200 text-base-content/40"}`}
                              >
                                <Sparkles size={15} />
                              </div>
                              <div className="min-w-0">
                                <h4
                                  className={`text-sm font-bold truncate leading-tight ${isCompleted ? "line-through opacity-50" : "text-base-content"}`}
                                >
                                  {habit.title}
                                </h4>
                                <p className="text-xs opacity-50 font-medium mt-0.5">
                                  {habit.duration}
                                </p>
                              </div>
                            </div>

                            {/* Control Actions Side Elements */}
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => handleCompleteHabit(habit)}
                                className={`flex items-center gap-2 btn cursor-pointer btn-ghost btn-xs h-8 px-2 rounded-lg ${isCompleted && "pointer-events-none"}`}
                              >
                                <span
                                  className={`text-sm font-bold ${isCompleted ? "text-success" : "opacity-40"}`}
                                >
                                  {isCompleted ? "Completed" : "0%"}
                                </span>
                                {isCompleted ? (
                                  <CheckCircle
                                    size={16}
                                    className="text-success fill-success/10 shrink-0"
                                  />
                                ) : (
                                  <Circle
                                    size={16}
                                    className="border-base-content opacity-20 shrink-0"
                                  />
                                )}
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedHabitId(
                                    isExpanded ? null : habit._id,
                                  );
                                }}
                                className="btn btn-ghost btn-xs h-8 w-8 p-0 rounded-lg opacity-60 hover:opacity-100"
                              >
                                {isExpanded ? (
                                  <ChevronUp size={16} />
                                ) : (
                                  <ChevronDown size={16} />
                                )}
                              </button>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="bg-base-200/40 border-t border-base-200 p-4 transition-all duration-300 animate-slideDown">
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                                <div className="bg-base-100 p-3 rounded-xl border border-base-300/40 shadow-2xs">
                                  <span className="text-[11px] font-bold opacity-50 block uppercase tracking-wider mb-1">
                                    Current Streak
                                  </span>
                                  <p className="text-xs font-bold text-base-content">
                                    {habit.currentStreak}
                                  </p>
                                </div>
                                <div className="bg-base-100 p-3 rounded-xl border border-base-300/40 shadow-2xs">
                                  <span className="text-[11px] font-bold opacity-50 block uppercase tracking-wider mb-1">
                                    Max Streak
                                  </span>
                                  <p className="text-xs font-bold text-primary">
                                    {habit.maxStreak}
                                  </p>
                                </div>
                                <div className="bg-base-100 p-3 rounded-xl border border-base-300/40 shadow-2xs">
                                  <span className="text-[11px] font-bold opacity-50 block uppercase tracking-wider mb-1">
                                    Last Complete Date
                                  </span>
                                  <p className="text-xs font-bold text-secondary">
                                    {habit.lastCompletedDate}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Right Analytics Section Column */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-xs">
                  <h2 className="text-xs font-bold text-base-content opacity-80 uppercase tracking-wider flex items-center gap-1.5 mb-4">
                    <TrendingUp size={14} className="opacity-50" /> Daily
                    Completion Matrix
                  </h2>

                  <div className="flex items-center justify-around gap-4 bg-base-200/40 rounded-2xl p-3 border border-base-300/30">
                    <div className="relative h-24 w-24 shrink-0">
                      <div
                        className="h-24 w-24 rounded-full transition-all duration-500"
                        style={{
                          background: `conic-gradient(var(--fallback-su,hsl(var(--su))) 0% ${completionRate}%, var(--fallback-b3,hsl(var(--b3))) ${completionRate}% 100%)`,
                        }}
                      />
                      <div className="absolute inset-3 flex items-center justify-center rounded-full bg-base-100 shadow-xs">
                        <div className="text-center">
                          <span className="block text-xl font-black text-base-content tracking-tight">
                            {totalCompleted}/{totalHabits}
                          </span>
                          <span className="text-xs uppercase tracking-wider opacity-40 font-bold">
                            Done
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 text-xs font-bold w-full max-w-45">
                      <div className="border-l-3 border-success pl-2">
                        <span className="opacity-60 font-medium block text-xs">
                          With Progress
                        </span>
                        <span className="text-base-content font-bold text-sm">
                          {completionRate}% Rate
                        </span>
                      </div>
                      <div className="border-l-3 border-primary pl-2">
                        <span className="opacity-60 font-medium block text-xs">
                          Load Level
                        </span>
                        <span className="text-primary font-bold text-sm">
                          {totalHabits >= 8
                            ? "High Routine Count"
                            : "Optimal Workspace"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Streaks Container metrics */}
                <div className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-xs">
                  <div className="mb-3">
                    <h3 className="text-xs font-bold text-base-content opacity-80 uppercase tracking-wider">
                      Habit Streaks
                    </h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {streakMetrics.map((streak, idx) => (
                      <div
                        key={idx}
                        className="bg-base-200/50 border border-base-300/60 rounded-xl p-2.5 text-center shadow-2xs"
                      >
                        <div className="flex items-baseline justify-center gap-0.5">
                          <span className="text-base font-black text-base-content tracking-tight">
                            {streak.value}
                          </span>
                          <Flame
                            size={12}
                            className={`${streak.color} fill-current`}
                          />
                        </div>
                        <span className="text-[10px] font-bold opacity-40 mt-1 block truncate">
                          {streak.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </Sidebar>
  );
}
