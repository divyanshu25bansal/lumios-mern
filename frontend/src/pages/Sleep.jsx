import Sidebar from "../components/Sidebar";
import { useState } from "react";
import {
  Moon,
  ChevronDown,
  Sparkles,
  Clock,
  Calendar,
  Smile,
  Frown,
  Plus,
} from "lucide-react";

export default function SleepBoard() {
  const [activeRange, setActiveRange] = useState("This Week");

  // Custom datasets tracking sleep metrics
  const weeklySleepData = [
    { day: "Mon", duration: 7.5, fellAsleep: "11:00 PM", sleepTimeValue: 11.0 },
    { day: "Tue", duration: 6.2, fellAsleep: "11:30 PM", sleepTimeValue: 11.5 },
    {
      day: "Wed",
      duration: 8.0,
      fellAsleep: "10:45 PM",
      sleepTimeValue: 10.75,
    },
    {
      day: "Thu",
      duration: 5.5,
      fellAsleep: "12:15 AM",
      sleepTimeValue: 12.25,
    },
    { day: "Fri", duration: 4.0, fellAsleep: "1:00 AM", sleepTimeValue: 13.0 },
    {
      day: "Sat",
      duration: 8.5,
      fellAsleep: "11:15 PM",
      sleepTimeValue: 11.25,
    },
    { day: "Sun", duration: 7.0, fellAsleep: "11:00 PM", sleepTimeValue: 11.0 },
  ];

  // Calculations for Summary Cards
  const totalHours = weeklySleepData.reduce(
    (acc, curr) => acc + curr.duration,
    0,
  );
  const weeklyAverage = (totalHours / weeklySleepData.length).toFixed(1);
  const lastNightDuration = weeklySleepData[6].duration;

  // Sleep Quality evaluation logic
  const getSleepQuality = (hours) => {
    if (hours >= 7.5)
      return {
        rating: "Good Quality",
        text: "Optimal rest & recovery attained.",
        color: "text-emerald-600 bg-emerald-50/60",
        icon: Smile,
      };
    if (hours >= 6.0)
      return {
        rating: "Fair Quality",
        text: "Moderate rest, but try to catch up.",
        color: "text-indigo-600 bg-indigo-50/60",
        icon: Smile,
      };
    return {
      rating: "Bad Quality",
      text: "Sleep deprivation detected. Rest early.",
      color: "text-rose-600 bg-rose-50/60",
      icon: Frown,
    };
  };

  const currentQuality = getSleepQuality(lastNightDuration);

  return (
    <Sidebar>
      <main className="flex-1 bg-[#f8fafc] p-4 lg:p-6 min-h-screen font-sans antialiased text-slate-600">
        <div className="mx-auto max-w-7xl space-y-5">
          {/* Header Layout Block */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                Sleep Dashboard
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Dual-metric chronological sleep logging.
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {/* Action Button requested by user */}
              <button className="btn btn-xs border-0 rounded-lg bg-[#6366f1] text-white hover:bg-indigo-700 font-medium normal-case h-8 px-3 text-xs shadow-xs">
                <Plus size={13} className="mr-1" /> Enter Your Todays Sleep
              </button>

              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-xs bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium rounded-lg gap-1.5 shadow-2xs h-8 px-2.5 text-xs"
                >
                  {activeRange}{" "}
                  <ChevronDown size={12} className="text-slate-400" />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-10 menu p-1 shadow-sm bg-white border border-slate-100 rounded-lg w-32 text-xs mt-1"
                >
                  <li>
                    <button onClick={() => setActiveRange("This Week")}>
                      This Week
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Three Layout Reference Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Card 1: Last Night Duration */}
            <div className="rounded-2xl border border-slate-100 bg-white p-4.5 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">
                  Average Sleep (Last Night)
                </span>
                <h3 className="text-xl font-semibold text-slate-800 tracking-tight mt-1">
                  {lastNightDuration} hrs
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-medium">
                Bedtime: {weeklySleepData[6].fellAsleep}
              </p>
            </div>

            {/* Card 2: Quality Indicator (Dynamic) */}
            <div className="rounded-2xl border border-slate-100 bg-white p-4.5 shadow-xs flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">
                    Sleep Quality Status
                  </span>
                  <h3 className="text-lg font-semibold text-slate-800 tracking-tight mt-1">
                    {currentQuality.rating}
                  </h3>
                </div>
                <div className={`p-1.5 rounded-lg ${currentQuality.color}`}>
                  <currentQuality.icon size={15} />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-medium">
                {currentQuality.text}
              </p>
            </div>

            {/* Card 3: Weekly Average */}
            <div className="rounded-2xl border border-slate-100 bg-white p-4.5 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">
                  Weekly Average Sleep
                </span>
                <h3 className="text-xl font-semibold text-slate-800 tracking-tight mt-1">
                  {weeklyAverage} hrs / day
                </h3>
              </div>
              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-indigo-500 h-full rounded-full"
                  style={{ width: `${(weeklyAverage / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Custom Dual-Axis Line Graph Matrix with Quantities */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-xs font-medium text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar size={13} className="text-slate-400" /> Sleep
                  Correlation Metric View
                </h3>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                  Compares sleep duration with bedtime index value metrics.
                </p>
              </div>

              {/* Legend Identifiers */}
              <div className="flex items-center gap-4 text-[10px] font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-indigo-500 block" />
                  <span className="text-slate-500">Duration (Hours)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-purple-400 block border-dashed border-t" />
                  <span className="text-slate-500">Bedtime Index</span>
                </div>
              </div>
            </div>

            {/* Chart Wrapper Container incorporating Quantities */}
            <div className="flex gap-3">
              {/* Vertical Left Y-Axis Quantities Labels */}
              <div className="flex flex-col justify-between text-[10px] font-medium text-slate-400 h-44 pb-5 select-none text-right w-12">
                <span>10h / 10 PM</span>
                <span>8h / 11 PM</span>
                <span>6h / 12 AM</span>
                <span>4h / 1 AM</span>
              </div>

              {/* Line Graph Body */}
              <div className="relative flex-1 h-44 pb-5">
                {/* Horizontal mesh scale ticks */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-5">
                  <div className="border-b border-slate-100 w-full" />
                  <div className="border-b border-slate-100 w-full" />
                  <div className="border-b border-slate-100 w-full" />
                  <div className="w-full" />
                </div>

                {/* SVG Curves Layout */}
                <svg
                  className="w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                  viewBox="0 0 500 100"
                >
                  {/* Duration Path (Solid Indigo) */}
                  <path
                    d="M 10 40 L 85 55 L 160 35 L 235 62 L 310 80 L 385 28 L 460 45"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Bedtime Index Path (Dashed Purple) */}
                  <path
                    d="M 10 35 L 85 45 L 160 30 L 235 65 L 310 85 L 385 40 L 460 35"
                    fill="none"
                    stroke="#c084fc"
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Node Hover Interactive Points */}
                  {weeklySleepData.map((data, i) => {
                    const xCoord = 10 + i * 75;
                    const yDuration = [40, 55, 35, 62, 80, 28, 45][i];

                    return (
                      <g key={i} className="group/node">
                        <circle
                          cx={xCoord}
                          cy={yDuration}
                          r="2.5"
                          className="fill-white stroke-indigo-600 stroke-2 cursor-pointer"
                        />

                        <foreignObject
                          x={xCoord - 35}
                          y={yDuration - 36}
                          width="70"
                          height="32"
                          className="hidden group-hover/node:block pointer-events-none"
                        >
                          <div className="bg-slate-900 text-white text-[9px] font-medium p-1 rounded shadow-xs text-center leading-tight">
                            <div>{data.duration} hrs</div>
                            <div className="text-[8px] text-slate-300">
                              {data.fellAsleep}
                            </div>
                          </div>
                        </foreignObject>
                      </g>
                    );
                  })}
                </svg>

                {/* Horizontal Days Axis */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] font-medium text-slate-400 px-1">
                  {weeklySleepData.map((d, index) => (
                    <span key={index} className="w-10 text-center">
                      {d.day}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Sidebar>
  );
}
