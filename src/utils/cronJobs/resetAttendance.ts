import cron from "node-cron";
import { DateTime } from "luxon";
import parser from "cron-parser";
import {
  initializeDailyAttendance,
  setAbsentForPendingStudents,
} from "../../helpers/attendanceHelper";

const tenantCronSchedules: Record<string, Record<string, Date>> = {};
// const SYSTEM_TIMEZONE = "Africa/Kigali";

export function getNextCronSchedule(
  tenantID: string,
  jobName: string
): Date | null {
  return tenantCronSchedules[tenantID]?.[jobName] || null;
}

async function initializeCronJobs(
  clientService: any,
  tenantID: string,
  models: any
) {
  if (!tenantCronSchedules[tenantID]) {
    tenantCronSchedules[tenantID] = {};
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

    // Schedule initializeDailyAttendance at 6 AM, Monday to Friday in Kigali
    const initializeAttendanceSchedule = "22 10 * * 1-5";

    cron.schedule(
      initializeAttendanceSchedule,
      async () => {
        console.log(
          `Running initializeDailyAttendance for tenantID: ${tenantID}`
        );
        await initializeDailyAttendance(models, tenantID);
        tenantCronSchedules[tenantID]["initializeAttendance"] =
          calculateNextRun(initializeAttendanceSchedule);
      }
      // { timezone: SYSTEM_TIMEZONE }
    );

    tenantCronSchedules[tenantID]["initializeAttendance"] = calculateNextRun(
      initializeAttendanceSchedule
      // SYSTEM_TIMEZONE
    );

    // Schedule setAbsentForPendingStudents at the endTime, Monday to Friday
    const setAbsentSchedule = `0 ${endTime.split(":")[1]} ${
      endTime.split(":")[0]
    } * * 1-5`;

    cron.schedule(
      setAbsentSchedule,
      async () => {
        console.log(
          `Running setAbsentForPendingStudents for tenant: ${tenantID}`
        );
        await setAbsentForPendingStudents(models.Attendance, tenantID);
        tenantCronSchedules[tenantID]["setAbsent"] = calculateNextRun(
          setAbsentSchedule
          // SYSTEM_TIMEZONE
        );
      }
      // { timezone: SYSTEM_TIMEZONE }
    );

    tenantCronSchedules[tenantID]["setAbsent"] = calculateNextRun(
      setAbsentSchedule
      // SYSTEM_TIMEZONE
    );
  } catch (error) {
    throw error;
  }
}

export default initializeCronJobs;

/**
 * Calculate the next execution time for a given cron schedule in the specified timezone.
 */
function calculateNextRun(schedule: string): Date {
  try {
    const interval = parser.parseExpression(schedule); // No timezone handling here
    const nextRunUtc = interval.next().toDate(); // Returns UTC Date

    // Convert UTC Date to the target timezone
    const nextRunInTimezone = DateTime.fromJSDate(nextRunUtc, {
      zone: "utc",
    }).toJSDate();
    return nextRunInTimezone;
  } catch (error) {
    console.error("Error calculating next run for schedule:", schedule, error);
    throw new Error("Invalid cron schedule provided");
  }
}
