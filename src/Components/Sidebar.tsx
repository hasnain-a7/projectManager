import { IoIosArrowDropleftCircle } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { NavLink, useNavigate } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <aside
      className={`fixed top-0 left-0 z-50 flex flex-col h-full w-52 bg-[#1a202c] text-white overflow-y-auto transition-transform duration-300 ease-in-out p-10
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="flex items-center justify-between ">
        <h1 className="text-xl font-bold">LMS</h1>
        <button onClick={toggleSidebar} className="text-white">
          <RxCross2 className="h-6 w-6" />
        </button>
      </div>

      {/* Nav Links */}
    </aside>
  );
};

export default Sidebar;
