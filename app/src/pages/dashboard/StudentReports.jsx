import React, { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Select,
  Option,
  Avatar,
  Button,
  CardFooter
} from "@material-tailwind/react";
import { Pie } from "react-chartjs-2";
import { ArrowDownTrayIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/context/AuthContext";
import { useReportData, useStudentsData } from "@/data";
import generatePDF from "react-to-pdf";
import { Doughnut } from "react-chartjs-2";
import { UserIcon, PhoneIcon } from "@heroicons/react/24/outline";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS modules
ChartJS.register(ArcElement, Tooltip, Legend);

export function StudentReports() {
  const { currentUser } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const { report } = useReportData(selectedMonth, selectedYear);
  const reportRef = useRef();

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const { student } = useStudentsData(searchQuery);

  const data = {
    labels: ["Present", "Late", "Absent"],
    datasets: [
      {
        data: [
          parseFloat(student?.present), // Convert strings to numbers
          parseFloat(student?.late),
          parseFloat(student?.absent),
        ],
        backgroundColor: ["#4CAF50", "#FF9800", "#F44336"], // Colors for Present, Late, Absent
        hoverBackgroundColor: ["#45A149", "#F4A641", "#D9392F"],
        borderWidth: 1,
      },
    ],
  };


  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const generatedDate = new Date().toLocaleDateString();

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const years = Array.from(
    { length: currentYear - 2020 + 1 },
    (_, i) => 2020 + i
  );

  const isMonthDisabled = (month) =>
    selectedYear === currentYear && month > currentMonth;

  const pieData = {
    labels: [`Male - ${((report?.totalMales / report?.totalStudents) * 100).toFixed(1)}%`, `Female - ${((report?.totalFemales / report?.totalStudents) * 100).toFixed(1)}%`],
    datasets: [
      {
        data: [
          ((report?.totalMales / report?.totalStudents) * 100).toFixed(1) || 0,
          ((report?.totalFemales / report?.totalStudents) * 100).toFixed(1) || 0,
        ],
        backgroundColor: ["#92C5F9", "#B6A6E9"],
        hoverBackgroundColor: ["#4394E5", "#876FD4"],
      },
    ],
  };

  return (
    <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6">
      {student && (
        <>
          <Typography variant="h5" className="font-bold font-['Nunito']">
            Student Analysis
          </Typography>
          <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-md">
            <div className="flex items-center mb-6">
              <UserIcon className="h-10 w-10 text-blue-500" />
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-800 font-['Nunito']">{student.name}</h2>
                <p className="text-gray-500 font-['Nunito']">{student.studentID}</p>
              </div>
            </div>

            <div className="flex items-center mb-6 justify-between">
              <span className="text-gray-700 text-sm mt-2 flex flex-col">
                <p className="font-bold font-['Nunito'] text-black">Attendance Breakdown</p>
                <div className="flex flex-col">
                  <p>{student.present} Present</p>
                  <p>{student.late} Late</p>
                  <p>{student.absent} Absent</p>
                </div>
              </span>
              <div className="w-40 h-40">
                <Doughnut data={data} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p className="font-medium">Grade:</p>
                <p>{student.grade}</p>
              </div>
              <div>
                <p className="font-medium">Gender:</p>
                <p>{student.gender}</p>
              </div>
              <div>
                <p className="font-medium">Contact:</p>
                <div className="flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4 text-gray-500" />
                  <span>{student.contact}</span>
                </div>
              </div>
              <div>
                <p className="font-medium">Card Active:</p>
                <p className={student.cardActive ? "text-green-600" : "text-red-600"}>
                  {student.cardActive ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
      <Typography variant="h5" className="font-bold font-['Nunito']">
        Attendance Report
      </Typography>
      <div className="flex gap-4 flex-col lg:flex-row max-w-sm">
        <Select
          label="Select Month"
          value={selectedMonth.toString()}
          onChange={(value) => setSelectedMonth(value)}
          className="w-full"
        >
          {months.map(({ value, label }) => (
            <Option
              key={value}
              value={label}
              disabled={isMonthDisabled(value)}
            >
              {label}
            </Option>
          ))}
        </Select>

        <Select
          label="Select Year"
          value={selectedYear.toString()}
          onChange={(value) => setSelectedYear(Number(value))}
          className="w-full"
        >
          {years.map((year) => (
            <Option key={year} value={year.toString()}>
              {year}
            </Option>
          ))}
        </Select>
      </div>

      {report && selectedMonth && selectedYear && (
        <>
          <Card className="p-4 shadow-lg" ref={reportRef}>
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="m-0 flex items-center justify-between p-5"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Avatar
                    src={
                      (currentUser && currentUser.user_metadata.profile) ||
                      `/img/no-profile.jpg`
                    }
                    alt={
                      currentUser?.user_metadata.displayName || currentUser.email
                    }
                    size="md"
                    variant="rounded"
                    className="rounded-lg shadow-blue-gray-500/40"
                  />
                  <Typography
                    variant="h5"
                    color="blue-gray"
                    className="mb-1 font-['Nunito'] font-bold"
                  >
                    {currentUser.user_metadata.displayName}
                  </Typography>
                </div>
                <Typography
                  variant="small"
                  className="flex items-center gap-1 font-normal text-blue-gray-600 font-['Nunito']"
                >
                  Students Attendance Report
                </Typography>
              </div>
            </CardHeader>

            <CardBody className="space-y-6">
              <div>
                <Typography
                  variant="h6"
                  className="font-['Nunito'] font-semibold mb-2 text-black"
                >
                  Report Details
                </Typography>
                <Typography className="text-gray-700 font-['Nunito'] font-normal">
                  Report for {selectedMonth}{" "}
                  {selectedYear}
                </Typography>
                <Typography className="text-gray-700 font-['Nunito'] font-medium">
                  Generated on: {generatedDate}
                </Typography>
              </div>

              <div className="mt-6">
                <Typography
                  variant="h6"
                  className="font-['Nunito'] font-semibold text-black"
                >
                  Overview
                </Typography>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                  <div className="p-4 rounded-lg shadow-md flex items-center bg-gray-50">
                    <div className="space-y-2">
                      <div>
                        <Typography className="text-gray-700 font-['Nunito']">
                          <strong className="font-medium">
                            Total Students:
                          </strong>{" "}
                          {report?.totalStudents || 0}
                        </Typography>
                      </div>
                      <div>
                        <Typography className="text-gray-700 font-['Nunito']">
                          <strong className="font-medium">
                            Male:
                          </strong>{" "}
                          {report?.totalMales || 0}
                        </Typography>
                      </div>
                      <div>
                        <Typography className="text-gray-700 font-['Nunito']">
                          <strong className="font-medium">
                            Female:
                          </strong>{" "}
                          {report?.totalFemales || 0}
                        </Typography>
                      </div>
                      <div>
                        <Typography className="text-gray-700 font-['Nunito']">
                          <strong className="font-medium">
                            On-Time Arrivals:
                          </strong>{" "}
                          {report?.attendances || 0}
                        </Typography>
                      </div>
                      <div>
                        <Typography className="text-gray-700 font-['Nunito']">
                          <strong className="font-medium">
                            Late Arrivals:
                          </strong>{" "}
                          {report?.lateArrivals || 0}
                        </Typography>
                      </div>
                      <div>
                        <Typography className="text-gray-700 font-['Nunito']">
                          <strong className="font-medium">Absences:</strong>{" "}
                          {report?.absences || 0}
                        </Typography>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg h-80 flex items-center justify-center">
                    <Pie data={pieData} />
                  </div>
                </div>
              </div>

              {/* Detailed Table */}
              <div className="mt-6 overflow-x-auto">
                <Typography variant="h6" className="mb-2 font-['Nunito'] font-semibold">
                  Detailed Report
                </Typography>
                <table className="w-full min-w-[640px] table-auto border">
                  <thead>
                    <tr>
                      {['Class', 'Total Students', 'Male', 'Female', 'Presence', 'Late', 'Absence'].map((el) => (
                        <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                          <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                            {el}
                          </Typography>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(report?.metadata) &&
                      report.metadata
                        .slice() // Create a shallow copy of the array to avoid mutating the original
                        .sort((a, b) => {
                          // Sorting by `data.class`, assuming it's a string
                          if (a.class < b.class) return -1; // Sort in ascending order
                          if (a.class > b.class) return 1;
                          return 0;
                        })
                        .map((data, index) => (
                          <tr key={index}>
                            <td className="px-6 py-2 border-b border-gray-200">{data.class}</td>
                            <td className="px-6 py-2 border-b border-gray-200">{data.totalStudents}</td>
                            <td className="px-6 py-2 border-b border-gray-200">{data.male}</td>
                            <td className="px-6 py-2 border-b border-gray-200">{data.female}</td>
                            <td className="px-6 py-2 border-b border-gray-200">{data.attendances}</td>
                            <td className="px-6 py-2 border-b border-gray-200">{data.late}</td>
                            <td className="px-6 py-2 border-b border-gray-200">{data.absences}</td>
                          </tr>
                        ))}
                  </tbody>

                </table>
              </div>
            </CardBody>
            <CardFooter className="border-t border-gray-200 mt-4 bottom-0">
              <Typography variant="small" color="gray">
                This report is generated for institutional use only and provides an
                accurate summary of students attendance.
              </Typography>
            </CardFooter>
            <div className="watermark text-center mt-8">
              <p style={{ opacity: 0.1, fontSize: "24px" }} className="font-['Aquire']">ATS</p>
            </div>
          </Card>
          <div className="hidden gap-4 mt-4 lg:flex">
            <Button
              variant="filled"
              color="blue"
              className="flex items-center gap-2"
              onClick={() => generatePDF(reportRef, { filename: `ATS_Monthly_Report_${report?.month}_${selectedYear}.pdf` })}
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              Download PDF
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
