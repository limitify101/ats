import { useState ,useEffect} from "react";
import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import { Sidenav, DashboardNavbar, Configurator, Footer } from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import { motion } from "framer-motion";
import LogOut from "@/components/LogOut";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;

  const { currentUser, loading } = useAuth();  // Assuming useAuth gives us currentUser and loading state
  const [user, setUser] = useState(null);
  const [isLogOutModalOpen, setLogOutModalOpen] = useState(false);
  
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser.user_metadata);
    } else {
      setUser(null); 
    }
  }, [currentUser]); 

  if (loading || !user) {
    return (<LoadingScreen/>);
  }
  
  const toggleLogOutModal = () => setLogOutModalOpen(!isLogOutModalOpen);

  return (
    <motion.div
      className="min-h-screen flex flex-col bg-blue-gray-50/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Sidenav
        routes={routes}
        brandImg={sidenavType === "dark" ? "/img/ATS.png" : "/img/ATS_dark.png"}
        onLogOutClick={toggleLogOutModal}
      />

      {/* Main content area */}
      <div className="flex-1 xl:ml-80 flex flex-col">
        <DashboardNavbar user={user}/>

        {/* Configurator Button */}
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>

        {/* Routes */}
        <div className="flex-grow p-4">
          <Routes>
            {routes.map(({ layout, pages }, pageIndex) =>
              layout === "dashboard" &&
              pages.map(({ path, element, menu, menuList }, index) => (
                <React.Fragment key={index}>
                  {/* Route for top-level pages */}
                  <Route exact path={path} element={element} />

                  {/* Routes for menu items within each page, if they exist */}
                  {menu &&
                    menuList &&
                    menuList.map((subPage, subIndex) => (
                      <Route
                        key={`${index}-${subIndex}`}
                        exact
                        path={subPage.path}
                        element={subPage.element}
                      />
                    ))}
                </React.Fragment>
              ))
            )}
          </Routes>
        </div>
        {/* Footer */}
        <div className="mt-auto flex justify-center items-center">
        <div className="w-full max-w-screen-xl p-2">
          <Footer />
        </div>
      </div>
      </div>

      {/* LogOut Modal */}
      {isLogOutModalOpen && <LogOut onClose={() => setLogOutModalOpen(false)} isOpen={isLogOutModalOpen} />}
    </motion.div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;


