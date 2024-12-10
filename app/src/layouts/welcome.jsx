import React, { useRef, useState } from 'react'
import { motion } from "motion/react"
import { Masthead, WelcomeNavbar } from '@/widgets/layout';

export function Welcome() {
  const year = new Date().getFullYear();
  const inputRef = useRef();
  const [email, setEmail] = useState(null);
  const [status, setStatus] = useState(null); // For feedback messages

  const handleEmail = (e) => {
    e.preventDefault();
    setEmail(inputRef.current.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      window.alert("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/v1/client/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      console.log(response);
      if (response.ok) {

        window.alert("Subscription sent successfully!");
        setEmail(""); // Clear the input
        return;

      } else {

        window.alert("Failed to send subscription request. Please try again.")
      }
    } catch (error) {
      console.error("Error:", error);
      window.alert("An error occured. Please try again.")
    }
  };
  return (
    <motion.div className='min-h-screen bg-transparent' id='home' initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{ duration: 0.5 }}>
      <WelcomeNavbar brandName={'ATS'} />
      <Masthead />
      {/* About Section */}
      <section
        className=" flex items-center justify-center text-center pt-40 bg-gradient-to-b from-black via-black/90 to-black/80"
        id="about"
      >
        <div className="container px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex justify-center gap-x-4 lg:gap-x-5">
            <div className="w-full lg:w-2/3 items-center justify-center">
              <h2 className="text-white mb-4 font-['Nunito'] text-3xl">ATS - Attendance Tracking System</h2>
              <p className="text-white/70 mb-20 font-['Nunito'] font-light">
                ATS (Attendance Tracking System) is an innovative solution for
                efficient attendance management in schools and organizations.
                Designed for quick and accurate check-ins, ATS enables real-time
                data collection and enhances accountability. Streamline your
                attendance process and create a more productive environment with
                this advanced system.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Register Section */}
      <section id="contact">
        <div className="py-20 text-white text-center bg-cover bg-center bg-no-repeat bg-fixed"
          style={{ backgroundImage: "url('/img/bg-signup.jpg')" }}>
          <div className="container mx-auto px-4 lg:px-8">
            <i className="far fa-paper-plane fa-2x mb-4"></i>
            <h2 className="text-3xl font-semibold mb-6 font-['Nunito']">Subscribe to get registered!</h2>
            <form className="w-full max-w-lg mx-auto" id="contactForm">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center font-['Nunito']">
                <input
                  className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white w-full sm:w-2/3 font-thin focus:outline-none focus:ring-1 focus:ring-blue-gray-200 transition duration-300"
                  id="emailAddress"
                  type="email"
                  placeholder="Enter email address..."
                  aria-label="Enter email address..."
                  ref={inputRef}
                  onChange={(value) => handleEmail(value)}
                />
                <button
                  className="mt-4 sm:mt-0 sm:ml-4 px-6 py-2 rounded-lg bg-blue-gray-800 text-white hover:bg-opacity-70 transition duration-300"
                  id="submitButton"
                  type="submit"
                  onClick={(event) => handleSubmit(event)}
                >
                  Notify Me!
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* Contact Section */}
        <div className="py-20 bg-black text-white font-['Nunito']">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-wrap justify-center gap-6">

              {/* Address Card */}
              <div className="w-full sm:w-1/3 lg:w-1/4">
                <div className="bg-gradient-to-b from-blue-gray-900 via-blue-gray-900/75 to-blue-gray-900/40 p-6 rounded-lg text-center">
                  <i className="fas fa-map-marked-alt text-primary mb-4"></i>
                  <h4 className="text-xl font-light">Address</h4>
                  <hr className="my-4 mx-auto w-16 border-t border-blue-500" />
                  <p className="text-sm font-thin">Kigali, Rwanda</p>
                </div>
              </div>
              {/* Email Card */}
              <div className="w-full sm:w-1/3 lg:w-1/4">
                <div className="bg-gradient-to-b from-blue-gray-900 via-blue-gray-900/75 to-blue-gray-900/40 p-6 rounded-lg text-center">
                  <i className="fas fa-envelope text-primary mb-4"></i>
                  <h4 className="text-xl font-light">Email</h4>
                  <hr className="my-4 mx-auto w-16 border-t border-blue-500" />
                  <p className="text-sm font-thin">
                    <a href="mailto:limitify.ai@gmail.com">limitify.ai@gmail.com</a>
                  </p>
                </div>
              </div>
              {/* Phone Card */}
              <div className="w-full sm:w-1/3 lg:w-1/4">
                <div className="bg-gradient-to-b from-blue-gray-900 via-blue-gray-900/75 to-blue-gray-900/40 p-6 rounded-lg text-center">
                  <i className="fas fa-mobile-alt text-primary mb-4"></i>
                  <h4 className="text-xl font-light">Phone</h4>
                  <hr className="my-4 mx-auto w-16 border-t border-blue-500" />
                  <p className="text-sm font-thin">+250 0793 109 171</p>
                </div>
              </div>

            </div>

            {/* Social Media Links */}
            <div className="flex justify-center mt-8">
              <a className="text-white mx-3" href="https://x.com/k4ldrick">
                <i className="fab fa-x-twitter"></i>
              </a>
              <a className="text-white mx-3" href="https://www.instagram.com/limitify/">
                <i className="fab fa-instagram"></i>
              </a>

            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-4 text-center text-gray-50 font-['Nunito']">
        <div className="container mx-auto px-4 lg:px-5 font-normal">
          <p>ATS &copy; {year} Powered by Limitify</p>
        </div>
      </footer>
    </motion.div>
  )
}
Welcome.displayName = "/src/layout/Welcome.jsx";

export default Welcome;