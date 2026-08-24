import { UserContext } from "../context/UserContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import Sidebar from "../components/Sidebar";
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

export default function Hydration() {
  const { user } = useContext(UserContext);
  const [hydration, setHydration] = useState(null);
  const [last7DaysData, setLas7DaysData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;

    const getHydrationInfo = async () => {
      try {
        const response = await axios.get(BASE_URL + "/hydration", {
          withCredentials: true,
        });

        if (response.data) {
          setHydration(response.data);
          return;
        }

        const createResponse = await axios.post(
          BASE_URL + "/hydration/create",
          {
            target: 2500,
            consumed: 0,
          },
          {
            withCredentials: true,
          },
        );

        setHydration(createResponse.data);
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 400);
      }
    };

    getHydrationInfo();
  }, [user]);

  useEffect(() => {
    const last7Days = async () => {
      const response = await axios.get(BASE_URL + "/hydration/last-7-days", {
        withCredentials: true,
      });

      const chartData = response.data.reverse().map((day) => ({
        date: new Date(day.date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        }),
        consumed: day.consumed,
        target: day.target,
      }));
      setLas7DaysData(chartData);
    };
    last7Days();
  }, [hydration]);

  const addWaterIntake = async (amt) => {
    try {
      const amount =
        hydration.target < hydration.consumed + amt
          ? hydration.target - hydration.consumed
          : amt;
      const response = await axios.patch(
        BASE_URL + "/hydration/edit",
        { amount },
        {
          withCredentials: true,
        },
      );
      setHydration((prev) => ({ ...prev, consumed: prev.consumed + amount }));
    } catch (err) {
      console.error(err);
    }
  };

  // Safe Fallback Calculator for Dynamic Ring Values
  const percentageCompleted = hydration?.target
    ? Math.min(Math.round((hydration.consumed / hydration.target) * 100), 100)
    : 0;

  return (
    <Sidebar>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          {" "}
          <PageLoader />
        </div>
      ) : (
        <main className="flex-1 bg-base-200 text-base-content p-6 min-h-screen transition-colors duration-200">
          <div className="mx-auto max-w-6xl space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center pt-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-base-content">
                  Hydration
                </h1>
                <p className="text-sm opacity-70">
                  Track your daily water intake.
                </p>
              </div>
              <div className="text-xs font-semibold opacity-70 bg-base-100 px-3 py-1.5 rounded-xl border border-base-300">
                Today,{" "}
                {new Date(`${hydration.dayKey}`).toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                })}
              </div>
            </div>

            {/* Top Panel Grid */}
            <div className="grid gap-6 md:grid-cols-12">
              {/* Radial Progress Ring Box */}
              <div className="md:col-span-5 rounded-2xl border border-base-300 bg-base-100 p-6 flex flex-col items-center justify-center min-h-65 shadow-xs">
                <div
                  className="radial-progress text-info"
                  style={{
                    "--value": 64,
                    "--size": "10.5rem",
                    "--thickness": "10px",
                  }}
                  role="progressbar"
                >
                  <div className="text-center">
                    <p className="text-3xl font-black text-base-content">
                      {hydration?.consumed / 1000 || 0} L
                    </p>
                    <p className="text-[10px] font-bold opacity-50 tracking-wider uppercase mt-0.5">
                      of {hydration?.target ? hydration.target / 1000 : 0}L{" "}
                      {percentageCompleted}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottle Card & Increments */}
              <div className="md:col-span-7 rounded-2xl border border-base-300 bg-base-100 p-6 flex flex-col justify-between min-h-65 shadow-xs">
                <div className="flex justify-between items-center px-4">
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-info tracking-wider">
                        Water Intake
                      </span>
                      <h2 className="text-3xl font-black text-base-content">
                        {hydration?.consumed ? hydration.consumed / 1000 : 0} L{" "}
                        <span className="text-xs font-medium opacity-50">
                          Drunk
                        </span>
                      </h2>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold opacity-80">
                        {hydration?.target
                          ? Math.max(
                              (hydration.target - hydration.consumed) / 1000,
                              0,
                            )
                          : 0}{" "}
                        L{" "}
                        <span className="text-xs font-medium opacity-50">
                          Left
                        </span>
                      </h3>
                    </div>
                  </div>

                  {/* Theme-Adaptive Styled Interactive Bottle Indicator */}
                  <div className="w-16 h-32 border-4 border-base-content rounded-xl relative overflow-hidden bg-base-200 flex flex-col justify-end">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-2 bg-base-content rounded-b-sm" />
                    <div
                      className="w-full bg-linear-to-t from-info to-sky-400 opacity-90 transition-all duration-300"
                      style={{
                        height: `${percentageCompleted}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Quick Add Actions */}
                <div className="grid grid-cols-4 gap-2 mt-4 text-xs font-bold">
                  {[
                    { label: "+50ml", value: 50 },
                    { label: "+100ml", value: 100 },
                    { label: "+250ml", value: 250 },
                    { label: "+500ml", value: 500 },
                  ].map((amt, idx) => (
                    <button
                      key={idx}
                      onClick={() => addWaterIntake(amt.value)}
                      disabled={hydration?.consumed >= hydration?.target}
                      className={`btn btn-sm btn-outline border-base-300 bg-base-100 normal-case rounded-xl hover:bg-info/10 hover:text-info hover:border-info transition-all font-bold ${
                        hydration?.consumed >= hydration?.target
                          ? "btn-disabled opacity-30"
                          : ""
                      }`}
                    >
                      {amt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Panel Grid */}
            <div className="grid gap-6 md:grid-cols-12">
              {/* Trend Graph Data Card */}
              <div className="md:col-span-8 rounded-2xl border border-base-300 bg-base-100 p-6 shadow-xs">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold text-base-content opacity-90">
                    Hydration Trend
                  </h3>
                  <span className="text-xs opacity-50">Last 7 Days</span>
                </div>

                <div className="h-50">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={last7DaysData?.map((day) => ({
                        date: day.date,
                        progress: Math.round(
                          ((day.consumed || 0) / day.target) * 100,
                        ),
                      }))}
                    >
                      <defs>
                        <linearGradient
                          id="hydrationGradient"
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
                        className="text-base-content opacity-60"
                        tickLine={false}
                        axisLine={false}
                      />

                      <YAxis
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                        tick={{ fontSize: 12, fill: "currentColor" }}
                        className="text-base-content opacity-60"
                        tickLine={false}
                        axisLine={false}
                      />

                      <Tooltip
                        formatter={(value) => [`${value}%`, "Goal Completion"]}
                        contentStyle={{
                          borderRadius: "12px",
                          backgroundColor: "var(--fallback-b1,hsl(var(--b1)))",
                          color: "var(--fallback-bc,hsl(var(--bc)))",
                          border: "1px solid var(--fallback-b3,hsl(var(--b3)))",
                        }}
                      />

                      <Area
                        type="monotone"
                        dataKey="progress"
                        stroke="var(--fallback-in,hsl(var(--in)))"
                        strokeWidth={3}
                        fill="url(#hydrationGradient)"
                        activeDot={{ r: 6 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Daily Goal Highlight Banner Container */}
              <div className="md:col-span-4 rounded-2xl bg-base-100 p-6 border border-base-300 flex flex-col justify-between relative overflow-hidden shadow-xs">
                <div className="space-y-1 relative z-10">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-info tracking-wider">
                      Daily Goal
                    </span>
                    <h4 className="text-xl font-black text-base-content">
                      2.5 Liters
                    </h4>
                    <p className="text-[11px] opacity-70 leading-tight max-w-37.5">
                      Keep up the consistent focus today!
                    </p>
                  </div>
                </div>
                <div className="absolute -right-1 -bottom-2 text-6xl select-none opacity-80 filter grayscale-25 animate-pulse">
                  👾
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </Sidebar>
  );
}
