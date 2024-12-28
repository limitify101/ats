import { DateTime } from "luxon";
import {
  initializeDailyAttendance,
  setAbsentForPendingStudents,
} from "../../helpers/attendanceHelper";

const tenantSchedules: Record<
  string,
  Record<string, NodeJS.Timeout | null>
> = {};

export async function initializeAttendanceJobs(
  clientService: any,
  tenantID: string,
  models: any
) {
  if (!tenantSchedules[tenantID]) {
    tenantSchedules[tenantID] = { initializeAttendance: null, setAbsent: null };
  }

  try {
    const attendanceSettings = await clientService.getClientSettings(tenantID);
    if (!attendanceSettings) {
      console.error(`Attendance settings not found for tenantID: ${tenantID}`);
      return;
    }

    const { startTime, endTime } = attendanceSettings;
    if (!startTime || !endTime) {
      throw new Error(`Missing startTime or endTime for tenantID: ${tenantID}`);
    }

    // Schedule initializeDailyAttendance at 6 AM, Monday to Friday
    scheduleJob(
      tenantID,
      "initializeAttendance",
      () => initializeDailyAttendance(models, tenantID),
      calculateNextRun("06:00", [1, 2, 3, 4, 5])
    );

    // Schedule setAbsentForPendingStudents at the specified endTime, Monday to Friday
    scheduleJob(
      tenantID,
      "setAbsent",
      () => setAbsentForPendingStudents(models.Attendance, tenantID),
      calculateNextRun(endTime, [1, 2, 3, 4, 5])
    );
  } catch (error) {
    console.error(`Error initializing jobs for tenantID: ${tenantID}`, error);
    throw error;
  }
}

function scheduleJob(
  tenantID: string,
  jobName: string,
  jobFunction: () => Promise<void>,
  nextRunTime: Date
) {
  const now = new Date();
  const delay = nextRunTime.getTime() - now.getTime();

  if (delay > 0) {
    if (tenantSchedules[tenantID][jobName]) {
      clearTimeout(tenantSchedules[tenantID][jobName]!);
    }

    tenantSchedules[tenantID][jobName] = setTimeout(async () => {
      console.log(`Running ${jobName} for tenantID: ${tenantID}`);
      await jobFunction();
      const nextRun = calculateNextRun(
        jobName === "initializeAttendance" ? "06:00" : "endTime",
        [1, 2, 3, 4, 5]
      );
      scheduleJob(tenantID, jobName, jobFunction, nextRun);
    }, delay);
  } else {
    console.warn(`Next run time for ${jobName} is in the past. Skipping.`);
  }
}

export function calculateNextRun(time: string, daysOfWeek: number[]): Date {
  const [hour, minute] = time.split(":").map(Number);
  const now = DateTime.now();
  let nextRun = now.set({ hour, minute, second: 0, millisecond: 0 });

  while (!daysOfWeek.includes(nextRun.weekday) || nextRun <= now) {
    nextRun = nextRun.plus({ days: 1 });
  }

  return nextRun.toJSDate();
}

export function stopAttendanceJobs(tenantID: string) {
  if (tenantSchedules[tenantID]) {
    Object.keys(tenantSchedules[tenantID]).forEach((jobName) => {
      if (tenantSchedules[tenantID][jobName]) {
        clearTimeout(tenantSchedules[tenantID][jobName]!);
        tenantSchedules[tenantID][jobName] = null;
      }
    });
  }
}
