import { Routes, Route } from "react-router-dom";
import {
  ChartPieIcon,
  UserIcon,
  UserPlusIcon,
  
} from "@heroicons/react/24/solid";
import { Navbar, Footer } from "@/widgets/layout";
import {globalRoutes} from "@/routes";
import {motion} from "motion/react"
export function Auth() {
  const navbarRoutes = [
    {
      name: "dashboard",
      path: "/dashboard/home",
      icon: ChartPieIcon,
    },
    {
      name: "profile",
      path: "/dashboard/home",
      icon: UserIcon,
    },
    {
      name: "sign up",
      path: "/auth/sign-up",
      icon: UserPlusIcon,
    },
  ];

  return (
    <motion.div className="relative min-h-screen w-full" initial={{ opacity: 0, y: 20 }}
    animate={{
      opacity: 1,
      y: 0,
    }}
    transition={{ duration: 0.5 }}>
      <Routes>
        {globalRoutes.map(
          ({ layout, pages }) =>
            layout === "auth" &&
            pages.map(({ path, element }) => (
              <Route exact path={path} element={element} />
            ))
        )}
      </Routes>
    </motion.div>
  );
}

Auth.displayName = "/src/layout/Auth.jsx";

export default Auth;
