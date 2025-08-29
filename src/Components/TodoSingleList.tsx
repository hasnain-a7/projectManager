import React from "react";

interface TodoSingleListProps {
  item: {
    id: string;
    title: string;
    todo: string;
    createdAt: string;
    completed: boolean;
  };
  taskColor: string | null;
  updateTodo: (id: string) => void;
  deleteTodo: (idx: string) => void;
}

const TodoSingleList: React.FC<TodoSingleListProps> = ({
  item,
  updateTodo,
  taskColor,
  deleteTodo,
}) => {
  return (
    <li className="todo-list-item">
      <div
        className={`todo-item-content bg-amber-100 ${
          taskColor === item.id ? "bg-green-300" : "bg-white"
        }`}
      >
        <div className="todo-item-text">
          <h3 className="todo-item-title">Title: {item.title}</h3>
          <p className="todo-item-task">Description: {item.todo}</p>
        </div>
        <p className="todo-item-date">Time: {item.createdAt}</p>

        <div className="todo-item-actions">
          <button
            className="todo-update-btn"
            onClick={() => updateTodo(item.id)}
          >
            Edit
          </button>
          <button
            className="todo-delete-btn"
            onClick={() => deleteTodo(item.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
};

export default TodoSingleList;
