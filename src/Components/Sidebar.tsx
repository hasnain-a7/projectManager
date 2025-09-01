import { NavLink } from "react-router-dom";
import { IoMdHome } from "react-icons/io";
import { MdDashboardCustomize } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import { CgAdidas } from "react-icons/cg";
import { CgAlignLeft } from "react-icons/cg";
import { CgCalendarDue } from "react-icons/cg";
import { auth } from "../Config/firbase";
import { signOut } from "firebase/auth";
import AccountDropdown from "../Components/NavBarAccount";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";

const Sidebar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("user log out");
      navigate("/login");
    } catch (error: any) {
      console.error("Logout error:", error.message);
    }
  };

  const handleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const closeSideBar = () => {
    setIsSidebarOpen(false);
  };
  const sideBarMenu = [
    { name: "Home", path: "/", icons: <IoMdHome /> },
    {
      name: "Dashboard",
      path: "/dashboard",
      icons: <MdDashboardCustomize />,
    },
    {
      name: "Add Task",
      path: "/add-task",
      icons: <IoMdAddCircle />,
    },
    {
      name: "Student Task",
      path: "/important",
      icons: <CgAlignLeft />,
    },
    {
      name: "Gym Task",
      path: "/completed",
      icons: <CgAdidas />,
    },
    {
      name: "Personal Task",
      path: "/personal",
      icons: <CgCalendarDue />,
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-full  bg-[#1a202c] text-white transition-all duration-200 ease-in-out p-2 pt-4
        lg:relative lg: translate-x-0
        ${isSidebarOpen ? "w-48" : "w-16 "}
      `}
    >
      <div
        className={`h-full flex flex-col justify-between   ${
          isSidebarOpen && "p-2 "
        }`}
      >
        <div className="flex flex-col justify-between  gap-4">
          <button onClick={handleSidebar} className="pl-2 cursor-pointer">
            <RxHamburgerMenu size={28} />
          </button>
          <nav>
            <ul className="flex flex-col gap-3 p-1 font-medium">
              {sideBarMenu.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    onClick={closeSideBar}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-2  rounded-lg text-sm font-semibold duration-200 transition-colors ${
                        isActive
                          ? "bg-[#3CBEA9] text-white item"
                          : "text-gray-200 hover:bg-gray-700 hover:text-white"
                      }`
                    }
                  >
                    <span className="flex justify-between items-center gap-2 ">
                      <div className="text-lg pl-0.5"> {item.icons}</div>
                      <span> {isSidebarOpen && item.name}</span>
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>{" "}
        </div>
        <div>
          <AccountDropdown onLogout={handleLogout} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
