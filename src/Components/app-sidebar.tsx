import * as React from "react";
import { NavLink } from "react-router-dom";

import { MdDashboardCustomize } from "react-icons/md";
import { IoHomeOutline } from "react-icons/io5";
import { AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";
import { Separator } from "../components/ui/separator";
import { auth } from "../Config/firbase";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../Config/firbase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";

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
  useSidebar,
} from "@/components/ui/sidebar";

import { useTaskContext } from "@/TaskContext/TaskContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { useUserContextId } from "@/AuthContext/UserContext";

const items = [
  { title: "Home", url: "/home", icon: IoHomeOutline },
  { title: "Dashboard", url: "/dashboard", icon: MdDashboardCustomize },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();

  const [showInput, setShowInput] = React.useState(false);
  const [newProject, setNewProject] = React.useState("");
  const { userContextId } = useUserContextId();
  const { projects, setProjects } = useTaskContext();
  const { open, setOpen, state } = useSidebar();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error: any) {
      console.error("Logout error:", error.message);
    }
  };
  const addProject = async () => {
    try {
      const projectData = {
        title: newProject,
        userId: userContextId,
        url: `/projects/${newProject.toLowerCase()}`,
        createdAt: serverTimestamp(),
      };
      setProjects([
        ...projects,
        {
          title: newProject,
          url: `/projects/${newProject.toLowerCase()}`,
        },
      ]);
      console.log(projectData);
      setNewProject("");
      setShowInput(false);

      const docRef = await addDoc(collection(db, "Projects"), projectData);

      console.log("Project created with ID:", docRef.id);
      return docRef.id;
    } catch (err) {
      console.error("Error creating project:", err);
    }
  };
  const fetchUserProjects = async () => {
    try {
      const q = query(
        collection(db, "Projects"),
        where("userId", "==", userContextId)
      );

      const querySnapshot = await getDocs(q);

      const projects = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        url: doc.data().url,
        userId: doc.data().userId,
        createdAt: doc.data().createdAt,
      }));
      setProjects(projects);
      console.log("✅ User projects:", projects);
      return projects;
    } catch (err) {
      console.error("❌ Error fetching projects:", err);
      return [];
    }
  };
  useEffect(() => {
    if (userContextId) {
      fetchUserProjects();
    }
  }, [userContextId]);
  // const addProject = async () => {
  //   if (!newProject.trim()) return;

  //   const projectTitle = newProject.trim();
  //   const urlSafe = `/projects/${projectTitle
  //     .toLowerCase()
  //     .replace(/\s+/g, "-")}`;

  //   const newProjectData = {
  //     title: projectTitle,
  //     url: urlSafe,
  //     createdAt: serverTimestamp(),
  //   };

  //   try {
  //     await addDoc(collection(db, "categories"), newProjectData);

  //     setProjects([...projects, newProjectData]);

  //     setNewProject("");
  //     setShowInput(false);

  //     console.log("Project added:", newProjectData);
  //   } catch (error) {
  //     console.error("Error adding project:", error);
  //   }
  // };

  const deleteProject = (title: string) => {
    setProjects(projects.filter((p) => p.title !== title));
  };
  const handleAddClick = () => {
    if (state === "collapsed") {
      setOpen(true);
    }
    setShowInput(true);
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
                    state == "expanded" ? "flex-row" : "flex-col"
                  }`}
                >
                  <NavLink to={item.title}>
                    {({ isActive }) => (
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={isActive}
                      >
                        <item.icon className=" cursor-pointer" size={32} />
                        <span className="cursor-pointer">{item.title}</span>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            <Separator className="my-2" />

            <div
              className={`flex items-center justify-between text-4xl ${
                state == "expanded" ? "flex-row" : "flex-col"
              }`}
            >
              {state == "collapsed" ? (
                <button
                  onClick={handleAddClick}
                  className="p-2 mb-1 rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer"
                  title="Add Project"
                >
                  <AiOutlinePlus size={20} />
                </button>
              ) : (
                <>
                  <SidebarGroupLabel>Projects</SidebarGroupLabel>
                  <button
                    onClick={() => setShowInput(!showInput)}
                    className="p-1 rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer"
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
                  onClick={() => {
                    setOpen(false);
                    setShowInput(false);
                  }}
                  className="px-2 py-1 rounded hover:bg-red-500 hover:text-foreground ml-1 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}

            <SidebarMenu>
              {projects.length > 0 ? (
                projects.map((project: any) => (
                  <SidebarMenuItem
                    key={project.title}
                    className={`flex items-center justify-between  ${
                      state == "expanded"
                        ? "flex-row "
                        : "flex-col text-4xl w-full cursor-pointer "
                    }`}
                  >
                    <NavLink
                      to={project.url}
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
                              : "flex-col gap-1 p-1 rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer"
                          } ${isActive ? "bg-primary" : ""}`}
                        >
                          <span className="pb-1 rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer">
                            {state === "collapsed"
                              ? project.title[0] + project.title.slice(-1)
                              : project.title}
                          </span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>

                    {!state && (
                      <button
                        onClick={() => deleteProject(project.title)}
                        className="p-1 rounded hover:bg-red-500 hover:text-white ml-1 cursor-pointer"
                      >
                        <AiOutlineDelete size={16} />
                      </button>
                    )}
                  </SidebarMenuItem>
                ))
              ) : (
                <p className="text-sm text-gray-400 p-2">
                  No projects yet. Add one!
                </p>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className={`flex items-center justify-between  ${
                state === "expanded"
                  ? "flex-none"
                  : "flex-col items-center ml-2"
              }`}
              onClick={() => {
                if (state === "collapsed") {
                  setOpen(true);
                }
              }}
            >
              <FaUser className=" h-5 w-5" />
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
