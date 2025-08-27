import React, { useState, useEffect } from "react";
import "../App.css";
import TodoList from "./TodoList";
import TodoModel from "./TodoModel";
import SearchInput from "./SearchInput";
interface Todo {
  id: number;
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
  const [editId, setEditId] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [taskSearchInput, settaskSearchInput] = useState<string>("");
  const [filteredTasks, setfilteredTasks] = useState<Todo[]>([]);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(Todos));
  }, [Todos]);

  const addTodo = () => {
    if (formData.title.length > 3 && formData.description) {
      const newTodo: Todo = {
        id: Math.floor(Math.random() * 1000) + 1,
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
      setTodos([...Todos, newTodo]);
      resetForm();
    } else {
      alert("Please enter valid title (min 3 chars) and description.");
    }
  };

  const updateTodo = () => {
    if (editId !== null) {
      setTodos(
        Todos.map((t) =>
          t.id === editId
            ? { ...t, title: formData.title, todo: formData.description }
            : t
        )
      );
      resetForm();
    }
  };

  const handleSubmit = () => {
    if (editId === null) addTodo();
    else updateTodo();
  };

  const deleteTodo = (id: number) => {
    if (window.confirm("Delete this todo?")) {
      setTodos(Todos.filter((t) => t.id !== id));
    }
  };

  const openEdit = (id: number) => {
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
      console.log(filteredTasks);
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

      <TodoList
        Todos={Todos}
        updateTodo={openEdit}
        deleteTodo={deleteTodo}
        filteredList={filteredTasks}
        searchInput={taskSearchInput}
      />

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
