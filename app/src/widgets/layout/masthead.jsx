import { useMaterialTailwindController } from "@/context";
import propTypes from "prop-types";

export function Masthead({
  brandName="ATS",
  brandDesc="Attendance Tracking System"
}){
    const[controller,dispatch]=useMaterialTailwindController();

    return(
        <section className="relative w-full min-h-screen py-[15rem] bg-cover bg-center bg-no-repeat bg-scroll "
        style={{ backgroundImage: "url('/img/bg-masthead.jpg')" }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex h-full items-center justify-center" id="home">
          <div className="text-center text-white mt-10">
            <h1 className="mx-auto my-0 text-5xl bg-clip-text font-bold font-['Aquire']"
      style={{
        // Replace with your actual font-family or extend in Tailwind config
        backgroundImage: "linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 1))",
        WebkitTextFillColor: "transparent", // Ensures the text color is transparent and the gradient is visible
      }}>ATS</h1>
            <h2 className="mt-4 text-xl opacity-75 mb-5 font-['Nunito']">Attendance Tracking System</h2>
            <a href="#about" className="font-['Varela_Round'] mt-6 inline-block py-2 px-6 text-white bg-blue-gray-800 rounded-md hover:bg-opacity-70 transition duration-300">
              Get Started
            </a>
          </div>
        </div>
      </section>
    )
}

Masthead.propTypes = {
    brandName:propTypes.string,
    brandDesc:propTypes.string,
};

Masthead.displayName = "/src/widgets/layout/masthead.jsx";

export default Masthead;