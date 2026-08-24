// get current date

export function getDayKey(timezone) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((p) => p.type === "year").value;
  const month = parts.find((p) => p.type === "month").value;
  const day = parts.find((p) => p.type === "day").value;

  return `${year}/${month}/${day}`;
}

// parse a "YYYY/MM/DD" dayKey (as produced by getDayKey) into a Date
export function parseDayKey(dayKey) {
  const [year, month, day] = dayKey.split("/").map(Number);
  return new Date(year, month - 1, day);
}

// whole-day difference between two dayKey Dates, laterDate - earlierDate
export function diffInDays(laterDate, earlierDate) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((laterDate.getTime() - earlierDate.getTime()) / msPerDay);
}


export function getToday() {
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  return { startDate, endDate };
}

// get Week date
export function getWeeklyDateRange() {
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(startDate.getDate() - 6);

  return { startDate, endDate };
}
