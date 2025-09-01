import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";

const Layout: React.FC = () => {
  return (
    <div className="relative flex flex-col h-dvh w-full transition-all">
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar />

        <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
          <main className="flex-1 max-h-full bg-gray-100 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
