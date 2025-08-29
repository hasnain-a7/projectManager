import React, { useState, useEffect } from "react";
import "../App.css";
import TodoList from "./TodoList";
import TodoModel from "./TodoModel";
import SearchInput from "./SearchInput";
import { db } from "../Config/firbase";
import { FaPlus } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
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
    const fetchTodos = async () => {
      if (!userContextId) return;

      try {
        setLoading(true);
        console.log("Fetching todos for userId:", userContextId);

        const q = query(
          collection(db, "todos"),
          where("userId", "==", userContextId)
        );
        const querySnapshot = await getDocs(q);

        const todosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Todo[];

        console.log("Fetched todos:", todosData);
        setTodos(todosData);
      } catch (error) {
        console.error("Error fetching todos:", error);
      } finally {
        setLoading(false); // stop loader
      }
    };

    fetchTodos();
  }, [userContextId]);

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
      }, 4000);
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

  return (
    <div className="todo-app">
      <div className="Search-box">
        <SearchInput
          taskSearchInput={taskSearchInput}
          handleTaskSearch={handleTaskSearch}
        />
        <button className="search-btn">
          <FaSearch />
        </button>
      </div>
      <button className="add-btn" onClick={() => setShowPopup(true)}>
        <FaPlus color="white" size={16} />
      </button>

      <div>
        {loading ? (
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="w-12 h-12 border-4 border-[#1a202c] border-t-transparent rounded-full animate-spin"></div>
          </div>
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
