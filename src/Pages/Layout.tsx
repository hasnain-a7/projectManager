import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";

const Layout: React.FC = () => {
  return (
    <div className="relative flex flex-col h-dvh w-full transition-all bg-gradient-to-b from-[#59448A] to-[#884C85] ">
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar />

        <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden bg-gradient-to-b from-[#59448A] to-[#884C85]">
          <main className="flex-1 max-h-full  overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
