import * as React from "react";
import { NavLink } from "react-router-dom";

import { MdDashboardCustomize } from "react-icons/md";
import { IoHomeOutline } from "react-icons/io5";
import { AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";
import { Separator } from "../components/ui/separator";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarInput,
  useSidebar,
} from "@/components/ui/sidebar";

import { useTaskContext } from "@/TaskContext/TaskContext";
import { useUserContextId } from "@/AuthContext/UserContext";
import SidebarFooter from "./sidebar-footer";

const items = [
  { title: "Home", url: "/home", icon: IoHomeOutline },
  { title: "Dashboard", url: "/dashboard", icon: MdDashboardCustomize },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [showInput, setShowInput] = React.useState(false);
  const [newProject, setNewProject] = React.useState("");
  const { userContextId } = useUserContextId();
  const { projects, fetchUserProjects, addProject, deleteProject } =
    useTaskContext();
  const { setOpen, state } = useSidebar();

  React.useEffect(() => {
    if (userContextId) fetchUserProjects(userContextId);
  }, [userContextId]);

  const handleAddClick = () => {
    if (state === "collapsed") setOpen(true);
    setShowInput(true);
  };

  const handleAddProject = async () => {
    if (!newProject.trim() || !userContextId) return;
    await addProject(newProject, userContextId);
    setNewProject("");
    setShowInput(false);
  };

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="flex flex-col h-full bg-background"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={`flex items-center justify-between text-4xl ${
                    state === "expanded" ? "flex-row" : "flex-col"
                  }`}
                >
                  <NavLink
                    to={item.url}
                    className={`${state === "expanded" ? "w-full" : ""}`}
                  >
                    {({ isActive }) => (
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={isActive}
                        className={`flex items-center gap-2 w-full ${
                          isActive ? "bg-primary text-white" : ""
                        }`}
                      >
                        <item.icon className="cursor-pointer" size={32} />
                        <span
                          className="cursor-pointer "
                          onClick={() => setShowInput(!showInput)}
                        >
                          {item.title}
                        </span>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            <Separator className="my-2" />

            {/* Projects Section */}
            <div
              className={`flex items-center justify-between text-4xl ${
                state === "expanded" ? "flex-row" : "flex-col"
              }`}
            >
              {state === "collapsed" ? (
                <button
                  onClick={handleAddClick}
                  className="p-2 mb-1 rounded hover:bg-sidebar-accent cursor-pointer"
                  title="Add Project"
                >
                  <AiOutlinePlus size={20} />
                </button>
              ) : (
                <>
                  <SidebarGroupLabel>Projects</SidebarGroupLabel>
                  <button
                    onClick={() => setShowInput(!showInput)}
                    className="p-1 rounded hover:bg-sidebar-accent cursor-pointer"
                    title="Add Project"
                  >
                    <AiOutlinePlus size={18} />
                  </button>
                </>
              )}
            </div>

            {showInput && state === "expanded" && (
              <div className="px-2 my-2">
                <SidebarInput
                  placeholder="New project..."
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddProject()}
                  className="mb-1"
                />
                <button
                  onClick={handleAddProject}
                  className="px-2 py-1 rounded bg-primary cursor-pointer"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    setShowInput(false);
                  }}
                  className="px-2 py-1 rounded hover:bg-destructive ml-1 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}

            <SidebarMenu>
              {projects.length > 0 ? (
                projects.map((project) => (
                  <SidebarMenuItem
                    key={project.id}
                    className={`flex items-center justify-between ${
                      state === "expanded"
                        ? "flex-row"
                        : "flex-col text-4xl w-full cursor-pointer"
                    }`}
                  >
                    <NavLink
                      to={project.url!}
                      className="flex-1"
                      onClick={() => {
                        setOpen(false);
                        setShowInput(false);
                      }}
                    >
                      {({ isActive }) => (
                        <SidebarMenuButton
                          tooltip={project.title}
                          isActive={isActive}
                          className={`flex items-center justify-between ${
                            state === "expanded"
                              ? "flex-row"
                              : "flex-col gap-1 p-1 rounded hover:bg-sidebar-accent cursor-pointer"
                          } ${isActive ? "bg-primary" : ""}`}
                        >
                          <span className="cursor-pointer">
                            {state === "collapsed"
                              ? project.title[0] + project.title.slice(-1)
                              : project.title}
                          </span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>

                    {!state && (
                      <button
                        onClick={() => deleteProject(project.id!)}
                        className="p-1 rounded hover:bg-red-500 hover:text-white ml-1 cursor-pointer"
                      >
                        <AiOutlineDelete size={16} />
                      </button>
                    )}
                  </SidebarMenuItem>
                ))
              ) : (
                <p className="text-sm text-gray-400">
                  {state === "expanded" && "No projects yet. Add one!"}
                </p>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter state={state} setopen={setOpen} />
    </Sidebar>
  );
}
