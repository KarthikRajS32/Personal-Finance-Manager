import { Fragment, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoLogOutOutline } from "react-icons/io5";
import { SiAuthy } from "react-icons/si";
import { logoutAction, loginAction } from "../../redux/slice/authSlice";
import { FaUserCircle } from "react-icons/fa";

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
    { name: "Home", href: "/" },
    { name: "Add Transaction", href: "/add-transaction" },
    { name: "Add Category", href: "/add-category" },
    { name: "Categories", href: "/categories" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-6">
                {/* Mobile button */}
                <div className="flex md:hidden">
                  <Disclosure.Button className="text-gray-400 hover:text-gray-500 focus:outline-none">
                    {open ? (
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>

                {/* Logo */}
                <div className="flex-shrink-0 flex items-center">
                  <SiAuthy className="h-8 w-auto text-green-500" />
                </div>

                {/* Desktop nav */}
                <div className="hidden md:flex space-x-6">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          "text-base font-medium transition duration-150",
                          isActive
                            ? "text-indigo-700 underline underline-offset-8 font-semibold text-lg"
                            : "text-gray-700 hover:text-indigo-600 hover:underline underline-offset-4"
                        )}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Logout + Profile */}
              <div className="flex items-center space-x-10">

                {/* Profile Dropdown */}
                {user && (
                  <Menu as="div" className="relative">
                    <div>
                      <Menu.Button className="flex items-center text-sm focus:outline-none">
                        <FaUserCircle className="h-8 w-8 text-gray-700" />
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
                      <Menu.Items className="absolute w-auto right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-4 py-2 text-sm text-gray-700">
                          Email:{" "}
                          <span className="font-medium">{user?.email}</span>
                        </div>
                        <div className="px-4 py-2 text-sm text-gray-700 flex  items-center gap-2">
                          Username:
                          {isEditing ? (
                            <input
                              type="text"
                              className="border px-2 py-1 text-sm rounded w-auto"
                              value={editedUsername}
                              onChange={(e) =>
                                setEditedUsername(e.target.value)
                              }
                            />
                          ) : (
                            <span className="font-medium">
                              {user?.username}
                            </span>
                          )}
                        </div>
                        <div className="px-4 py-2">
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
                      </Menu.Items>
                    </Transition>
                  </Menu>
                )}
                {/* Logout Button */}
                {user && (
                  <button
                    onClick={logoutHandler}
                    className="inline-flex items-center gap-x-1.5 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none"
                  >
                    <IoLogOutOutline className="h-5 w-5" />
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Nav */}
          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link key={item.name} to={item.href}>
                    <Disclosure.Button
                      as="span"
                      className={classNames(
                        "block px-3 py-2 rounded-md text-base font-medium",
                        isActive
                          ? "text-indigo-700 underline underline-offset-4 font-semibold"
                          : "text-gray-700 hover:text-indigo-600 hover:underline"
                      )}
                    >
                      {item.name}
                    </Disclosure.Button>
                  </Link>
                );
              })}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
