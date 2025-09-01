import { RxCross2 } from "react-icons/rx";
import { NavLink } from "react-router-dom";
import { MdDashboardCustomize } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import { CgAdidas } from "react-icons/cg";
import { CgAlignLeft } from "react-icons/cg";
import { CgCalendarDue } from "react-icons/cg";
interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const sideBarMenu = [
    { name: "home", path: "/app", icons: <CgCalendarDue /> },
    {
      name: "Dashboard",
      path: "/app/dashboard",
      icons: <MdDashboardCustomize />,
    },
    {
      name: "Add Task",
      path: "/app/add-task",
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
      className={`fixed top-0 left-0 z-50 h-full  bg-[#1a202c] text-white transition-all duration-300 ease-in-out p-2
        lg:relative lg: translate-x-0
        ${isOpen ? "w-48" : "w-16 "}
      `}
    >
      <div
        className={`h-full flex flex-col justify-between pb-4 mt-4 ${
          isOpen && "p-2 "
        }`}
      >
        <nav>
          <ul className="flex flex-col gap-3 p-1 font-medium">
            {sideBarMenu.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-2  rounded-lg text-sm font-semibold duration-200 transition-colors ${
                      isActive
                        ? "bg-[#3CBEA9] text-white"
                        : "text-gray-200 hover:bg-gray-700 hover:text-white"
                    }`
                  }
                >
                  <span className="flex justify-between items-center gap-2 ">
                    <div className="text-lg"> {item.icons}</div>
                    <span> {isOpen && item.name}</span>
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
