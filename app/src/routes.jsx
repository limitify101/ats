import {
  HomeIcon,
  UserCircleIcon,
  CpuChipIcon,
  ChartBarIcon,
  UserPlusIcon,
  CubeTransparentIcon,

} from "@heroicons/react/24/solid";
import { Home, Profile, StudentAttendance, StaffAttendance, Reports, RFID, StudentRegister, StudentReports } from "@/pages/dashboard";

import StaffRegister from "./pages/dashboard/staffRegister";
import { SignIn, SignUp, VerifyEmail } from "./pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    title: "Overview",
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
  {
    title: "Attendance",
    layout: "dashboard",
    pages: [
      {
        icon: <CubeTransparentIcon {...icon} />,
        name: "Records",
        menu: true,
        menuList: [{
          name: "Students Log",
          path: "/attendance/students",
          element: <StudentAttendance />
        }, {
          name: "Staff Log",
          path: "/attendance/staff",
          element: <StaffAttendance />
        }]
      },
    ]
  },
  {
    title: "Tools",
    layout: "dashboard",
    pages: [
      {
        icon: <CpuChipIcon {...icon} />,
        name: "Setup",
        path: "/card",
        element: <RFID />,
      },
      {
        icon: <UserPlusIcon {...icon} />,
        name: "Register",
        menu: true,
        menuList: [{
          name: "Students",
          path: "/register/students",
          element: <StudentRegister />
        }, {
          name: "Staff",
          path: "/register/staff",
          element: <StaffRegister />
        }]
      },
    ],
  },
  {
    title: "Reports & Analytics",
    layout: "dashboard",
    pages: [
      {
        icon: <ChartBarIcon {...icon} />,
        name: "Insights",
        path: "/reports",
        menu: true,
        menuList: [{
          name: "Students Report",
          path: "/reports/students",
          element: <StudentReports />
        }, {
          name: "Staff Report",
          path: "/reports/staff",
          element: <Reports />
        }]
      },
    ]
  },
];
export const globalRoutes = [{
  title: "Authentication",
  layout: "auth",
  pages: [
    {
      name: "sign up",
      path: "/sign-up",
      element: <SignUp />
    },
    {
      name: "log in",
      path: "/login",
      element: <SignIn />
    },
    {
      name: "verify email",
      path: "/verify-email",
      element: <VerifyEmail />
    }
  ],
}];
export default routes;
