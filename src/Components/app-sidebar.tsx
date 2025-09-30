import * as React from "react";
import { NavLink } from "react-router-dom";
import { MdDashboardCustomize } from "react-icons/md";
import { IoHomeOutline } from "react-icons/io5";
import { AiOutlinePlus, AiOutlineDelete, AiOutlineMenu } from "react-icons/ai";
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
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { useTaskContext } from "@/TaskContext/TaskContext";
import { useUserContextId } from "@/AuthContext/UserContext";
import SidebarFooter from "./sidebar-footer";
import Loader from "./Loader";

const items = [
  { title: "Home", url: "/home", icon: IoHomeOutline },
  { title: "Dashboard", url: "/dashboard", icon: MdDashboardCustomize },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [showInput, setShowInput] = React.useState(false);
  const [newProject, setNewProject] = React.useState("");
  const { userContextId } = useUserContextId();
const { projects, fetchUserProjects, addProject, deleteProject, loading, setLoading } =
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
    setLoading(true);
    try {
      await addProject(newProject, userContextId);
      setNewProject("");
      setShowInput(false);
    } catch (err) {
      console.error("❌ Error adding project:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="flex flex-col h-full bg-sidebar"
    >
      <div className="md:hidden flex items-center justify-between p-2 border-b">
        <span className="font-semibold">Menu</span>
        <SidebarTrigger />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={`flex ${
                    state === "expanded"
                      ? "flex-row"
                      : "flex-col items-center justify-center ml-2 "
                  } items-center`}
                >
                  <NavLink
                    to={item.url}
                    className="w-full"
                    onClick={() => {
                      setOpen(false);
                      setShowInput(false);
                    }}
                  >
                    {({ isActive }) => (
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={isActive}
                        className={`flex items-center gap-3 px-2 py-1 rounded-md transition-colors ${
                          isActive
                            ? "bg-primary text-white"
                            : "hover:bg-sidebar-accent hover:text-foreground"
                        } `}
                      >
<item.icon
  className="cursor-pointer"
  size={22} // keep smaller size from dev for consistency
/>
{state === "expanded" && (
  <span
    className="text-sm font-medium cursor-pointer"
    onClick={() => setOpen(false)} // keep main branch behavior
  >
    {item.title}
  </span>
)}

                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            <Separator className="my-3" />

            <div
              className={`flex items-center ${
                state === "expanded"
                  ? "justify-between px-0.5"
                  : "justify-center flex-col"
              }`}
            >
              {state === "expanded" ? (
                <>
                  <SidebarGroupLabel className="text-xs uppercase text-muted-foreground tracking-wide">
                    Projects
                  </SidebarGroupLabel>
                  <button
                    onClick={() => setShowInput(!showInput)}
                    className="p-1 rounded hover:bg-sidebar-accent"
                    title="Add Project"
                  >
                    <AiOutlinePlus size={18} />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleAddClick}
                  className="p-2 mb-1 rounded hover:bg-sidebar-accent"
                  title="Add Project"
                >
                  <AiOutlinePlus size={20} />
                </button>
              )}
            </div>

            {showInput && state === "expanded" && (
              <div className="px-3 my-2 space-y-2">
                <SidebarInput
                  placeholder="New project..."
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddProject()}
<div className="flex gap-2 mb-1">
  <button
    onClick={handleAddProject}
    className="px-3 py-1 text-sm rounded bg-primary text-white hover:bg-primary/90 cursor-pointer"
    disabled={loading}
  >
    {loading ? "Adding..." : "Add"}
  </button>

  <button
    onClick={() => {
      setOpen(false);
      setShowInput(false);
    }}
    className="px-3 py-1 text-sm rounded bg-muted hover:bg-destructive hover:text-white cursor-pointer"
    disabled={loading}
  >
    Cancel
  </button>
</div>

              </div>
            )}

            {/* Project list */}
            <SidebarMenu>
              {projects.length > 0 ? (
                projects.map((project) => (
                  <SidebarMenuItem
                    key={project.id}
                    className={`flex items-center justify-between ${
                      state === "expanded"
                        ? "flex-row"
                        : "flex-col w-full justify-center text-lg"
                    }`}
                  >
                    <NavLink
                      to={project.url! || `/projects/${project.title}`}
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
                          className={`flex items-center ${
                            state === "expanded"
                              ? "gap-2 px-2 py-1"
                              : "flex-col gap-1 p-1 justify-center"
                          } rounded-md transition-colors ${
                            isActive
                              ? "bg-primary text-white"
                              : "hover:bg-sidebar-accent hover:text-foreground"
                          }`}
                        >
                          <span className="text-sm font-medium">
                            {state === "collapsed"
                              ? project.title[0] + project.title.slice(-1)
                              : project.title}
                          </span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>

                    {state === "expanded" && (
                      <button
                        onClick={() =>
                          deleteProject(project.id!, project.title)
                        }
                        className="p-1 ml-1 text-muted-foreground hover:bg-red-500 hover:text-white rounded"
                      >
                        <AiOutlineDelete size={16} />
                      </button>
                    )}
                  </SidebarMenuItem>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  {state === "expanded" ? <Loader /> : null}
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter state={state} setopen={setOpen} />
    </Sidebar>
  );
}
