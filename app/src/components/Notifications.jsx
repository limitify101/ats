import React, { useEffect, useState } from "react";
import {
  PlusCircleIcon,
  CreditCardIcon,
  ExclamationCircleIcon,
  ArrowPathRoundedSquareIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import { Typography } from "@material-tailwind/react"; // Adjust import paths as needed
import { useNotifications } from "@/data";
import {CardBody} from "@material-tailwind/react";

const formatDateRange = (startDate, endDate) => {
  
    try {
      // Convert the date strings into a valid ISO 8601 format
      const formattedStartDate = startDate?.replace(" ", "T");
      const formattedEndDate = endDate?.replace(" ", "T");
      // Parse the dates into Date objects
      const start = new Date(formattedStartDate);
      const end = new Date(formattedEndDate);
  
      // Check for invalid dates
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return "Invalid date range";
      }
  
      // Format the date and time
      const formattedDate = start.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      });
  
      const formattedStartTime = start.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
  
      const formattedEndTime = end.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
  
      return `${formattedDate} ${formattedStartTime}-${formattedEndTime}`;
    } catch (error) {
      console.error("Error formatting date range:", error);
      return "Invalid date range";
    }
  };
  
  
  const HomeNotifications = () => {
    const { nextLog } = useNotifications(); // Fetch `nextLog` from the custom hook
    const [notifications, setNotifications] = useState([]); // State to store notifications
  
    useEffect(() => {
      // Ensure `nextLog` is valid before processing
      if (!nextLog || typeof nextLog !== "object") {
        setNotifications([]); // Clear notifications if `nextLog` is invalid
        return;
      }
  
      // Prepare the data structure for notifications
      const overviewData = [
        {
          icon: ExclamationCircleIcon,
          color: "text-red-500",
          title: "Unauthorized RFID Card Detected",
          description: "22 DEC 7:20 AM",
          isActive: false,
        },
        {
          icon: PlusCircleIcon,
          color: "text-green-500",
          title: "RFID Cards assigned to students",
          description: "21 DEC 11 PM",
          isActive: false,
        },
        {
          icon: ArrowPathRoundedSquareIcon,
          color: "text-blue-gray-300",
          title: "Students Logging Schedule",
          description: nextLog.initializeAttendance && nextLog.setAbsent
            ? formatDateRange(nextLog.initializeAttendance, nextLog.setAbsent)
            : "N/A",
          isActive: !!nextLog.initializeAttendance && !!nextLog.setAbsent,
        },
        {
          icon: CreditCardIcon,
          color: "text-blue-500",
          title: "New card added for student with ID STD-409",
          description: "20 DEC 2:20 AM",
          isActive: false,
        },
        {
          icon: ExclamationTriangleIcon,
          color: "text-orange-300",
          title: "System Maintenance",
          description: "17 DEC",
          isActive: false,
        },
      ];
  
      // Update state with the processed notifications
      setNotifications(overviewData);
    }, [nextLog]); // React to changes in `nextLog`
  
  

  return (
    <CardBody className="pt-0 max-h-96 overflow-y-scroll">
      {notifications.filter((notification) => notification.isActive).map(({ icon, color, title, description }, key) => (
        <div key={description} className="flex items-start gap-4 py-3">
          <div
            className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${
              key === notifications.length - 1 ? "after:h-0" : "after:h-4/6"
            }`}
          >
            {React.createElement(icon, {
              className: `!w-5 !h-5 ${color}`,
            })}
          </div>
          <div>
            <Typography
              variant="small"
              className={`block font-medium ${color}`}
            >
              {title}
            </Typography>
            <Typography
              as="span"
              variant="small"
              className="text-xs font-medium text-blue-gray-500"
            >
              {description}
            </Typography>
          </div>
        </div>
      ))}
    </CardBody>
  );
};

export default HomeNotifications;
