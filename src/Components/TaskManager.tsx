import React, { useState, useEffect } from "react";
import "../App.css";
import TodoList from "./TodoList";
import TodoModel from "./TodoModel";
import SearchInput from "./SearchInput";
import { db, auth } from "../Config/firbase";
import { FaPlus } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { onAuthStateChanged } from "firebase/auth";

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useUserContextId } from "../AuthContext/UserContext";
import Loader from "./Loader";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  todo: string;
  userId: string;
}

interface FormData {
  title: string;
  description: string;
}

const TaskManager: React.FC = () => {
  const [Todos, setTodos] = useState<Todo[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [taskSearchInput, settaskSearchInput] = useState<string>("");
  const [filteredTasks, setfilteredTasks] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [highlightedTask, sethighlightedTask] = useState<string | null>(null);
  const { userContextId } = useUserContextId();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const fetchTodos = async () => {
          try {
            setLoading(true);
            console.log("Fetching todos for userId:", user.uid);

            const q = query(
              collection(db, "todos"),
              where("userId", "==", user.uid)
            );
            const querySnapshot = await getDocs(q);

            const todosData = querySnapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            })) as Todo[];

            console.log("Fetched todos:", todosData);
            setTodos(todosData);
          } catch (error) {
            console.error("Error fetching todos:", error);
          } finally {
            setLoading(false);
          }
        };

        fetchTodos();
      } else {
        setTodos([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const addTodo = async () => {
    if (formData.title.length > 3 && formData.description) {
      const newTodo = {
        title: formData.title,
        todo: formData.description,
        completed: false,
        createdAt: new Date().toLocaleString(),
        userId: userContextId ?? "",
      };
      const docRef = await addDoc(collection(db, "todos"), newTodo);
      setTodos([{ id: docRef.id, ...newTodo }, ...Todos]);
      sethighlightedTask(docRef.id);
      setTimeout(() => {
        sethighlightedTask(null);
      }, 3000);
      resetForm();
    } else {
      alert("Please enter valid title and description.");
    }
  };

  const updateTodo = async () => {
    if (editId !== null && userContextId !== null) {
      try {
        const todoRef = doc(db, "todos", editId);
        await updateDoc(todoRef, {
          title: formData.title,
          todo: formData.description,
        });

        setTodos(
          Todos.map((t) =>
            t.id === editId
              ? { ...t, title: formData.title, todo: formData.description }
              : t
          )
        );
        resetForm();
      } catch (err) {
        console.error("Error updating todo:", err);
      }
    }
  };

  const handleSubmit = () => {
    if (editId === null) addTodo();
    else updateTodo();
  };

  const deleteTodo = async (id: string) => {
    if (window.confirm("Delete this todo?") && userContextId !== null) {
      try {
        await deleteDoc(doc(db, "todos", id));
        setTodos(Todos.filter((t) => t.id !== id));
        setfilteredTasks(filteredTasks.filter((t) => t.id !== id));
      } catch (err) {
        console.error("Error deleting todo:", err);
      }
    }
  };

  const openEdit = (id: string) => {
    const t = Todos.find((todo) => todo.id === id);
    if (t && t.userId === userContextId) {
      setFormData({ title: t.title, description: t.todo });
      setEditId(id);
      setShowPopup(true);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", description: "" });
    setEditId(null);
    setShowPopup(false);
  };

  const handleTaskSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    settaskSearchInput(value);

    if (value.trim()) {
      const filteredTasks = Todos.filter(
        (todo) =>
          todo.title.toLowerCase().includes(value.toLowerCase()) ||
          todo.todo.toLowerCase().includes(value.toLowerCase())
      );
      setfilteredTasks(filteredTasks);
    } else {
      setfilteredTasks([]);
    }
  };
  const handleShowAdd = () => {
    setShowPopup(true);
  };

  return (
    <div className="w-full min-h-screen flex flex-col flex-1 relative font-sans bg-gray-300 pb-20 pt-5">
      <div className="flex justify-center items-center gap-2 my-2  w-[90%] mx-auto">
        <SearchInput
          taskSearchInput={taskSearchInput}
          handleTaskSearch={handleTaskSearch}
        />
        <button className="px-4 py-3 mb-4 bg-[#1a202c] text-white text-sm font-medium rounded-md cursor-pointer transition-colors duration-200 hover:bg-gray-700">
          <FaSearch />
        </button>
      </div>

      <button
        onClick={handleShowAdd}
        className="fixed bottom-8 right-8 w-12 h-12 flex items-center justify-center rounded-full bg-gray-900 text-white text-lg shadow-md hover:scale-105 transition-transform cursor-pointer"
      >
        <FaPlus size={18} />
      </button>

      <div className="w-[90%] mx-auto h-full  ">
        {loading ? (
          <Loader />
        ) : (
          <TodoList
            Todos={Todos}
            updateTodo={openEdit}
            deleteTodo={deleteTodo}
            filteredList={filteredTasks}
            searchInput={taskSearchInput}
            taskColor={highlightedTask}
          />
        )}
      </div>
      {showPopup && (
        <TodoModel
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          editId={editId}
        />
      )}
    </div>
  );
};

export default TaskManager;
