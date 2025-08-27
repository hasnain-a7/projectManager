import React from "react";
import TodoSingleList from "./TodoSingleList";

interface Todo {
  id: number;
  title: string;
  todo: string;
  createdAt: string;
  completed: boolean;
}

interface TodoListProps {
  Todos: Todo[];
  filteredList: Todo[];
  searchInput: string;
  updateTodo: (id: number) => void;
  deleteTodo: (idx: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  Todos,
  searchInput,
  filteredList,
  updateTodo,
  deleteTodo,
}) => {
  return (
    <ul className="todo-list">
      {filteredList.length > 0 && searchInput !== ""
        ? filteredList.map((item) => (
            <TodoSingleList
              key={item.id}
              item={item}
              updateTodo={updateTodo}
              deleteTodo={deleteTodo}
            />
          ))
        : Todos.map((item) => (
            <TodoSingleList
              key={item.id}
              item={item}
              updateTodo={updateTodo}
              deleteTodo={deleteTodo}
            />
          ))}
    </ul>
  );
};

export default TodoList;
