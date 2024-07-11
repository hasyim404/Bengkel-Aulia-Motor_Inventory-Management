import { useState } from "react";
import { NavLink } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faOutdent,
  faGaugeHigh,
  faBoxesStacked,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const menus = [
    {
      path: "/",
      name: "Dashboard",
      icon: faGaugeHigh,
    },
    {
      path: "/kelola-barang",
      name: "Kelola Barang",
      icon: faBoxesStacked,
    },
  ];

  // const activeLink = "text-color-1 bg-color-1 font-bold";
  // const normalLink =
  //   "hover:bg-color-1 text-color-4 hover:text-color-6 hover:font-bold";

  const [open, setOpen] = useState(true);

  return (
    <div className="flex shadow-md z-10">
      <div
        className={`${
          open ? "w-72" : "w-20"
        } duration-300 h-screen p-5 pt-8 bg-color-6 relative`}
      >
        <FontAwesomeIcon
          icon={faOutdent}
          style={{ color: "#FFFFFE" }}
          className={`text-3xl absolute cursor-pointer -right-3 top-9 w-7 border-1 bg-color-1 p-2 l-5 rounded-lg ${
            !open && "rotate-180"
          }`}
          onClick={() => setOpen(!open)}
        />

        {/* Company */}
        <div className="flex gap-x-4 items-center">
          <img
            src="./src/assets/react.svg"
            className={`cursor-pointer duration-500 `}
            alt=""
          />
          <h1
            className={`text-color-5 origin-left text-xl font-bold duration-300 ${
              !open && "scale-0"
            }`}
          >
            SIPAYUNG CELL
          </h1>
        </div>

        {/* Nav */}
        <ul className="pt-6">
          {menus.map((menu, index) => (
            <NavLink key={index} to={menu.path}>
              <li
                className={`text-color-6 bg-color-1 text-md flex items-center gap-x-4 cursor-pointer py-5 px-5 rounded-lg mt-2`}
              >
                <FontAwesomeIcon icon={menu.icon} />

                <span
                  className={`${!open && "hidden"} origin-left duration-50`}
                >
                  {menu.name}
                </span>
              </li>
            </NavLink>
          ))}
        </ul>
      </div>
      {/* <div className="p-7 text-2xl font-semibold flex-1 h-screen">
        <h1>Dashboard</h1>
      </div> */}
    </div>
  );
};

export default Sidebar;
