import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import {
  Moon,
  ChevronDown,
  Sparkles,
  Clock,
  Calendar,
  Smile,
  Frown,
  Plus,
  X,
  CheckCircle2,
} from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { PageLoader } from "../components/LoadPage";

export default function SleepBoard() {
  const [sleep, setSleep] = useState(null);
  const [sleepHistory, setSleepHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputDuration, setInputDuration] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sleep Quality evaluation logic
  const getSleepQuality = (hours) => {
    if (hours === undefined || hours === null || hours === 0) {
      return {
        rating: "No Data",
        text: "Log your rest to see quality insights.",
        color: "text-neutral bg-neutral/10",
        icon: Clock,
      };
    }
    if (hours >= 8)
      return {
        rating: "Excellent Rest",
        text: "Optimal cellular recovery achieved.",
        color: "text-success bg-success/10",
        icon: Smile,
      };
    if (hours >= 6)
      return {
        rating: "Moderate Rest",
        text: "Fair recovery, but aiming for 8 hours is ideal.",
        color: "text-info bg-info/10",
        icon: Smile,
      };
    return {
      rating: "Sleep Deprived",
      text: "Deficit detected. Prioritize early bedtime tonight.",
      color: "text-error bg-error/10",
      icon: Frown,
    };
  };

  // Safe dynamic selection for the most recent log item
  const currentQuality = getSleepQuality(sleep?.duration || 0);

  // Calculate true current historical average
  const averageSleep = (
    sleep?.duration > 0 && sleepHistory && sleepHistory.length > 0
      ? sleepHistory.reduce(
          (sum, entry) => sum + Number(entry.duration || 0),
          0,
        ) / sleepHistory.length
      : 0
  ).toFixed(1);

  // Fetch or initialize today's profile record
  const getOrCreateSleep = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/sleep`, {
        withCredentials: true,
      });

      if (response.data) {
        setSleep({
          duration: response.data.duration,
          date: new Date(response.data.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          }),
          sleepLogged: response.data.sleepLogged,
        });
        setInputDuration(response.data.duration || "");
        return;
      }

      const createResponse = await axios.post(
        `${BASE_URL}/sleep/create`,
        { duration: 0 },
        { withCredentials: true },
      );

      setSleep({
        duration: createResponse.data.duration,
        date: new Date(createResponse.data.date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        }),
        sleepLogged: createResponse.data.sleepLogged,
      });
      setInputDuration("");
    } catch (err) {
      console.error("Could not fetch or create daily sleep profile record.");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 400);
    }
  };

  const callSleepHistory = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/sleep/last-7-days`, {
        withCredentials: true,
      });
      setSleepHistory(response.data || []);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getOrCreateSleep();
  }, []);

  useEffect(() => {
    callSleepHistory();
  }, [sleep]);

  // Handle logging form submission
  const handleSleepSubmit = async (e) => {
    e.preventDefault();
    if (
      !inputDuration ||
      isNaN(inputDuration) ||
      inputDuration < 0 ||
      inputDuration > 24
    )
      return;

    setIsSubmitting(true);
    try {
      await axios.patch(
        `${BASE_URL}/sleep/edit`,
        { duration: Number(inputDuration), sleepLogged: true },
        { withCredentials: true },
      );

      // Refresh local states
      await getOrCreateSleep();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to update tracking log:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sidebar>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          {" "}
          <PageLoader />
        </div>
      ) : (
        <main className="flex-1 bg-base-200 text-base-content p-4 lg:p-6 min-h-screen font-sans antialiased relative">
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Header Action Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-base-300 pb-5">
              <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                  <Moon className="text-primary" size={24} /> Sleep Architecture
                </h1>
                <p className="text-sm opacity-60 mt-0.5">
                  Analyze sleep intervals, depth qualities, and circadian
                  consistency.
                </p>
              </div>

              <button
                disabled={sleep?.sleepLogged}
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary rounded-xl font-semibold shadow-md shadow-primary/10 normal-case gap-2 self-start sm:self-auto"
              >
                <Plus size={16} /> Log Rest Duration
              </button>
            </div>

            {/* Metric Overview Summary Grid */}
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Metric Card 1 */}
              <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold opacity-50 block uppercase tracking-wider">
                    Recent Sleep Interval
                  </span>
                  <h3 className="text-2xl font-bold text-base-content tracking-tight mt-1">
                    {sleep?.duration !== undefined
                      ? `${sleep?.duration} hrs`
                      : "No Record"}
                  </h3>
                </div>
                <p className="text-xs opacity-60 mt-3 font-medium flex items-center gap-1">
                  <Clock size={12} /> Target Window: 11 PM - 7 AM
                </p>
              </div>

              {/* Metric Card 2 */}
              <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-xs flex flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold opacity-50 block uppercase tracking-wider">
                      Sleep Quality Status
                    </span>
                    <h3 className="text-xl font-bold text-base-content tracking-tight mt-1">
                      {currentQuality?.rating}
                    </h3>
                  </div>
                  <div
                    className={`p-2 rounded-xl shrink-0 ${currentQuality?.color}`}
                  >
                    <currentQuality.icon size={18} />
                  </div>
                </div>
                <p className="text-xs opacity-60 mt-3 font-medium">
                  {currentQuality?.text}
                </p>
              </div>

              {/* Metric Card 3 */}
              <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold opacity-50 block uppercase tracking-wider">
                    Rolling Weekly Average
                  </span>
                  <h3 className="text-2xl font-bold text-base-content tracking-tight mt-1">
                    {averageSleep} hrs / day
                  </h3>
                </div>
                <div className="w-full bg-base-300 h-2 rounded-full overflow-hidden mt-4">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((Number(averageSleep) / 8) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Graphical Analytics Workspace */}
            <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h3 className="text-sm font-bold text-base-content uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar size={14} className="text-primary" />{" "}
                    Chronological Sleep Trend
                  </h3>
                  <p className="text-xs opacity-60 mt-0.5">
                    Visualizing cyclical target path progress vs ideal benchmark
                    standards.
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-info/30 border border-info block" />
                    <span className="opacity-70">Goal Completion Rate</span>
                  </div>
                </div>
              </div>

              {/* Twin Panel Grid Layout */}
              <div className="grid gap-6 md:grid-cols-12">
                <div className="md:col-span-8 rounded-xl border border-base-200 bg-base-100/50 p-4">
                  <div className="h-64">
                    {sleepHistory.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-xs opacity-50">
                        Insufficient historic data logs available.
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={sleepHistory.map((day) => ({
                            date: new Date(day.date).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                              },
                            ),
                            progress: Math.min(
                              Math.round(((day.duration || 0) / 8) * 100),
                              100,
                            ),
                          }))}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id="sleepAreaGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="currentColor"
                                className="text-info"
                                stopOpacity={0.4}
                              />
                              <stop
                                offset="95%"
                                stopColor="currentColor"
                                className="text-info"
                                stopOpacity={0.05}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="var(--fallback-b3,hsl(var(--b3)))"
                            opacity={0.5}
                          />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12, fill: "currentColor" }}
                            tickLine={false}
                            axisLine={false}
                            className="opacity-70"
                          />
                          <YAxis
                            domain={[0, 100]}
                            tickFormatter={(val) => `${val}%`}
                            tick={{ fontSize: 12, fill: "currentColor" }}
                            tickLine={false}
                            axisLine={false}
                            className="opacity-70"
                          />
                          <Tooltip
                            formatter={(value) => [`${value}%`, "Target Met"]}
                            contentStyle={{
                              borderRadius: "12px",
                              backgroundColor: "hsl(var(--b1))",
                              color: "hsl(var(--bc))",
                              border: "1px solid dishonesty hsl(var(--b3))",
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="progress"
                            stroke="hsl(var(--in))"
                            strokeWidth={2.5}
                            fill="url(#sleepAreaGradient)"
                            activeDot={{ r: 5 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* Context Dynamic Target Advice Widget */}
                <div className="md:col-span-4 rounded-xl bg-linear-to-br from-base-200 to-base-300 p-6 border border-base-300 flex flex-col justify-between relative overflow-hidden min-h-64">
                  <div className="space-y-2 relative z-10">
                    <span className="text-[10px] font-bold uppercase text-primary tracking-widest flex items-center gap-1">
                      <Sparkles size={10} /> Circadian Target
                    </span>
                    <h4 className="text-xl font-extrabold text-base-content tracking-tight">
                      8 Continuous Hours
                    </h4>
                    <p className="text-xs text-base-content/70 leading-relaxed max-w-[85%]">
                      Consistency stabilizes REM deep cycles. Try limiting
                      blue-light exposure 1 hour before scheduled bedtime loops.
                    </p>
                  </div>
                  <div className="absolute -right-2 -bottom-4 text-8xl select-none opacity-60">
                    💤
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Responsive Drawer Backdrop Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn">
              <div
                className="bg-base-100 border border-base-300 w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-xl relative transform transition-transform duration-300 translate-y-0 max-sm:animate-slideUp"
                role="dialog"
              >
                {/* Close Button */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-base-content/70 hover:text-base-content"
                >
                  <X size={18} />
                </button>

                <div className="mb-5">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Clock className="text-primary" size={18} /> Daily Sleep
                    Entry
                  </h3>
                  <p className="text-xs opacity-60 mt-0.5">
                    Update your sleep duration record for yesterday's resting
                    period.
                  </p>
                </div>

                <form onSubmit={handleSleepSubmit} className="space-y-4">
                  <div className="form-control">
                    <label className="label font-semibold text-xs pb-1.5 opacity-80">
                      Duration Rested (Hours)
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="24"
                        autoFocus
                        required
                        placeholder="e.g. 7.5"
                        value={inputDuration}
                        onChange={(e) => setInputDuration(e.target.value)}
                        className="input input-bordered w-full rounded-xl pr-14 focus:outline-none focus:border-primary text-base"
                      />
                      <span className="absolute right-4 text-xs font-bold opacity-40 select-none">
                        HOURS
                      </span>
                    </div>
                    <label className="label pt-1.5">
                      <span className="label-text-alt opacity-50">
                        Accepts fractional numbers (e.g., 6.5, 8.2)
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-3 pt-2 max-sm:flex-col-reverse">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="btn btn-ghost rounded-xl flex-1 max-sm:btn-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !inputDuration}
                      className="btn btn-primary rounded-xl flex-1 gap-2 shadow-md shadow-primary/10 max-sm:btn-md"
                    >
                      {isSubmitting ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <>
                          <CheckCircle2 size={16} /> Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      )}
    </Sidebar>
  );
}
