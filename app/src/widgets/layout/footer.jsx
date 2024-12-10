import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";

export function Footer({
  brandName= "Limitify",
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="py-2 bottom-0">
      <div className="flex w-full items-center justify-center px-2 font-['Nunito']">
        <Typography variant="small" className="font-normal text-inherit">
          ATS &copy; {year} Powered by Limitify 
        </Typography>
      </div>
    </footer>
  );
}



Footer.propTypes = {
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
};

Footer.displayName = "/src/widgets/layout/footer.jsx";

export default Footer;
