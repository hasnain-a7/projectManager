import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  SidebarFooter as SidebarFooterBase,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { auth } from "../Config/firbase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useUserContextId } from "@/AuthContext/UserContext";
import { ChevronUp } from "lucide-react";
interface SidebarFooterProps {
  setopen: (open: boolean) => void;
  state: string;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ setopen, state }) => {
  const navigate = useNavigate();
  const { userContextId } = useUserContextId();

  const handleLogout = async () => {
    try {
      console.log(userContextId, "user logout Successfully");
      await signOut(auth);
      navigate("/login");
    } catch (error: any) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <SidebarFooterBase>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            className={`flex items-center ${
              state === "expanded" ? "flex-none" : "flex-col items-center ml-2"
            }`}
            onClick={() => {
              if (state === "collapsed") {
                setopen(true);
              }
            }}
          >
            <FaUser className="h-5 w-5" />
            {state === "expanded" && <h3>Account</h3>}
            <ChevronUp className="ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44">
          <DropdownMenuItem onClick={() => navigate("/profile")}>
            <FaUser className="mr-2 h-4 w-4" /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <FaSignOutAlt className="mr-2 h-4 w-4" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarFooterBase>
  );
};

export default SidebarFooter;
