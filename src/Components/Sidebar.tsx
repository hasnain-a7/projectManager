import { RxCross2 } from "react-icons/rx";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <aside
      className={`fixed top-0 left-0 z-50 flex flex-col h-full w-52 bg-[#1a202c] text-white overflow-y-auto transition-transform duration-300 ease-in-out p-4
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="flex items-center justify-between ">
        <img
          src="../../public/todo-list-svgrepo-com.svg"
          alt=""
          className="h-8"
        />
        <button
          onClick={toggleSidebar}
          className="text-gray-200 hover:bg-gray-700 hover:text-white pointer-coarse"
        >
          <RxCross2 className="h-6 w-6" />
        </button>
      </div>
      <div className="mt-4 h-full flex flex-col justify-between pb-4">
        <nav>
          <ul className="flex flex-col gap-2 p-2 font-medium">
            {[
              { name: "Dashboard", path: "/" },
              { name: "Sports Task", path: "/today" },
              { name: "Student Task", path: "/important" },
              { name: "Gym Task", path: "/completed" },
              { name: "Personal Task", path: "/personal" },
            ].map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg text-sm font-semibold duration-200 transition-colors ${
                      isActive
                        ? "bg-[#3CBEA9] text-white"
                        : "text-gray-200 hover:bg-gray-700 hover:text-white"
                    }`
                  }
                >
                  <span>{item.name}</span>
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
