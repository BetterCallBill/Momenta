const TZ = "Australia/Sydney";

function getSydneyNow(): Date {
  const formatter = new Intl.DateTimeFormat("en-AU", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(new Date());
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)!.value;
  return new Date(
    `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}`
  );
}

/** Returns [Monday 00:00, Sunday 23:59:59] of the current week in Sydney time, as UTC Date objects. */
export function getThisWeekRange(): { start: Date; end: Date } {
  const now = getSydneyNow();
  const dayOfWeek = now.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { start: monday, end: sunday };
}

/** Returns [Monday 00:00, Sunday 23:59:59] of next week in Sydney time. */
export function getNextWeekRange(): { start: Date; end: Date } {
  const { end: thisEnd } = getThisWeekRange();
  const nextMonday = new Date(thisEnd);
  nextMonday.setDate(thisEnd.getDate() + 1);
  nextMonday.setHours(0, 0, 0, 0);

  const nextSunday = new Date(nextMonday);
  nextSunday.setDate(nextMonday.getDate() + 6);
  nextSunday.setHours(23, 59, 59, 999);

  return { start: nextMonday, end: nextSunday };
}

/** Returns [1st of month 00:00, last day 23:59:59] for the current month in Sydney time. */
export function getThisMonthRange(): { start: Date; end: Date } {
  const now = getSydneyNow();
  const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: TZ,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: TZ,
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}

export function formatDateLong(date: Date): string {
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: TZ,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function getDayName(date: Date): string {
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: TZ,
    weekday: "short",
  }).format(date);
}

export function getDayOfMonth(date: Date): number {
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone: TZ,
    day: "numeric",
  }).formatToParts(date);
  return parseInt(parts.find((p) => p.type === "day")!.value, 10);
}

export { TZ };
