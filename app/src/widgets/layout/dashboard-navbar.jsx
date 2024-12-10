import { useLocation, Link } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Avatar,
} from "@material-tailwind/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  useMaterialTailwindController,
  setOpenSidenav,
} from "@/context";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
export function DashboardNavbar({ user }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const [searchData, setSearchData] = useState(null);
  const searchRef = useRef();
  const navigate = useNavigate()

  const handleSearchData = (e) => {
    e.preventDefault();
    setSearchData(searchRef.current.value);
  }

  const handleSubmit = () => {
    const query = searchData;
    navigate(`/dashboard/reports/students?search=${query}`);
  }

  return (
    <Navbar
      color="transparent"
      className="rounded-xl transition-all px-0 py-1"
      fullWidth
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center p-4">
        <div className="capitalize">
          <Breadcrumbs
            className="bg-transparent p-0 transition-all"
          >
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal opacity-50"
            >
              {layout}
            </Typography>

            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal"
            >
              {page}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6" color="blue-gray" className="uppercase">
            {page}
          </Typography>
        </div>
        <div className="flex items-center">
          <div className="mr-auto md:mr-4 md:w-56 flex items-center border justify-between px-2 rounded-md border-blue-gray-100">
            <input id="search" placeholder="Search" name="search" ref={searchRef} onChange={(value) => handleSearchData(value)} className="p-1 bg-transparent outline-none text-blue-gray-800 font-['Roboto'] font-thin text-sm flex-1" />
            <MagnifyingGlassIcon className="w-4 h-4 text-blue-gray-200 cursor-pointer" strokeWidth={1} onClick={() => handleSubmit()} />
          </div>
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={2} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>
          <Link to="/dashboard/profile">
            <Button
              variant="text"
              color="blue-gray"
              className="hidden items-center gap-1 px-4 xl:flex normal-case font-['Nunito'] font-normal"
            >
              {/* <UserCircleIcon className="h-5 w-5 text-blue-gray-500" /> */}
              <Avatar
                src={user && user.profile || `/img/no-profile.jpg`}
                alt="item-1"
                size="xs"
                variant="circular"
              />
              {user?.displayName}
            </Button>
            <IconButton
              variant="text"
              color="blue-gray"
              className="grid xl:hidden"
            >
              {/* <UserCircleIcon className="h-5 w-5 text-blue-gray-500" /> */}
              <Avatar
                src={user && user.profile || `/img/no-profile.jpg`}
                alt="item-1"
                size="xs"
                variant="circular"
                className="w-5 h-5"
              />
            </IconButton>
          </Link>
          {/* <Menu>
            <MenuHandler>
              <IconButton variant="text" color="blue-gray">
                <BellIcon className="h-5 w-5 text-blue-gray-500" />
              </IconButton>
            </MenuHandler>
            <MenuList className="w-max border-0">
              <MenuItem className="flex items-center gap-3">
                <Avatar
                  src="/img/no-profile.jpg"
                  alt="item-1"
                  size="sm"
                  variant="circular"
                />
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    <strong>New message</strong> from Laur
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 13 minutes ago
                  </Typography>
                </div>
              </MenuItem>
              <MenuItem className="flex items-center gap-4">
                <Avatar
                  src="https://demos.creative-tim.com/material-dashboard/assets/img/small-logos/logo-spotify.svg"
                  alt="item-1"
                  size="sm"
                  variant="circular"
                />
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    <strong>New album</strong> by Travis Scott
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 1 day ago
                  </Typography>
                </div>
              </MenuItem>
              <MenuItem className="flex items-center gap-4">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-blue-gray-800 to-blue-gray-900">
                  <CreditCardIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    Payment successfully completed
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 2 days ago
                  </Typography>
                </div>
              </MenuItem>
            </MenuList>
          </Menu> */}
          {/* <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setOpenConfigurator(dispatch, true)}
          >
            <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
          </IconButton> */}
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
