import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
} from "@/context";

export function WelcomeNavbar({
  brandName= "ATS",
  routes= [
    { name: "About", path: "#about", id: "about" },
    { name: "Contact", path: "#contact", id: "contact" },
  ],
}) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const navigate = useNavigate();  // Hook to navigate programmatically
  const [scrolling, setScrolling] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const navbarHeight = document.querySelector("nav")?.offsetHeight || 0;
  // Track scrolling position
  useEffect(() => {
    const handleScroll = () => {
      const correctedScrollY = window.scrollY - navbarHeight;
      if (correctedScrollY > 50) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navbarHeight]);

  // Detect which section is currently in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          
          if (entry.isIntersecting) {
            if (entry.target.id !== "home") {
              setActiveLink(entry.target.id);
              navigate(`#${entry.target.id}`, { replace: true });
            }
          }
        });
      },
      {
        threshold: 1, 
      }
    );

    // Observe each section
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => observer.observe(section));

    // Clean up the observer on component unmount
    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [navigate]);

  // Special case for 'Home' link when user is at the top of the page
  useEffect(() => {
    if (pathname === "/" || pathname === "") {
      setActiveLink("home");
      navigate("/",{replace:true})
    }
  }, [pathname, navigate]);

  return (
    <Navbar
      color={scrolling ? "white" : "transparent"}
      className={`transition-all fixed top-0 z-40 px-8 py-2 ${scrolling ? "bg-black bg-opacity-90" : ""}`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Typography as="a" href="#home" variant="h4" className="font-['Aquire'] bg-gradient-to-r from-white/40 via-white/60 to-white/80 bg-clip-text" style={{ WebkitTextFillColor: "transparent" }}>
            {brandName}
          </Typography>
        </div>
        <div className="flex items-center space-x-2">
          <ul className="flex items-center gap-4">
            {routes.map(({ name, path, id }) => (
              <li key={name}>
                <Typography
                  as="a"
                  href={path}
                  variant="h6"
                  className={`py-0.5 px-1 text-inherit transition-colors hover:text-blue-gray-500 font-['Nunito'] font-light ${activeLink === id ? "text-blue-gray-500" : ""}`}
                >
                  {name}
                </Typography>
              </li>
            ))}
          </ul>
          <Link to="/auth/login">
            <Button
              variant="text"
              color="blue-gray"
              className="hidden items-center gap-1 px-4 xl:flex normal-case font-['Nunito'] font-normal"
            >
              <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
              Log In
            </Button>
            <IconButton
              variant="text"
              color="blue-gray"
              className="grid xl:hidden"
            >
              <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
            </IconButton>
          </Link>
        </div>
      </div>
    </Navbar>
  );
}

WelcomeNavbar.propTypes = {
  brandName: PropTypes.string,
  brandLink: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
};

WelcomeNavbar.displayName = "/src/widgets/layout/welcome-navbar.jsx";

export default WelcomeNavbar;
