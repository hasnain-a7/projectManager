import React from "react";
import TodoSingleList from "./TodoSingleList";

interface Todo {
  id: string;
  title: string;
  todo: string;
  createdAt: string;
  completed: boolean;
}

interface TodoListProps {
  Todos: Todo[];
  filteredList: Todo[];
  searchInput: string;
  taskColor: string | null;
  updateTodo: (id: string) => void;
  deleteTodo: (idx: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  Todos,
  searchInput,
  filteredList,
  taskColor,
  updateTodo,
  deleteTodo,
}) => {
  return (
    <ul className="todo-list">
      {searchInput !== "" ? (
        filteredList.length > 0 ? (
          filteredList.map((item) => (
            <TodoSingleList
              key={item.id}
              item={item}
              updateTodo={updateTodo}
              deleteTodo={deleteTodo}
              taskColor={taskColor}
            />
          ))
        ) : (
          <li className="text-[#1a202c] font-medium flex justify-center items-center text-center w-full pt-20">
            <p>Todo not found</p>
          </li>
        )
      ) : (
        Todos.map((item) => (
          <TodoSingleList
            key={item.id}
            item={item}
            updateTodo={updateTodo}
            deleteTodo={deleteTodo}
            taskColor={taskColor}
          />
        ))
      )}
    </ul>
  );
};

export default TodoList;
