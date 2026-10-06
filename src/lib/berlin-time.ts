// The restaurant runs on Berlin time whatever the guest's browser says.

/** "2026-10-31" + "19:30" as Berlin wall-clock time, returned as an ISO instant. */
export const berlinToISO = (date: string, time: string) => {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Europe/Berlin", hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
    }).formatToParts(new Date(guess)).map((p) => [p.type, p.value]),
  );
  const asBerlin = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute);
  return new Date(guess - (asBerlin - guess)).toISOString();
};

/** Today's date in Berlin as YYYY-MM-DD. */
export const berlinToday = () => new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Berlin" });

/** Opening hours: Tuesday to Sunday, 12:00 to 22:00 (Monday closed). */
export const isClosedDay = (date: string) => new Date(`${date}T12:00:00Z`).getUTCDay() === 1;

/** Quarter-hour slots for a date, 12:00 to 21:30, leaving `leadMinutes` before now when the date is today. */
export const timeSlots = (date: string, leadMinutes = 30) => {
  if (!date || isClosedDay(date)) return [];
  const out: string[] = [];
  const cutoff = Date.now() + leadMinutes * 60000;
  for (let h = 12; h < 22; h++) {
    for (const m of [0, 15, 30, 45]) {
      if (h === 21 && m > 30) continue;
      const t = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      if (new Date(berlinToISO(date, t)).getTime() >= cutoff) out.push(t);
    }
  }
  return out;
};
