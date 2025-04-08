import React from "react";
import {
  FaMoneyBillWave,
  FaRegCalendarAlt,
  FaSignInAlt,
  FaList,
  FaChartPie,
  FaQuoteLeft,
} from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { FaFilter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-16 px-4 sm:px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold"
          >
            Track Your Expenses Effortlessly
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-4 text-lg sm:text-xl"
          >
            Manage your finances with a modern solution designed for you.
          </motion.p>

          {/* Feature Icons */}
          <div className="flex flex-col sm:flex-row justify-center space-y-6 sm:space-y-0 sm:space-x-8 mt-10">
            {[
              {
                icon: <FaMoneyBillWave className="text-3xl" />,
                label: "Efficient Tracking",
              },
              {
                icon: <FaFilter className="text-3xl" />,
                label: "Transactions Filtering",
              },
              {
                icon: <IoIosStats className="text-3xl" />,
                label: "Insightful Reports",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 + index * 0.2 }}
                className="flex flex-col items-center"
              >
                {feature.icon}
                <p className="mt-2">{feature.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 px-6 py-3 bg-white text-green-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
            >
              Get Started
            </motion.button>
          </Link>
        </div>
      </div>

      {/* How it works */}
      <div className="py-16 px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          How It Works
        </h2>
        <div className="mt-10 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[
            {
              icon: <FaSignInAlt className="text-xl" />,
              title: "Sign Up",
              desc: "Register and start managing your expenses in a minute.",
              bg: "bg-blue-500",
            },
            {
              icon: <FaList className="text-xl" />,
              title: "Add Transactions",
              desc: "Quickly add income and expenses to your account.",
              bg: "bg-green-500",
            },
            {
              icon: <FaChartPie className="text-xl" />,
              title: "View Reports",
              desc: "See insightful reports & graphs of your finances.",
              bg: "bg-yellow-500",
            },
          ].map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 + idx * 0.2 }}
              className="flex flex-col items-center text-center"
            >
              <div className={`p-4 rounded-full ${step.bg} text-white mb-4`}>
                {step.icon}
              </div>
              <h3 className="mb-2 font-semibold">{step.title}</h3>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-100 py-16 px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          What Our Users Say
        </h2>
        <div className="mt-10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              quote:
                "This app has revolutionized the way I track my expenses. Highly intuitive and user-friendly.",
              name: "Jane Doe",
            },
            {
              quote:
                "Finally, a hassle-free way to manage my finances. The insights feature is a game changer!",
              name: "John Smith",
            },
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 + index * 0.2 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <FaQuoteLeft className="text-xl text-gray-400" />
              <p className="mt-4">{testimonial.quote}</p>
              <p className="mt-4 font-bold">- {testimonial.name}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-blue-500 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="mt-4">
            Join us now and start managing your expenses like a pro!
          </p>
          <Link to="/register">
            <button className="mt-8 px-6 py-3 bg-white text-blue-500 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition duration-300">
              Sign Up For Free
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
