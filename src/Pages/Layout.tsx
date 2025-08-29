import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import { auth } from "../Config/firbase";
import { signOut } from "firebase/auth";
import AccountDropdown from "../Components/NavBarAccount";
import { useState } from "react";
import { TfiAlignJustify } from "react-icons/tfi";

const Layout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error: any) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <div className="relative flex flex-col h-dvh transition-all w-full">
      <nav className="w-full h-[60px] flex justify-between items-center bg-[#1a202c] text-white p-3">
        <div className="flex justify-between items-center w-full">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <TfiAlignJustify className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Task Manager</h1>
          <AccountDropdown onLogout={handleLogout} />
        </div>
      </nav>

      <div className="flex h-screen w-full overflow-hidden">
        <div
          className={`flex-shrink-0 transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "w-52" : "w-0"
          }`}
        >
          {isSidebarOpen && (
            <Sidebar
              isOpen={isSidebarOpen}
              toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />
          )}
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <main className="flex-1  bg-gray-100 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
