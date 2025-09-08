"use client";

import * as React from "react";
import { NavLink } from "react-router-dom";
import { IoMdHome } from "react-icons/io";
import { MdDashboardCustomize } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import { CgAlignLeft } from "react-icons/cg";
import { AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";
import { Separator } from "../components/ui/separator";
import { auth } from "../Config/firbase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarInput,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { FaUser, FaSignOutAlt } from "react-icons/fa";

// ---------------- DATA ----------------
const items = [
  { title: "Home", url: "/", icon: IoMdHome },
  { title: "Dashboard", url: "/dashboard", icon: MdDashboardCustomize },
  { title: "Add Task", url: "/add-task", icon: IoMdAddCircle },
  { title: "Student Task", url: "/important", icon: CgAlignLeft },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const [projects, setProjects] = React.useState([
    { title: "Project A", url: "/projects/a" },
    { title: "Project B", url: "/projects/b" },
  ]);
  console.log(projects);
  const [showInput, setShowInput] = React.useState(false);
  const [newProject, setNewProject] = React.useState("");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error: any) {
      console.error("Logout error:", error.message);
    }
  };

  const addProject = () => {
    if (!newProject.trim()) return;
    const urlSafe = `/projects/${newProject
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")}`;
    setProjects([...projects, { title: newProject.trim(), url: urlSafe }]);
    setNewProject("");
    setShowInput(false);
  };

  const deleteProject = (title: string) => {
    setProjects(projects.filter((p) => p.title !== title));
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <SidebarGroup>
          {/* Main Section */}
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="text-4xl ">
                  <NavLink to={item.url}>
                    {({ isActive }) => (
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={isActive}
                      >
                        <item.icon
                          className="h-7 w-3 cursor-pointer"
                          size={28}
                        />
                        <span className="cursor-pointer">{item.title}</span>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            <Separator className="my-2" />

            <div className="flex items-center justify-between ">
              <SidebarGroupLabel>Projects</SidebarGroupLabel>
              <button
                onClick={() => setShowInput(!showInput)}
                className="p-1 rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer"
                title="Add Project"
              >
                <AiOutlinePlus size={18} />
              </button>
            </div>

            {showInput && (
              <div className="px-2 my-2">
                <SidebarInput
                  placeholder="New project..."
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addProject()}
                  className="mb-1"
                />
                <button
                  onClick={addProject}
                  className="px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowInput(!showInput)}
                  className="px-2 py-1 rounded  hover:bg-red-500 hover:text-white ml-1 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}

            <SidebarMenu>
              {projects.map((project) => (
                <SidebarMenuItem
                  key={project.title}
                  className="flex items-center justify-between"
                >
                  <NavLink to={project.url}>
                    {({ isActive }) => (
                      <SidebarMenuButton
                        tooltip={project.title}
                        isActive={isActive}
                      >
                        <span className="cursor-pointer">{project.title}</span>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                  <button
                    onClick={() => deleteProject(project.title)}
                    className="p-1 rounded hover:bg-red-500 hover:text-white ml-1 cursor-pointer"
                  >
                    <AiOutlineDelete size={16} />
                  </button>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-full justify-start">
              <FaUser className="mr-2 h-5 w-5" /> Account
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
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
