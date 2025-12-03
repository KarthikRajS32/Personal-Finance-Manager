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
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20 px-4 sm:px-6 md:px-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-48 translate-y-48"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight"
          >
            Master Your <span className="text-yellow-300">Financial</span> Future
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-6 text-xl sm:text-2xl text-blue-100 max-w-3xl"
          >
            Complete financial management solution with budgeting, goal tracking, and intelligent insights.
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
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 text-lg"
              >
                Start Free Trial
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 text-lg"
              >
                Sign In
              </motion.button>
            </Link>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started with your financial journey in three simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <FaSignInAlt className="text-2xl" />,
                title: "Create Account",
                desc: "Sign up in seconds and set your financial preferences with our intuitive onboarding.",
                bg: "from-blue-500 to-blue-600",
                number: "01"
              },
              {
                icon: <FaList className="text-2xl" />,
                title: "Track Everything",
                desc: "Add transactions, set budgets, create goals, and manage recurring expenses effortlessly.",
                bg: "from-green-500 to-green-600",
                number: "02"
              },
              {
                icon: <FaChartPie className="text-2xl" />,
                title: "Get Insights",
                desc: "View detailed reports, analytics, and forecasts to make informed financial decisions.",
                bg: "from-purple-500 to-purple-600",
                number: "03"
              },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 + idx * 0.2 }}
                className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-lg">
                  {step.number}
                </div>
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${step.bg} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
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
      <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Ready to Transform Your Financial Life?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto"
          >
            Join thousands of users who have taken control of their finances with our comprehensive platform.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/register">
              <button className="px-10 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 text-xl">
                Start Your Journey Today
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
