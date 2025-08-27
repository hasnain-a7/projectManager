import React from "react";

interface TodoSingleListProps {
  item: {
    id: number;
    title: string;
    todo: string;
    createdAt: string;
    completed: boolean;
  };
  updateTodo: (id: number) => void;
  deleteTodo: (idx: number) => void;
}

const TodoSingleList: React.FC<TodoSingleListProps> = ({
  item,
  updateTodo,
  deleteTodo,
}) => {
  return (
    <li className="todo-list-item">
      <div className="todo-item-content">
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
