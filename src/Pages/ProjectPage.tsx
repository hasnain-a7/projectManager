"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TodoModel from "@/components/TodoModel";
import TodoSingleList from "@/components/TodoSingleList";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { useTaskContext } from "../TaskContext/TaskContext";
import { useUserContextId } from "@/AuthContext/UserContext";
import { db } from "../Config/firbase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

interface Todo {
  id: string;
  projectId: string;
  title: string;
  completed: boolean;
  createdAt: string;
  todo: string;
  userId: string;
  status: string;
  categories?: string;
  attechments: string[];
}

const ProjectPage: React.FC = () => {
  const { projectId } = useParams();
  const { userContextId } = useUserContextId();
  const {
    showPopup,
    handleShowAdd,
    formData,
    editId,
    setFormData,
    setEditId,
    setShowPopup,
  } = useTaskContext();

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [specificTask, setSpecificTask] = useState<Todo[]>([]);
  const [currentTask, setCurrentTask] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks for a project
  const fetchProjectTasksForUser = async (
    projectTitle: string,
    userId: string
  ): Promise<Todo[]> => {
    try {
      if (!userId) throw new Error("User ID is required");

      const projectQuery = query(
        collection(db, "Projects"),
        where("title", "==", projectTitle),
        where("userId", "==", userId)
      );
      const projectSnapshot = await getDocs(projectQuery);

      if (projectSnapshot.empty) return [];

      const projectDoc = projectSnapshot.docs[0];
      const projectDocId = projectDoc.id;

      const tasksSnapshot = await getDocs(
        collection(db, "Projects", projectDocId, "tasks")
      );

      return tasksSnapshot.docs.map((doc) => ({
        id: doc.id,
        projectId: projectDocId,
        title: doc.data().title || "",
        todo: doc.data().todo || "",
        completed: doc.data().completed || false,
        createdAt: doc.data().createdAt || "",
        userId: doc.data().userId || "",
        status: doc.data().status || "pending",
        categories: doc.data().categories || "",
        attechments: doc.data().attechments || [],
      }));
    } catch (err) {
      console.error("Error fetching project tasks:", err);
      return [];
    }
  };

  // Delete task
  const deleteProjectTask = async (projectId: string, taskId: string) => {
    if (!userContextId) return;
    if (!window.confirm("Delete this task?")) return;

    setLoading(true);
    try {
      await deleteDoc(doc(db, "Projects", projectId, "tasks", taskId));
      setSpecificTask((prev) => prev.filter((t) => t.id !== taskId));
      console.log("✅ Task deleted:", taskId);
    } catch (err) {
      console.error("❌ Error deleting project task:", err);
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal
  const openEdit = (id: string) => {
    const t = specificTask.find((task) => task.id === id);
    if (t && t.userId === userContextId) {
      setFormData({
        title: t.title,
        description: t.todo,
        status: t.status,
        attachments: t.attechments,
      });
      setEditId(id);
      setCurrentTask(t);
      setShowPopup(true);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      status: "backlog",
      attachments: [],
    });
    setEditId(null);
    setCurrentTask(null);
    setShowPopup(false);
  };

  const updateProjectTask = async () => {
    if (editId && currentTask?.projectId && userContextId) {
      setLoading(true);
      try {
        const taskRef = doc(
          db,
          "Projects",
          currentTask.projectId,
          "tasks",
          editId
        );
        await updateDoc(taskRef, {
          title: formData.title,
          todo: formData.description,
          status: formData.status,
        });

        setSpecificTask((prev) =>
          prev.map((t) =>
            t.id === editId
              ? {
                  ...t,
                  title: formData.title,
                  todo: formData.description,
                  status: formData.status,
                }
              : t
          )
        );

        resetForm();
        console.log("✅ Task updated:", editId);
      } catch (err) {
        console.error("❌ Error updating project task:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!projectId || !userContextId) return;

    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const tasks = await fetchProjectTasksForUser(projectId, userContextId);
        setSpecificTask(tasks);
      } catch (err) {
        console.error(err);
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId, userContextId]);

  return (
    <div className="p-2 space-y-2">
      <h1 className="text-2xl font-bold">Project: {projectId}</h1>

      <div className="flex gap-2">
        <Input
          placeholder="New task title..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
      </div>

      <button
        onClick={handleShowAdd}
        className="fixed bottom-8 right-8 w-12 h-12 flex items-center justify-center rounded-full bg-[#101204] text-white text-lg shadow-md hover:scale-105 transition-transform cursor-pointer"
      >
        <FaPlus size={18} />
      </button>

      {loading ? (
        <div className="flex justify-center items-center mt-10 text-black">
          Loading tasks...
        </div>
      ) : error ? (
        <div className="text-red-500 mt-10">{error}</div>
      ) : specificTask.length === 0 ? (
        <div className="mt-10 text-gray-500">No tasks found.</div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {specificTask.map((task) => (
            <TodoSingleList
              key={task.id}
              item={task}
              projectid={task.projectId}
              deleteProjectTask={deleteProjectTask}
              updateProjectTask={updateProjectTask}
              openEdit={openEdit}
            />
          ))}
        </ul>
      )}

      {showPopup && (
        <TodoModel
          projectId={projectId!}
          updateProjectTask={updateProjectTask}
        />
      )}
    </div>
  );
};

export default ProjectPage;
