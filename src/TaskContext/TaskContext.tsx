import React, { createContext, useContext, useState, useEffect } from "react";
import { useUserContextId } from "../AuthContext/UserContext";
import { db, auth } from "../Config/firbase";
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
import { onAuthStateChanged } from "firebase/auth";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  todo: string;
  userId: string;
  status: string;
  categories?: string;
  attechment?: string;
}

interface FormData {
  title: string;
  description: string;
  status: string;
}

interface TodoContextType {
  todos: Todo[];
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  loading: boolean;
  showPopup: boolean;
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
  highlightedTask: string | null;
  addTodo: (userId: string) => void;
  updateTodo: () => void;
  deleteTodo: (id: string) => void;
  openEdit: (id: string) => void;
  handleTaskSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  taskSearchInput: string;
  filteredTasks: Todo[];
  handleShowAdd: () => void;
  editId: string | null;
  resetForm: () => void;
}

const TaskContext = createContext<TodoContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    status: "backlog",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [taskSearchInput, settaskSearchInput] = useState("");
  const [filteredTasks, setFilteredTasks] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [highlightedTask, setHighlightedTask] = useState<string | null>(null);
  const { userContextId } = useUserContextId();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const fetchTodos = async () => {
          try {
            setLoading(true);
            const q = query(
              collection(db, "todos"),
              where("userId", "==", user.uid)
            );
            const querySnapshot = await getDocs(q);
            const todosData = querySnapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            })) as Todo[];
            setTodos(todosData);
            console.log(todosData);
          } catch (err) {
            console.error("Error fetching todos:", err);
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

  const addTodo = async (userId: string) => {
    if (formData.title.length > 3 && formData.description) {
      setLoading(true);
      try {
        const newTodo = {
          title: formData.title,
          todo: formData.description,
          completed: false,
          createdAt: new Date().toLocaleString(),
          userId: userId ?? "",
          status: formData.status,
          categories: "optional",
          attechments: "/img.png",
        };
        const docRef = await addDoc(collection(db, "todos"), newTodo);
        setTodos([{ id: docRef.id, ...newTodo }, ...todos]);
        console.log(todos);
        setHighlightedTask(docRef.id);
        setTimeout(() => setHighlightedTask(null), 3000);
        resetForm();
      } catch (err) {
        console.error("Error adding todo:", err);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please enter a valid title and description.");
    }
  };

  const updateTodo = async () => {
    if (editId && userContextId) {
      setLoading(true);
      try {
        const todoRef = doc(db, "todos", editId);
        await updateDoc(todoRef, {
          title: formData.title,
          todo: formData.description,
          status: formData.status,
        });
        setTodos(
          todos.map((t) =>
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
      } catch (err) {
        console.error("Error updating todo:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteTodo = async (id: string) => {
    if (window.confirm("Delete this todo?") && userContextId) {
      try {
        await deleteDoc(doc(db, "todos", id));
        setTodos(todos.filter((t) => t.id !== id));
        setFilteredTasks(filteredTasks.filter((t) => t.id !== id));
      } catch (err) {
        console.error("Error deleting todo:", err);
      }
    }
  };

  const openEdit = (id: string) => {
    const t = todos.find((todo) => todo.id === id);
    if (t && t.userId === userContextId) {
      setFormData({ title: t.title, description: t.todo, status: t.status });
      setEditId(id);
      setShowPopup(true);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", status: formData.status });
    setEditId(null);
    setShowPopup(false);
  };

  const handleTaskSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    settaskSearchInput(value);
    if (value.trim()) {
      const filtered = todos.filter(
        (todo) =>
          todo.title.toLowerCase().includes(value.toLowerCase()) ||
          todo.todo.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredTasks(filtered);
    } else {
      setFilteredTasks([]);
    }
  };

  const handleShowAdd = () => {
    setFormData({ title: "", description: "", status: formData.status });
    setEditId(null);
    setShowPopup(true);
  };

  return (
    <TaskContext.Provider
      value={{
        todos,
        formData,
        setFormData,
        loading,
        showPopup,
        setShowPopup,
        highlightedTask,
        addTodo,
        updateTodo,
        deleteTodo,
        openEdit,
        handleTaskSearch,
        taskSearchInput,
        filteredTasks,
        handleShowAdd,
        editId,
        resetForm,
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
