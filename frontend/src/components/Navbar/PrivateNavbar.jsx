import { Fragment, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoLogOutOutline } from "react-icons/io5";
import { SiAuthy } from "react-icons/si";
import { logoutAction, loginAction } from "../../redux/slice/authSlice";
import { FaUserCircle, FaBell } from "react-icons/fa";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function PrivateNavbar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(user?.username || "");

  const logoutHandler = () => {
    dispatch(logoutAction());
    localStorage.removeItem("userInfo");
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    const updatedUser = { ...user, username: editedUsername };
    localStorage.setItem("userInfo", JSON.stringify(updatedUser));
    dispatch(loginAction(updatedUser));
    setIsEditing(false);
  };

  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Transactions", href: "/add-transaction" },
    { name: "Categories", href: "/categories" },
    { name: "Budgets", href: "/budgets" },
    { name: "Goals", href: "/goals" },
    { name: "Forecast", href: "/forecast" },
    { name: "Reports", href: "/reports" },
    { name: "Recurring", href: "/recurring-expenses" },
    { name: "Notifications", href: "/notifications" },
    { name: "Analytics", href: "/analytics" },
  ];

  return (
    <Disclosure as="nav" className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center min-w-0 flex-1">
                {/* Mobile button */}
                <div className="flex lg:hidden mr-2">
                  <Disclosure.Button className="text-gray-400 hover:text-gray-500 focus:outline-none p-2 rounded-md">
                    {open ? (
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>

                {/* Logo */}
                <Link to="/dashboard" className="flex-shrink-0 flex items-center space-x-2 min-w-0">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                    <SiAuthy className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <span className="hidden sm:block text-lg lg:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
                    FinanceManager
                  </span>
                </Link>

                {/* Desktop nav */}
                <div className="hidden lg:flex space-x-1 ml-6 overflow-x-auto">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          "px-2 xl:px-3 py-2 rounded-lg text-xs xl:text-sm font-medium transition-all duration-200 whitespace-nowrap",
                          isActive
                            ? "bg-blue-100 text-blue-700 shadow-sm"
                            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                        )}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Profile + Logout */}
              <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                {/* Profile Dropdown */}
                {user && (
                  <Menu as="div" className="relative">
                    <div>
                      <Menu.Button className="flex items-center text-sm focus:outline-none bg-gray-100 rounded-full p-1 hover:bg-gray-200 transition-colors">
                        <FaUserCircle className="h-7 w-7 sm:h-8 sm:w-8 text-gray-600" />
                      </Menu.Button>
                    </div>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items
                        className="absolute z-10 mt-2 w-56 sm:w-64 origin-top-right rounded-xl bg-white py-2 shadow-xl ring-1 ring-gray-200 focus:outline-none right-0"
                      >
                        <div className="px-4 py-2 text-sm text-gray-700">
                          Email:{" "}
                          <span className="font-medium">{user?.email}</span>
                        </div>
                        <div className="px-4 py-2 text-sm text-gray-700">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span>Username:</span>
                            {isEditing ? (
                              <input
                                type="text"
                                className="border px-2 py-1 text-sm rounded flex-1 min-w-0"
                                value={editedUsername}
                                onChange={(e) =>
                                  setEditedUsername(e.target.value)
                                }
                              />
                            ) : (
                              <span className="font-medium truncate">
                                {user?.username}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="px-4 py-2 border-t border-gray-200">
                          {isEditing ? (
                            <button
                              onClick={handleSave}
                              className="text-green-600 text-sm hover:underline"
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={handleEdit}
                              className="text-blue-600 text-sm hover:underline"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              )}
                            >
                              Profile Settings
                            </Link>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                )}
                {/* Logout Button */}
                {user && (
                  <button
                    onClick={logoutHandler}
                    className="inline-flex items-center gap-x-1 sm:gap-x-1.5 rounded-lg bg-red-600 px-2 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-red-700 focus:outline-none transition-colors shadow-sm"
                  >
                    <IoLogOutOutline className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Nav */}
          <Disclosure.Panel className="lg:hidden border-t border-gray-200">
            <div className="grid grid-cols-2 gap-1 px-2 py-3">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link key={item.name} to={item.href}>
                    <Disclosure.Button
                      as="span"
                      className={classNames(
                        "block px-3 py-2 rounded-lg text-sm font-medium text-center transition-colors",
                        isActive
                          ? "bg-blue-100 text-blue-700 shadow-sm"
                          : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                      )}
                    >
                      {item.name}
                    </Disclosure.Button>
                  </Link>
                );
              })}
              {/* Additional mobile-only links */}
              {/* <Link to="/categories">
                <Disclosure.Button
                  as="span"
                  className={classNames(
                    "block px-3 py-2 rounded-lg text-sm font-medium text-center transition-colors",
                    location.pathname === "/categories"
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  )}
                >
                  Categories
                </Disclosure.Button>
              </Link>
              <Link to="/recurring-expenses">
                <Disclosure.Button
                  as="span"
                  className={classNames(
                    "block px-3 py-2 rounded-lg text-sm font-medium text-center transition-colors",
                    location.pathname === "/recurring-expenses"
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  )}
                >
                  Recurring
                </Disclosure.Button>
              </Link>
              <Link to="/forecast">
                <Disclosure.Button
                  as="span"
                  className={classNames(
                    "block px-3 py-2 rounded-lg text-sm font-medium text-center transition-colors",
                    location.pathname === "/forecast"
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  )}
                >
                  Forecast
                </Disclosure.Button>
              </Link>
              <Link to="/notifications">
                <Disclosure.Button
                  as="span"
                  className={classNames(
                    "block px-3 py-2 rounded-lg text-sm font-medium text-center transition-colors",
                    location.pathname === "/notifications"
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  )}
                >
                  Notifications
                </Disclosure.Button>
              </Link> */}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
