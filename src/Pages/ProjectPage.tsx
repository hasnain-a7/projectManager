"use client";
import TaskAccordionTable from "@/components/TaskAccordionTable ";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TodoModel from "@/components/TodoModel";
import TodoSingleList from "@/components/TodoSingleList";
import { FaPlus } from "react-icons/fa";

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
  addDoc,
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
  dueDate: string;
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
    taskCache,
    setTaskCache,
  } = useTaskContext();

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [currentTask, setCurrentTask] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  // ✅ Cache: { projectDocId: { title: string, tasks: Todo[] } }

  // -------------------------------
  // Fetch ALL projects + tasks once
  // -------------------------------
  const fetchAllProjectsAndTasks = async (userId: string) => {
    const projectQuery = query(
      collection(db, "Projects"),
      where("userId", "==", userId)
    );
    const projectSnapshot = await getDocs(projectQuery);

    const cacheData: {
      [key: string]: { title: string; tasks: Todo[] };
    } = {};

    for (const projectDoc of projectSnapshot.docs) {
      const projectDocId = projectDoc.id;
      const projectTitle = projectDoc.data().title;

      const tasksSnapshot = await getDocs(
        collection(db, "Projects", projectDocId, "tasks")
      );

      const tasks = tasksSnapshot.docs.map((doc) => ({
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

      cacheData[projectDocId] = { title: projectTitle, tasks };
    }

    return cacheData;
  };

  // -------------------------------
  // Add task
  // -------------------------------
  const addNewTask = async (
    projectDocId: string,
    taskData?: {
      title: string;
      todo?: string;
      completed?: boolean;
      status?: string;
      attechments?: string[];
    }
  ) => {
    if ((!taskData?.title && !newTaskTitle) || !userContextId) return;

    const newTask = {
      title: taskData?.title || newTaskTitle,
      todo: taskData?.todo || "",
      completed: taskData?.completed ?? false,
      createdAt: new Date().toLocaleString(),
      userId: userContextId,
      status: taskData?.status || "pending",
      attechments: taskData?.attechments || [],
      dueDate: formData.dueDate,
    };

    try {
      const taskRef = await addDoc(
        collection(db, "Projects", projectDocId, "tasks"),
        newTask
      );

      const taskWithId = {
        ...newTask,
        id: taskRef.id,
        projectId: projectDocId,
      };

      // ✅ update cache only
      setTaskCache((prev) => ({
        ...prev,
        [projectDocId]: {
          ...prev[projectDocId],
          tasks: [...(prev[projectDocId]?.tasks || []), taskWithId],
        },
      }));

      setNewTaskTitle("");
    } catch (err) {
      console.error("❌ Error adding task:", err);
    }
  };

  // -------------------------------
  // Delete task
  // -------------------------------
  const deleteProjectTask = async (projectId: string, taskId: string) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteDoc(doc(db, "Projects", projectId, "tasks", taskId));
      setTaskCache((prev) => ({
        ...prev,
        [projectId]: {
          ...prev[projectId],
          tasks: prev[projectId].tasks.filter((t) => t.id !== taskId),
        },
      }));
    } catch (err) {
      console.error("❌ Error deleting project task:", err);
    }
  };

  // -------------------------------
  // Open edit modal
  // -------------------------------
  const openEdit = (id: string, projectDocId: string) => {
    const t = taskCache[projectDocId]?.tasks.find((task) => task.id === id);
    if (t && t.userId === userContextId) {
      setFormData({
        title: t.title,
        description: t.todo,
        status: t.status,
        attachments: t.attechments,
        dueDate: formData.dueDate,
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
      dueDate: formData.dueDate,
    });
    setEditId(null);
    setCurrentTask(null);
    setShowPopup(false);
  };

  // -------------------------------
  // Update task
  // -------------------------------
  const updateProjectTask = async () => {
    if (editId && currentTask?.projectId) {
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

        // ✅ update cache
        setTaskCache((prev) => ({
          ...prev,
          [currentTask.projectId]: {
            ...prev[currentTask.projectId],
            tasks: prev[currentTask.projectId].tasks.map((t) =>
              t.id === editId
                ? {
                    ...t,
                    title: formData.title,
                    todo: formData.description,
                    status: formData.status,
                  }
                : t
            ),
          },
        }));

        resetForm();
      } catch (err) {
        console.error("❌ Error updating project task:", err);
      }
    }
  };

  // -------------------------------
  // Load all projects once
  // -------------------------------
  useEffect(() => {
    if (!userContextId) return;

    const loadAll = async () => {
      if (Object.keys(taskCache).length > 0) return; // already cached
      setLoading(true);
      try {
        const cacheData = await fetchAllProjectsAndTasks(userContextId);
        setTaskCache(cacheData);
      } catch (err) {
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [userContextId]);
  console.log("task cache", taskCache);

  const projectDocId = Object.keys(taskCache).find(
    (id) => taskCache[id].title === projectId
  );

  const specificTask =
    projectDocId && taskCache[projectDocId]
      ? taskCache[projectDocId].tasks
      : [];

  return (
    <div className="p-2 space-y-2">
      <div className="flex justify-end w-full">
        {!loading && (
          <button
            className="px-2 py-1 border rounded-md bg-[#22272B] text-gray-300 hover:bg-gray-800 transition-colors"
            onClick={() => navigate("/")}
          >
            View Trello
          </button>
        )}
      </div>

      <button
        onClick={handleShowAdd}
        className="fixed bottom-8 right-8 w-12 h-12 flex items-center justify-center rounded-full bg-[#101204] text-white text-lg shadow-md hover:scale-105 transition-transform cursor-pointer"
      >
        <FaPlus size={18} />
      </button>

      {loading ? (
        <div className="flex justify-center items-center p-8 pt-52">
          <span className="text-gray-600 text-lg">Loading tasks...</span>
        </div>
      ) : (
        <TaskAccordionTable tasks={specificTask} />
      )}
      {/* Edit Modal */}
      {showPopup && projectDocId && (
        <TodoModel
          projectId={projectDocId}
          addNewTask={addNewTask}
          updateProjectTask={updateProjectTask}
        />
      )}
    </div>
  );
};

export default ProjectPage;
