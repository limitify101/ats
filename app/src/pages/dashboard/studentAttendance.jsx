import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Select,
  Option,
  Menu,
  MenuItem,
  MenuHandler,
  MenuList,
  IconButton,
  Button,
  Avatar
} from "@material-tailwind/react";
import { CheckCircleIcon, EllipsisVerticalIcon, EyeIcon, ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { useClassData, useClassAttendanceData } from "@/data";
import dayjs from "dayjs";
import { updateAttendance } from "@/utils/ApiUtils";
import { useAuth } from "@/context/AuthContext";
import generatePDF, { Resolution, Margin } from "react-to-pdf";
export function StudentAttendance() {
  const { currentUser } = useAuth();
  const { classes } = useClassData();
  const [value, setValue] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs().toDate());
  const { classAttendance } = useClassAttendanceData(selectedDate);
  const fileRef = useRef();
  const [hoveredStatus, setHoveredStatus] = useState(null);
  const [isBulkEditable, setIsBulkEditable] = useState(false);
  const [studentEdits, setStudentEdits] = useState({});
  const [editedRows, setEditedRows] = useState(new Set());
  const [classData, setClassData] = useState([]);

  const selectedClass = classes.filter((c) => c.grade === value)[0] || null;
  const memoizedClassAttendance = useMemo(() => classAttendance, [classAttendance]);

  const options = {
    method: 'save',
    resolution: Resolution.HIGH,
    page: {
      margin: Margin.LARGE,
      format: '',
      orientation: 'portrait',
    },
    canvas: {
      mimeType: 'image/png',
      qualityRatio: 1
    },
    overrides: {
      pdf: {
        compress: true
      },
      canvas: {
        useCORS: true
      }
    },
  };


  const totalStudents = selectedClass?.studentsCount || 0;

  useEffect(() => {
    const filteredClass = memoizedClassAttendance?.filter((c) => c.className === value) || [];
    setClassData((prevClassData) => {
      const isSame =
        prevClassData.length === filteredClass.length &&
        prevClassData.every((item, index) => item === filteredClass[index]);

      return isSame ? prevClassData : filteredClass;
    });
  }, [memoizedClassAttendance, value]);

  const handleStatusChange = (studentID, statusType) => {
    setStudentEdits((prev) => ({
      ...prev,
      [studentID]: { ...prev[studentID], status: statusType },
    }));
    setEditedRows((prev) => new Set(prev).add(studentID));
  };

  const notesRefs = useRef({});

  const handleRemarksChange = (studentID, notes) => {
    setStudentEdits((prev) => {
      const currentRemarks = prev[studentID]?.notes || notesRefs.current[studentID] || "";
      if (currentRemarks === notes) return prev;

      notesRefs.current[studentID] = notes;
      return {
        ...prev,
        [studentID]: { ...prev[studentID], notes },
      };
    });

    setEditedRows((prev) => new Set(prev).add(studentID));
  };

  const getStatusIcon = (status, studentID, statusType) => {
    const isHoveredStatus =
      hoveredStatus?.studentID === studentID && hoveredStatus?.statusType === statusType;

    const currentStatus = studentEdits[studentID]?.status || status;

    return (
      <CheckCircleIcon
        className={`h-5 w-5 ${currentStatus === statusType
          ? statusType === "present"
            ? "text-green-500"
            : statusType === "absent"
              ? "text-red-500"
              : "text-amber-500"
          : isHoveredStatus
            ? "text-gray-400"
            : "hidden"
          }`}
        aria-hidden="true"
      />
    );
  };

  const handleSaveAll = async () => {
    const updatedClassData = classData.map((classItem) => ({
      ...classItem,
      students: classItem.students.map((student) =>
        studentEdits[student.studentID]
          ? { ...student, ...studentEdits[student.studentID] }
          : student
      ),
    }));

    setClassData(updatedClassData);
    setStudentEdits({});
    setEditedRows(new Set());
    setIsBulkEditable(false);
    const data = {
      ...updatedClassData,
      date: dayjs(selectedDate).format("YYYY-MM-DD"),
    };
    try {
      await updateAttendance(data, currentUser?.id);
    } catch (error) {
      throw error;
    }

  };

  const handleCancelEdit = () => {
    setStudentEdits({});
    setEditedRows(new Set());
    setIsBulkEditable(false);
  };

  const handleDateChange = (e) => {
    const date = dayjs(e.target.value).toDate();
    if (date <= dayjs().toDate()) {
      setSelectedDate(date);
    }
  };

  const formatSelectedDate = () => {
    const today = dayjs();
    const selected = dayjs(selectedDate);

    if (selected.isSame(today, "day")) {
      return `Today ${selected.format("MMM D, YYYY")}`;
    } else if (selected.isSame(today.subtract(1, "day"), "day")) {
      return `Yesterday ${selected.format("MMM D, YYYY")}`;
    } else {
      return selected.format("MMM D, YYYY");
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Typography variant="h5" className="font-bold font-['Nunito']">
          Class Attendance
        </Typography>
        <div className="flex items-center gap-4 justify-end">
          <Typography variant="small" className="font-semibold font-['Nunito']">
            {formatSelectedDate()}
          </Typography>
          <div className="w-72">
            <Input
              type="date"
              onChange={handleDateChange}
              value={dayjs(selectedDate).format("YYYY-MM-DD")}
              max={dayjs().format("YYYY-MM-DD")}
              className="border rounded px-2 py-1 text-sm font-['Nunito']"
            />
          </div>
        </div>
      </div>

      <div className="w-72">
        <Select
          key={value}
          label="Select Classroom"
          value={value}
          onChange={(selectedValue) => setValue(selectedValue)}
        >
          {Array.isArray(classes) &&
            classes.map((classItem) => (
              <Option value={classItem.grade} key={classItem.grade}>
                {classItem.grade}
              </Option>
            ))}
        </Select>
      </div>
      {value && (
        <>
          <Card ref={fileRef}>
            <div>
              <div className="flex items-center gap-2 mb-1 mx-5 my-5">
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
                className="flex items-center gap-1 font-normal text-blue-gray-600 font-['Nunito'] mx-5"
              >
                Class Attendance on {dayjs(selectedDate).format("YYYY-MM-DD")}
              </Typography>
            </div>
            <CardHeader floated={false} shadow={false} color="transparent" className="m-0 flex p-6 flex-col w-full">
              <div className="w-full items-center justify-between flex">
                <Typography variant="h6" color="blue-gray" className="mb-1">
                  {value}
                </Typography>
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
                    <MenuItem onClick={() => setIsBulkEditable((prev) => !prev)}>
                      {isBulkEditable ? "Cancel" : "Edit"}
                    </MenuItem>
                    {isBulkEditable && <MenuItem onClick={handleSaveAll}>Save All Changes</MenuItem>}
                    {isBulkEditable && <MenuItem onClick={handleCancelEdit}>Leave Edit Mode</MenuItem>}
                  </MenuList>
                </Menu>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="font-normal font-['Nunito']">
                  Total Students: {totalStudents}
                </Typography>
              </div>
            </CardHeader>
            <CardBody className="overflow-x-scroll">
              <table className="w-full table-auto border">
                <thead>
                  <tr>
                    {["Student ID", "Name", "Present", "Absent", "Late", "Arrival Time", "Remarks"].map((el, index) => (
                      <th key={`${el}-${index}`} className="border-b border-blue-gray-50 py-3 px-1 text-left">
                        <Typography
                          variant="small"
                          className="text-[11px] font-bold uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {classData[0]?.students?.map((student, key) => {
                    const { studentID, studentName, status, arrivalTime, notes } = student;

                    const className = `py-2 px-2 ${key === classData[0]?.students?.length - 1 ? "" : "border-b border-blue-gray-50"
                      }`;

                    return (
                      <tr key={studentID}>
                        <td className={`${className} w-32`}>
                          <Typography variant="small" color="blue-gray" className="font-bold font-['Nunito']">
                            {studentID}
                          </Typography>
                        </td>
                        <td className={`${className}`}>
                          <Typography variant="small" color="blue-gray" className="font-['Nunito']">
                            {studentName}
                          </Typography>
                        </td>
                        {["present", "absent", "late"].map((statusType) => (
                          <td
                            key={statusType}
                            className={`${className} cursor-pointer`}
                            onMouseEnter={() => isBulkEditable && setHoveredStatus({ studentID, statusType })}
                            onMouseLeave={() => isBulkEditable && setHoveredStatus(null)}
                            onClick={() => isBulkEditable && handleStatusChange(studentID, statusType)}
                          >
                            {getStatusIcon(status, studentID, statusType)}
                          </td>
                        ))}
                        <td className={`${className} font-light font-['Nunito'] text-sm`}>{arrivalTime && dayjs(arrivalTime).format("HH:mm")}</td>
                        <td className={`${className}`}>
                          {isBulkEditable ? (
                            <Input
                              placeholder="Add notes"
                              value={studentEdits[studentID]?.notes ?? notesRefs.current[studentID] ?? notes ?? ""}
                              onChange={(e) => handleRemarksChange(studentID, e.target.value)}
                              className="resize-none border border-gray-300 rounded px-2 py-2 text-sm"
                            />
                          ) : (
                            <Typography variant="small" className="font-['Nunito']">
                              {notes && notes === "N/A" ? ("") : (notes) || "N/A"}
                            </Typography>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardBody>
            <div className="watermark text-center mt-8">
              <p style={{ opacity: 0.1, fontSize: "24px" }} className="font-['Aquire']">ATS</p>
            </div>
          </Card>
          <div className="hidden gap-4 mt-4 lg:flex">
            <Button
              variant="filled"
              color="blue"
              className="flex items-center gap-2"
              onClick={() => generatePDF(fileRef, { filename: `${value}_Attendance_${dayjs(selectedDate).format("YYYY-MM-DD")}.pdf` }, options)}
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

export default StudentAttendance;
