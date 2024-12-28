import PropTypes from "prop-types";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { XMarkIcon, ChevronUpIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";

export function Sidenav({ brandImg = "/img/ATS.png", brandName = "ATS", routes, onLogOutClick }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;

  // Track open state per menu item by name or index
  const [openMenu, setOpenMenu] = React.useState({});

  // Toggle specific menu open state
  const toggleMenu = (menuName) => {
    setOpenMenu((prevState) => ({
      ...prevState,
      [menuName]: !prevState[menuName],
    }));
  };

  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };
  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${openSidenav ? "translate-x-0" : "-translate-x-80"
        } fixed inset-0 z-50 flex flex-col my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100 
    sm:w-56 md:w-64 xl:w-72`}
    >
      <div className="relative">
        <div className="py-6 px-8 text-center flex gap-3 cursor-default">
          <img src={brandImg} alt="Logo" width="25px" height="15px" className="object-contain" />
          <Typography
            variant="h4"
            color={sidenavType === "dark" ? "white" : "blue-gray"}
            className="font-['Aquire'] font-bold"
          >
            {brandName}
          </Typography>
        </div>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className={sidenavType === "dark" ? "h-5 w-5 text-white" : "h-5 w-5 text-black"} />
        </IconButton>
      </div>
      <div className="m-4 overflow-y-auto grow">
        {routes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="mb-4 flex flex-col gap-1">
            {title && (
              <li className="mx-3.5 mt-4 mb-2">
                <Typography
                  variant="small"
                  color={sidenavType === "dark" ? "white" : "blue-gray"}
                  className="font-black uppercase opacity-75"
                >
                  {title}
                </Typography>
              </li>
            )}
            {pages.map(({ icon, name, path, menu, menuList }) => (
              menu ? (
                <Menu
                  key={name}
                  placement="right-start"
                  open={openMenu[name] || false}
                  handler={() => toggleMenu(name)}
                  offset={15}
                >
                  <MenuHandler className={`flex items-center justify-between p-3 ${sidenavType === "dark" ? "hover:bg-opacity-20" : ""} `}>
                    <MenuItem>
                      <li className={`flex gap-4 ${sidenavType === "dark"
                        ? "text-white"
                        : "text-blue-gray-500"} font-normal font-['Nunito'] items-center`}>
                        {icon}
                        <Typography color="inherit" className="font-normal font-['Nunito'] capitalize">
                          {name}
                        </Typography>
                      </li>
                      <ChevronUpIcon
                        strokeWidth={2.5}
                        className={`h-3.5 w-3.5 transition-transform ${openMenu[name] ? "rotate-90" : ""
                          } ${sidenavType === "dark" ? "text-white" : "text-blue-gray-500"}`}
                      />
                    </MenuItem>
                  </MenuHandler>
                  <MenuList>
                    {menuList.map(({ name: subName, path: subPath }) => (
                      <NavLink to={`/${layout}${subPath}`} key={subName} className={"border-none"}>
                        {({ isActive }) => (
                          <Button
                            variant={isActive ? "gradient" : "text"}
                            color={
                              isActive
                                ? sidenavColor
                                : (sidenavType === "dark"
                                  ? ("blue-gray")
                                  : ("white"))
                            }
                            className={`flex items-center gap-4 px-4 capitalize ${isActive
                              ? sidenavColor
                              : "text-blue-gray-500"
                              }`}
                            fullWidth
                          >
                            <Typography color="inherit" className={`font-normal capitalize font-['Nunito']`}>
                              {subName}
                            </Typography>
                          </Button>
                        )}
                      </NavLink>
                    ))}
                  </MenuList>
                </Menu>
              ) : (
                <li key={name}>
                  <NavLink to={`/${layout}${path}`}>
                    {({ isActive }) => (
                      <Button
                        variant={isActive ? "gradient" : "text"}
                        color={
                          isActive
                            ? sidenavColor
                            : (sidenavType === "dark"
                              ? ("white")
                              : ("blue-gray"))
                        }
                        className="flex items-center gap-4 px-4 capitalize"
                        fullWidth
                      >
                        {icon}
                        <Typography color="inherit" className="font-normal font-['Nunito'] capitalize">
                          {name}
                        </Typography>
                      </Button>
                    )}
                  </NavLink>
                </li>
              )
            ))}
          </ul>
        ))}
        <Button
          variant="text"
          color="red"
          onClick={onLogOutClick}
          className="flex items-center gap-4 px-4 capitalize"
          fullWidth
        >
          <ArrowRightStartOnRectangleIcon className="w-5 h-5 text-inherit" />
          <Typography color="inherit" className="font-normal capitalize font-['Nunito']">
            Log Out
          </Typography>
        </Button>
      </div>
    </aside>
  );
}



Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidnave.jsx";

export default Sidenav;
