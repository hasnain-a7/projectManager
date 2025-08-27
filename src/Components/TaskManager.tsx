import React, { useState, useEffect } from "react";
import "../App.css";
import TodoList from "./TodoList";
import TodoModel from "./TodoModel";
import SearchInput from "./SearchInput";
import { db } from "../Config/firbase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  todo: string;
}
interface FormData {
  title: string;
  description: string;
}
const TaskManager: React.FC = () => {
  const [Todos, setTodos] = useState<Todo[]>(() => {
    const storedTodos = localStorage.getItem("todos");
    return storedTodos ? JSON.parse(storedTodos) : [];
  });

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [taskSearchInput, settaskSearchInput] = useState<string>("");
  const [filteredTasks, setfilteredTasks] = useState<Todo[]>([]);

  const todoCollectionRef = collection(db, "todos");
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const querySnapshot = await getDocs(todoCollectionRef);

        const finalTodo: Todo[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Todo, "id">),
        }));

        setTodos(finalTodo);
        console.log("Fetched todos:", finalTodo);
      } catch (error: string | any) {
        console.error("Error fetching todos: ", error.message);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (formData.title.length > 3 && formData.description) {
      const newTodo = {
        title: formData.title,
        completed: false,
        createdAt: new Date().toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        todo: formData.description,
      };

      const docRef = await addDoc(collection(db, "todos"), newTodo);

      setTodos([...Todos, { id: docRef.id, ...newTodo }]);

      resetForm();
    } else {
      alert("Please enter valid title (min 3 chars) and description.");
    }
  };

  const updateTodo = async () => {
    if (editId !== null) {
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
    if (window.confirm("Delete this todo?")) {
      try {
        await deleteDoc(doc(db, "todos", id));
        setTodos(Todos.filter((t) => t.id !== id));
      } catch (err) {
        console.error("Error deleting todo:", err);
      }
    }
  };

  const openEdit = (id: string) => {
    const t = Todos.find((todo) => todo.id === id);
    if (t) {
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

    if (value.toLowerCase()) {
      const filteredTasks = Todos.filter(
        (todo) =>
          todo.title.toLowerCase().includes(value) ||
          todo.todo.toLowerCase().includes(value)
      );
      setfilteredTasks(filteredTasks);
    }
  };

  return (
    <div className="todo-app">
      <div className="Search-box">
        <SearchInput
          taskSearchInput={taskSearchInput}
          handleTaskSearch={handleTaskSearch}
        />

        <button className="add-btn" onClick={() => setShowPopup(true)}>
          Add
        </button>
      </div>

      <div className="task-list">
        <TodoList
          Todos={Todos}
          updateTodo={openEdit}
          deleteTodo={deleteTodo}
          filteredList={filteredTasks}
          searchInput={taskSearchInput}
        />
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
