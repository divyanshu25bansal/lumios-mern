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

export default function Hydration() {
  const { user } = useContext(UserContext);
  const [hydration, setHydration] = useState(null);
  const [last7DaysData, setLas7DaysData] = useState(null);

  const today = new Date(); // setting todays date
  today.setHours(0, 0, 0, 0);

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
          BASE_URL + "/hydration",
          {
            target: 2500,
            consumed: 0,
            date: today,
          },
          {
            withCredentials: true,
          },
        );

        setHydration(createResponse.data);
      } catch (err) {
        console.error(err);
      }
    };

    getHydrationInfo();
  }, [user]);

  useEffect(() => {
    const last7Days = async () => {
      const response = await axios.get(BASE_URL + "/hydration/last-7-days", {
        withCredentials: true,
      });

      const chartData = response.data.map((day) => ({
        date: new Date(day.date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        }),
        consumed: day.consumed,
        target: day.target,
      }));
      setLas7DaysData(chartData);
      console.log(chartData);
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
        BASE_URL + "/hydration",
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

  return (
    <Sidebar>
      <main className="flex-1 bg-[#f8fafc] p-6 min-h-screen">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center pt-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-slate-900">Hydration</h1>
              <p className="text-sm text-slate-500">
                Track your daily water intake.
              </p>
            </div>
            <div className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-100">
              Today, 20 May
            </div>
          </div>

          {/* Top Panel Grid */}
          <div className="grid gap-6 md:grid-cols-12">
            {/* Radial Ring */}
            <div className="md:col-span-5 rounded-2xl border border-slate-100 bg-white p-6 flex flex-col items-center justify-center min-h-65">
              <div
                className="radial-progress text-blue-500"
                style={{
                  "--value": 64,
                  "--size": "10.5rem",
                  "--thickness": "10px",
                }}
                role="progressbar"
              >
                <div className="text-center">
                  <p className="text-3xl font-black text-slate-800">
                    {hydration?.consumed / 1000 || 0} L
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
                    of {hydration?.target / 1000}L{" "}
                    {(
                      (hydration?.consumed / hydration?.target) *
                      100
                    ).toFixed()}
                    %
                  </p>
                </div>
              </div>
            </div>

            {/* Bottle Card & Increments */}
            <div className="md:col-span-7 rounded-2xl border border-slate-100 bg-white p-6 flex flex-col justify-between min-h-65">
              <div className="flex justify-between items-center px-4">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-blue-500 tracking-wider">
                      Water Intake
                    </span>
                    <h2 className="text-3xl font-black text-slate-800">
                      {hydration?.consumed / 1000} L{" "}
                      <span className="text-xs font-medium text-slate-400">
                        Drunk
                      </span>
                    </h2>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-700">
                      {(hydration?.target - hydration?.consumed) / 1000} L{" "}
                      <span className="text-xs font-medium text-slate-400">
                        Left
                      </span>
                    </h3>
                  </div>
                </div>

                {/* Bottle Shape */}
                <div className="w-16 h-32 border-4 border-slate-800 rounded-xl relative overflow-hidden bg-slate-50 flex flex-col justify-end">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-2 bg-slate-800 rounded-b-sm" />
                  <div
                    className="w-full bg-linear-to-t from-blue-500 to-sky-400 transition-all duration-300"
                    style={{
                      height: `${(hydration?.consumed / hydration?.target) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Quick Add Actions */}
              <div className={`grid grid-cols-4 gap-2 mt-4 text-xs font-bold`}>
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
                    className={`border border-slate-200 bg-white py-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition ${hydration?.consumed >= hydration?.target && "cursor-not-allowed opacity-30"}`}
                  >
                    {amt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Panel Grid */}
          <div className="grid gap-6 md:grid-cols-12">
            {/* Chart */}
            <div className="md:col-span-8 rounded-2xl border border-slate-100 bg-white p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-slate-800">
                  Hydration Trend
                </h3>
                <span className="text-xs text-slate-400">Last 7 Days</span>
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
                          stopColor="#3b82f6"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" vertical={false} />

                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />

                    <YAxis
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />

                    <Tooltip
                      formatter={(value) => [`${value}%`, "Goal Completion"]}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="progress"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fill="url(#hydrationGradient)"
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Daily Goal Illustration Banner */}
            <div className="md:col-span-4 rounded-2xl bg-linear-to-br from-indigo-50 to-blue-50 p-6 border border-blue-100/40 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-1 relative z-10">
                <div>
                  <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">
                    Daily Goal
                  </span>
                  <h4 className="text-xl font-black text-slate-800">
                    2.5 Liters
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-tight max-w-37.5">
                    Keep up the consistent focus today!
                  </p>
                </div>
              </div>
              <div className="absolute -right-1 -bottom-2 text-6xl select-none filter opacity-90 animate-pulse">
                👾
              </div>
            </div>
          </div>
        </div>
      </main>
    </Sidebar>
  );
}
