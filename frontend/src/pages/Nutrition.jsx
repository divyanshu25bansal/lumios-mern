import Sidebar from "../components/Sidebar";
import { useState } from "react";
import {
  Flame,
  ChevronLeft,
  ChevronRight,
  Plus,
  Activity,
  Utensils,
  Sparkles,
  Apple,
  Fish,
  Dna,
  Settings2,
  Check,
} from "lucide-react";

export default function Nutrition() {
  const [isLoading, setIsLoading] = useState(true);
  // State for making target goals fully user-editable
  const [goals, setGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fats: 80,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempGoals, setTempGoals] = useState({ ...goals });

  // Static current values consumed today
  const currentIntake = {
    calories: 1480,
    protein: 90,
    carbs: 180,
    fats: 48,
  };

  // Dynamically calculate percentages for progress indicators
  const stats = [
    {
      label: "Calories",
      value: currentIntake.calories.toLocaleString(),
      total: `${goals.calories} kcal`,
      progress: Math.min((currentIntake.calories / goals.calories) * 100, 100),
      progressColor: "progress-warning",
      icon: Flame,
      iconBg: "bg-warning/10 text-warning",
    },
    {
      label: "Protein",
      value: `${currentIntake.protein}g`,
      total: `${goals.protein}g`,
      progress: Math.min((currentIntake.protein / goals.protein) * 100, 100),
      progressColor: "progress-success",
      icon: Dna,
      iconBg: "bg-success/10 text-success",
    },
    {
      label: "Carbs",
      value: `${currentIntake.carbs}g`,
      total: `${goals.carbs}g`,
      progress: Math.min((currentIntake.carbs / goals.carbs) * 100, 100),
      progressColor: "progress-info",
      icon: Apple,
      iconBg: "bg-info/10 text-info",
    },
    {
      label: "Fats",
      value: `${currentIntake.fats}g`,
      total: `${goals.fats}g`,
      progress: Math.min((currentIntake.fats / goals.fats) * 100, 100),
      progressColor: "progress-error",
      icon: Fish,
      iconBg: "bg-error/10 text-error",
    },
  ];

  const recentMeals = [
    {
      name: "Oatmeal",
      details: "Banana, Nuts",
      kcal: "450 kcal",
      time: "8:00 AM",
    },
    {
      name: "Grilled Chicken",
      details: "Rice, Salad",
      kcal: "620 kcal",
      time: "1:30 PM",
    },
    {
      name: "Lentil Soup",
      details: "Brown Bread",
      kcal: "410 kcal",
      time: "7:00 PM",
    },
  ];

  const weeklyTrends = [
    { day: "Mon", h: "75%" },
    { day: "Tue", h: "60%" },
    { day: "Wed", h: "80%" },
    { day: "Thu", h: "95%" },
    { day: "Fri", h: "70%" },
    { day: "Sat", h: "50%" },
    { day: "Sun", h: "85%" },
  ];

  const handleSaveGoals = () => {
    setGoals({ ...tempGoals });
    setIsEditing(false);
  };

  return (
    <Sidebar>
      <main className="flex-1 bg-base-200 text-base-content p-4 lg:p-6 min-h-screen transition-colors duration-200">
        <div className="mx-auto max-w-7xl space-y-5">
          {/* Header */}
          <div className="flex gap-3 flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-base-content">
                Nutrition Overview
              </h1>
              <p className="text-xs opacity-60">
                Track your meals and nutrition goals.
              </p>
            </div>

            <div className="flex-col flex sm:flex-row sm:items-center gap-2 self-end sm:self-auto">
              <div className="join overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm h-8">
                <button className="btn btn-ghost btn-xs join-item px-2">
                  <ChevronLeft size={13} className="text-base-content/80" />
                </button>
                <button className="btn btn-ghost btn-xs join-item normal-case font-bold text-[11px] px-2.5 text-base-content/80">
                  Today, 20 May
                </button>
                <button className="btn btn-ghost btn-xs join-item px-2">
                  <ChevronRight size={13} className="text-base-content/80" />
                </button>
              </div>

              <button className="btn btn-xs border-0 rounded-xl bg-primary text-primary-content hover:bg-primary/90 font-bold capitalize h-8 px-3 text-xs shadow-xs">
                <Plus size={13} className="mr-0.5" /> Add Meal
              </button>
            </div>
          </div>

          {/* Compact Space-Optimized Analytics Cards */}
          <div className="grid gap-3 grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, idx) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-base-300/60 bg-base-100 p-3.5 shadow-xs flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-40 block truncate">
                        {stat.label}
                      </span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <h3 className="text-xl font-black text-base-content tracking-tight">
                          {stat.value}
                        </h3>
                        <span className="text-[10px] font-semibold opacity-40">
                          /{stat.total}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${stat.iconBg}`}
                    >
                      <IconComponent size={14} />
                    </div>
                  </div>
                  <progress
                    className={`progress ${stat.progressColor} mt-2.5 w-full h-1.5`}
                    value={stat.progress}
                    max="100"
                  />
                </div>
              );
            })}
          </div>

          {/* Master Segment Grid Layout split */}
          <div className="grid gap-5 lg:grid-cols-12 items-start">
            {/* Left Column Stack */}
            <div className="lg:col-span-8 space-y-5">
              {/* Macro Distribution Card */}
              <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-xs">
                <h2 className="mb-4 text-xs font-bold text-base-content flex items-center gap-1.5">
                  <Activity size={14} className="opacity-40" /> Macronutrient
                  Distribution
                </h2>

                <div className="flex flex-col items-center justify-around gap-4 sm:flex-row">
                  <div className="relative h-28 w-28 shrink-0">
                    <div
                      className="h-28 w-28 rounded-full"
                      style={{
                        background:
                          "conic-gradient(var(--fallback-in,hsl(var(--in))) 0% 40%, var(--fallback-su,hsl(var(--su))) 40% 70%, var(--fallback-wa,hsl(var(--wa))) 70% 100%)",
                      }}
                    />
                    <div className="absolute inset-3 flex items-center justify-center rounded-full bg-base-100">
                      <div className="text-center">
                        <span className="block text-lg font-black text-base-content tracking-tight">
                          {currentIntake.calories}
                        </span>
                        <span className="text-[8px] uppercase tracking-wider opacity-40 font-bold">
                          kcal
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 sm:flex sm:flex-col sm:gap-2 text-[11px] font-bold w-full max-w-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-l-4 border-info pl-2">
                      <span className="opacity-50 font-medium">Carbs</span>
                      <span className="text-base-content">40%</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-l-4 border-success pl-2">
                      <span className="opacity-50 font-medium">Protein</span>
                      <span className="text-base-content">30%</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-l-4 border-warning pl-2">
                      <span className="opacity-50 font-medium">Fats</span>
                      <span className="text-base-content">30%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Meals Block Section */}
              <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-xs">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-xs font-bold text-base-content flex items-center gap-1.5">
                    <Utensils size={14} className="opacity-40" /> Recent Meals
                  </h2>
                  <button className="btn btn-link btn-xs text-primary p-0 normal-case no-underline font-bold text-xs">
                    See all
                  </button>
                </div>

                <div className="space-y-2">
                  {recentMeals.map((meal, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl bg-base-200/50 p-2.5 border border-base-300/30"
                    >
                      <div>
                        <p className="text-xs font-bold text-base-content">
                          {meal.name}
                        </p>
                        <p className="text-[10px] opacity-40 font-semibold mt-0.5">
                          {meal.details} • {meal.time}
                        </p>
                      </div>
                      <span className="text-xs font-black text-base-content/80 bg-base-100 border border-base-300/60 px-2.5 py-0.5 rounded-lg">
                        {meal.kcal}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column Stack */}
            <div className="lg:col-span-4 space-y-5">
              {/* Editable Nutrient Goals Section */}
              <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-xs">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-base-content uppercase tracking-wider flex items-center gap-1.5">
                    <Settings2 size={13} className="opacity-40" /> Nutrition
                    Goals
                  </h3>
                  {isEditing ? (
                    <button
                      onClick={handleSaveGoals}
                      className="btn btn-xs bg-success border-0 text-success-content hover:bg-success/90 rounded-lg px-2 flex items-center gap-1 font-bold normal-case h-5 text-[10px]"
                    >
                      <Check size={10} /> Save
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setTempGoals({ ...goals });
                        setIsEditing(true);
                      }}
                      className="btn btn-link btn-xs text-primary p-0 normal-case no-underline font-bold text-xs"
                    >
                      Edit
                    </button>
                  )}
                </div>

                <div className="space-y-2.5 text-[11px]">
                  {/* Calorie Goal Row */}
                  <div className="flex items-center justify-between">
                    <span className="font-semibold opacity-50">
                      Calories target
                    </span>
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={tempGoals.calories}
                          onChange={(e) =>
                            setTempGoals({
                              ...tempGoals,
                              calories: Number(e.target.value),
                            })
                          }
                          className="w-14 text-right bg-base-200 border border-base-300 rounded px-1 py-0.5 font-bold text-base-content focus:outline-primary text-[11px]"
                        />
                        <span className="opacity-40 font-medium">kcal</span>
                      </div>
                    ) : (
                      <span className="font-bold text-base-content">
                        {goals.calories.toLocaleString()} kcal
                      </span>
                    )}
                  </div>

                  {/* Protein Goal Row */}
                  <div className="flex items-center justify-between">
                    <span className="font-semibold opacity-50">
                      Protein target
                    </span>
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={tempGoals.protein}
                          onChange={(e) =>
                            setTempGoals({
                              ...tempGoals,
                              protein: Number(e.target.value),
                            })
                          }
                          className="w-14 text-right bg-base-200 border border-base-300 rounded px-1 py-0.5 font-bold text-base-content focus:outline-primary text-[11px]"
                        />
                        <span className="opacity-40 font-medium">g</span>
                      </div>
                    ) : (
                      <span className="font-bold text-base-content">
                        {goals.protein} g
                      </span>
                    )}
                  </div>

                  {/* Carbs Goal Row */}
                  <div className="flex items-center justify-between">
                    <span className="font-semibold opacity-50">
                      Carbs target
                    </span>
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={tempGoals.carbs}
                          onChange={(e) =>
                            setTempGoals({
                              ...tempGoals,
                              carbs: Number(e.target.value),
                            })
                          }
                          className="w-14 text-right bg-base-200 border border-base-300 rounded px-1 py-0.5 font-bold text-base-content focus:outline-primary text-[11px]"
                        />
                        <span className="opacity-40 font-medium">g</span>
                      </div>
                    ) : (
                      <span className="font-bold text-base-content">
                        {goals.carbs} g
                      </span>
                    )}
                  </div>

                  {/* Fats Goal Row */}
                  <div className="flex items-center justify-between">
                    <span className="font-semibold opacity-50">
                      Fats target
                    </span>
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={tempGoals.fats}
                          onChange={(e) =>
                            setTempGoals({
                              ...tempGoals,
                              fats: Number(e.target.value),
                            })
                          }
                          className="w-14 text-right bg-base-200 border border-base-300 rounded px-1 py-0.5 font-bold text-base-content focus:outline-primary text-[11px]"
                        />
                        <span className="opacity-40 font-medium">g</span>
                      </div>
                    ) : (
                      <span className="font-bold text-base-content">
                        {goals.fats} g
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Nutrition Trend Column Graph */}
              <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[10px] font-bold text-base-content uppercase tracking-wider">
                    Trends
                  </h3>
                  <span className="text-[9px] font-bold opacity-40 uppercase">
                    This Week
                  </span>
                </div>
                <div className="flex h-28 items-end justify-between gap-1 border-b border-base-300 pb-1">
                  {weeklyTrends.map((bar, idx) => (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center justify-end h-full group"
                    >
                      <div
                        className="w-full max-w-2.5 bg-primary/80 group-hover:bg-primary rounded-t transition-all duration-300"
                        style={{ height: bar.h }}
                      />
                      <span className="text-[8px] font-bold opacity-40 mt-1.5">
                        {bar.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Wellness Prompt Bubble */}
              <div className="rounded-xl border border-primary/20 bg-linear-to-br from-primary/10 to-secondary/5 p-4 shadow-xs flex flex-row items-start gap-2.5">
                <div className="flex-1 text-[11px]">
                  <span className="font-bold text-base-content/90 flex items-center gap-1 mb-0.5">
                    <Sparkles size={12} className="text-primary" /> Daily Tip
                  </span>
                  <p className="text-base-content/80 leading-relaxed font-medium">
                    Adjusting targets changes macro calculations dynamically.
                    Set your goals based on your primary focus!
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
