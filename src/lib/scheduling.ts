import { DateTime } from "luxon";

export interface TimeSlot {
  start: Date;
  end: Date;
  label: string;
}

export interface RecurringAvailability {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
}

/**
 * Generates available slots for the next 7 days based on tutor's recurring availability.
 * All slots are returned in the student's local timezone.
 */
export function generateAvailableSlots(
  availability: RecurringAvailability[],
  tutorTimezone: string = "UTC",
  studentTimezone: string = "UTC"
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const now = DateTime.now().setZone(studentTimezone);

  // Check next 7 days
  for (let i = 0; i < 7; i++) {
    const targetDate = now.plus({ days: i });
    const dayOfWeek = targetDate.weekday % 7; // luxon weekday 1-7 (Mon-Sun) -> 0-6 (Sun-Sat)

    const dayAvailability = availability.filter(a => a.dayOfWeek === dayOfWeek);

    for (const avail of dayAvailability) {
      const [startH, startM] = avail.startTime.split(":").map(Number);
      const [endH, endM] = avail.endTime.split(":").map(Number);

      // Create tutor's start/end in tutor's timezone
      let tutorStart = DateTime.fromObject(
        { year: targetDate.year, month: targetDate.month, day: targetDate.day, hour: startH, minute: startM },
        { zone: tutorTimezone }
      );

      let tutorEnd = DateTime.fromObject(
        { year: targetDate.year, month: targetDate.month, day: targetDate.day, hour: endH, minute: endM },
        { zone: tutorTimezone }
      );

      // Convert to student's timezone
      const studentStart = tutorStart.setZone(studentTimezone);
      const studentEnd = tutorEnd.setZone(studentTimezone);

      // Only show future slots
      if (studentStart > now) {
        slots.push({
          start: studentStart.toJSDate(),
          end: studentEnd.toJSDate(),
          label: `${studentStart.toFormat("HH:mm")} - ${studentEnd.toFormat("HH:mm")} (${studentStart.toFormat("ccc, LLL d")})`,
        });
      }
    }
  }

  return slots.sort((a, b) => a.start.getTime() - b.start.getTime());
}
