import React, { useEffect, useState } from "react";
import { chartsConfig } from "@/configs";
import { Link } from "react-router-dom";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Progress,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/solid";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import {
  useClassAttendanceData,
  useRfidData,
  useClassData,
  useChartsData,

} from "@/data";
import { AcademicCapIcon, ClockIcon, CpuChipIcon, ExclamationCircleIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import HomeNotifications from "@/components/Notifications";

export function Home() {

  const { presence, late, absent } = useClassAttendanceData();
  const { activeCards } = useRfidData();
  const { classes, attendanceLog } = useClassData();

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  // const previousMonth = new Date(currentDate.setMonth(currentMonth - 1));
  // const previousMonthName = previousMonth.toLocaleString("en-US", { month: "long" });
  const currentMonthName = currentDate.toLocaleString("en-US", { month: "long" });

  const { classNames, attendances, week } = useChartsData(currentMonthName);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Extract data for the chart
  const presentData = daysOfWeek.map(day => week[day]?.present || 0);
  const lateData = daysOfWeek.map(day => week[day]?.late || 0);
  const absentData = daysOfWeek.map(day => week[day]?.absent || 0);

  // Define the chart configuration
  const attendanceTrends = {
    type: "bar",
    height: 220,
    series: [
      {
        name: "Present",
        data: presentData,
      },
      {
        name: "Late",
        data: lateData,
      },
      {
        name: "Absent",
        data: absentData,
      },
    ],
    options: {
      ...chartsConfig,
      colors: ["#689f38", "#f9a825", "#d84315"],
      plotOptions: {
        bar: {
          columnWidth: "20%",
          borderRadius: 5,
        },
      },
      xaxis: {
        ...chartsConfig.xaxis,
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      },
    },
  };

  const weekData = {
    color: "white",
    title: "Attendance Trends",
    description: "Last Week Performance",
    footer: "just updated",
    chart: attendanceTrends,
  }

  const classAttendance = {
    type: "bar",
    height: 220,
    series: [
      {
        name: "Logs",
        data: attendances, //Presence per Class last week
      },
    ],
    options: {
      ...chartsConfig,
      colors: ["#0288d1", "#558b2f", "#009688", "#283593", "#fbc02d", "#ef6c00"],
      plotOptions: {
        bar: {
          columnWidth: "10%",
          borderRadius: 2,
          distributed: true
        },
      },
      xaxis: {
        ...chartsConfig.xaxis,
        categories: classNames,
      },
    },
  };

  const attendance = {
    color: "white",
    title: "Attendance By Grade",
    description: "Overall Monthly Perfomance",
    footer: "just updated",
    chart: classAttendance,
  }

  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        <StatisticsCard
          key={1}
          color='green'
          title="Present"
          value={presence ? presence : 0}
          icon={<UserGroupIcon className="w-6 h-6 text-white" />}
          footer={
            <Typography className="font-normal text-blue-gray-600">
              recent update
            </Typography>
          }
        />
        <StatisticsCard
          key={2}
          color='red'
          title="Absent"
          value={absent ? absent : 0}
          icon={<ExclamationCircleIcon className="w-6 h-6 text-white" />}
          footer={
            <Typography className="font-normal text-blue-gray-600">
              recent update
            </Typography>
          }
        />
        <StatisticsCard
          key={3}
          color='amber'
          title="Late Arrivals"
          value={late ? late : 0}
          icon={<ClockIcon className="w-6 h-6 text-white" />}
          footer={
            <Typography className="font-normal text-blue-gray-600">
              recent update
            </Typography>
          }
        />
        <StatisticsCard
          key={4}
          color='teal'
          title="Active Cards"
          value={activeCards ? activeCards : 0}
          icon={<CpuChipIcon className="w-6 h-6 text-white" />}
          footer={
            <Typography className="font-normal text-blue-gray-600">
              recent update
            </Typography>
          }
        />
      </div>
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-1 xl:grid-cols-2">
        <StatisticsChart
          key={weekData.title}
          {...weekData}
          footer={
            <Typography
              variant="small"
              className="flex items-center font-normal text-blue-gray-600"
            >
              <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
              &nbsp;{weekData.footer}
            </Typography>
          }
        />
        <StatisticsChart
          key={attendance.title}
          {...attendance}
          footer={
            <Typography
              variant="small"
              className="flex items-center font-normal text-blue-gray-600"
            >
              <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
              &nbsp;{attendance.footer}
            </Typography>
          }
        />
      </div>
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Classrooms
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
                <AcademicCapIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />
                <strong>{classes.length}</strong> registered rooms
              </Typography>
            </div>
            <Menu placement="left-start">
              <MenuHandler>
                <IconButton size="sm" variant="text" color="blue-gray">
                  <EllipsisVerticalIcon
                    strokeWidth={3}
                    fill="currentColor"
                    className="h-5 w-5"
                  />
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem><Link to={"/dashboard/attendance/students"}>View Details</Link></MenuItem>
              </MenuList>
            </Menu>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2 max-h-96">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Class Name", "Total Students", "Attendance"].map(
                    (el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-6 text-left stiky"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-medium uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {attendanceLog && Array.isArray(classes) && classes.map(
                  ({ grade, studentsCount, completion }, key) => {
                    const className = `py-3 px-5 ${key === classes.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                      }`;

                    return (
                      <tr key={grade}>
                        <td className={className}>
                          <div className="flex items-center gap-4">

                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {grade}
                            </Typography>
                          </div>
                        </td>

                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {studentsCount}
                          </Typography>
                        </td>
                        <td className={className}>
                          <div className="w-10/12">
                            <Typography
                              variant="small"
                              className="mb-1 block text-xs font-medium text-blue-gray-600"
                            >
                              {((attendanceLog[grade] / studentsCount) * 100).toFixed()}%
                            </Typography>
                            <Progress
                              value={
                                attendanceLog[grade] && studentsCount
                                  ? Math.round((attendanceLog[grade] / studentsCount) * 100) // Ensure it's a number
                                  : 0 // Fallback value
                              }
                              variant="gradient"
                              color={
                                attendanceLog[grade] && studentsCount
                                  ? Math.round((attendanceLog[grade] / studentsCount) * 100) === 100
                                    ? "green"
                                    : (Math.round((attendanceLog[grade] / studentsCount) * 100) <= 100 && Math.round((attendanceLog[grade] / studentsCount) * 100) >= 50) ? ("blue") : ("red")
                                  : "blue" // Default color if no valid value
                              }
                              className="h-1"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Real-Time Logs
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >
              <ArrowUpIcon
                strokeWidth={3}
                className="h-3.5 w-3.5 text-green-500"
              />
              current updates
            </Typography>
          </CardHeader>
          <HomeNotifications />
        </Card>
      </div>
    </div>
  );
}

export default Home;
