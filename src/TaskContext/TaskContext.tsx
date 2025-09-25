import React, { createContext, useContext, useState, useEffect } from "react";
import { useUserContextId } from "../AuthContext/UserContext";
import { db, auth } from "../Config/firbase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export interface Task {
  id?: string;
  title: string;
  todo: string;
  createdAt: string;
  status: string;
  attachments?: string[];
  dueDate?: string;
  userId?: string | null;
  projectId?: string;
}

export interface Project {
  id?: string;
  title: string;
  url?: string;
  userId?: string;
  createdAt?: string;
  dueDate?: string;
}

interface TaskContextType {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  taskCache: { [key: string]: { title: string; tasks: Task[] } };
  setTaskCache: React.Dispatch<
    React.SetStateAction<{ [key: string]: { title: string; tasks: Task[] } }>
  >;
  loading: boolean;

  // Tasks
  addTaskToProjectByTitle: (
    projectTitle: string,
    userId: string,
    formData: {
      title: string;
      todo: string;
      status: string;
      attachments?: string[];
      dueDate?: string;
    }
  ) => Promise<string>;
  deleteTaskFromProject: (
    projectTitle: string,
    userId: string | null,
    taskId: string
  ) => Promise<void>;

  // Projects
  fetchUserProjects: (userId: string) => Promise<void>;
  addProject: (title: string, userId: string) => Promise<string>;
  deleteProject: (projectId: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [taskCache, setTaskCache] = useState<{
    [key: string]: { title: string; tasks: Task[] };
  }>({});
  const [loading, setLoading] = useState(false);
  const { userContextId } = useUserContextId();

  const fetchUserProjects = async (userId: string) => {
    try {
      setLoading(true);

      const q = query(
        collection(db, "Projects"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);

      const projectsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];

      setProjects(projectsData);

      const cache: { [key: string]: { title: string; tasks: Task[] } } = {};
      for (const project of projectsData) {
        const taskSnap = await getDocs(
          collection(db, "Projects", project.id!, "tasks")
        );
        const tasks = taskSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Task[];

        cache[project.id!] = { title: project.title, tasks };
      }
      setTaskCache(cache);
      console.log("✅ Projects & tasks loaded", { projectsData, cache });
    } catch (err) {
      console.error("❌ Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (title: string, userId: string) => {
    try {
      setLoading(true);

      if (!title.trim() || !userId) return "";

      const projectData = {
        title,
        userId,
        url: `/projects/${title.toLowerCase().replace(/\s+/g, "-")}`,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "Projects"), projectData);

      console.log("✅ Project created:", projectData);
      setProjects((prev) => [
        ...prev,
        { id: docRef.id, ...projectData, createdAt: new Date().toISOString() },
      ]);
      await fetchUserProjects(userId);

      return docRef.id;
    } catch (err) {
      console.error("❌ Error creating project:", err);
      return "";
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      await deleteDoc(doc(db, "Projects", projectId));
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      console.log("🗑️ Project deleted:", projectId);
    } catch (err) {
      console.error("❌ Error deleting project:", err);
    }
  };

  const addTaskToProjectByTitle = async (
    projectTitle: string,
    userId: string,
    formData: {
      title: string;
      todo: string;
      status: string;
      attachments?: string[];
      dueDate?: string;
    }
  ): Promise<string> => {
    try {
      const q = query(
        collection(db, "Projects"),
        where("title", "==", projectTitle),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty)
        throw new Error(`Project "${projectTitle}" not found for this user`);

      const projectDoc = querySnapshot.docs[0];
      const projectId = projectDoc.id;

      const newTask: Task = {
        title: formData.title,
        todo: formData.todo,
        status: formData.status,
        attachments: formData.attachments || [],
        createdAt: new Date().toISOString(),
        userId: userId,
        dueDate: formData.dueDate,
      };

      const taskRef = await addDoc(
        collection(db, "Projects", projectId, "tasks"),
        newTask
      );
      console.log(newTask);

      setTaskCache((prev) => ({
        ...prev,
        [projectId]: {
          ...prev[projectId],
          tasks: [...(prev[projectId]?.tasks || []), newTask],
        },
      }));

      console.log(`✅ Task added to project "${projectTitle}":`, taskRef.id);
      return taskRef.id;
    } catch (err) {
      console.error("❌ Error adding task:", err);
      throw err;
    }
  };

  const deleteTaskFromProject = async (
    projectTitle: string,
    userId: string | null,
    taskId: string
  ): Promise<void> => {
    try {
      const q = query(
        collection(db, "Projects"),
        where("title", "==", projectTitle),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty)
        throw new Error(`Project "${projectTitle}" not found for this user`);

      const projectDoc = querySnapshot.docs[0];
      const projectId = projectDoc.id;

      const taskRef = doc(db, "Projects", projectId, "tasks", taskId);

      await deleteDoc(taskRef);

      setTaskCache((prev) => ({
        ...prev,
        [projectId]: {
          ...prev[projectId],
          tasks:
            prev[projectId]?.tasks.filter((task) => task.id !== taskId) || [],
        },
      }));

      console.log(`✅ Task ${taskId} deleted from project "${projectTitle}"`);
    } catch (err) {
      console.error("❌ Error deleting task:", err);
      throw err;
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserProjects(user.uid);
      } else {
        setProjects([]);
        setTaskCache({});
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <TaskContext.Provider
      value={{
        projects,
        setProjects,
        taskCache,
        setTaskCache,
        loading,
        addTaskToProjectByTitle,
        fetchUserProjects,
        addProject,
        deleteProject,
        deleteTaskFromProject,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context)
    throw new Error("useTaskContext must be used within TaskProvider");
  return context;
};
