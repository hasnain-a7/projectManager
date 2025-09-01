import React from "react";
import TodoSingleList from "./TodoSingleList";
import { useTaskContext } from "../TaskContext/TaskContext"; // import your context hook

interface TodoListProps {
  taskColor: string | null;
}

const TodoList: React.FC<TodoListProps> = ({ taskColor }) => {
  const { todos, filteredTasks, taskSearchInput } = useTaskContext();
  const listToRender = taskSearchInput !== "" ? filteredTasks : todos;
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-[100%] w-[100%]">
      {listToRender.length > 0 ? (
        listToRender.map((item) => (
          <TodoSingleList key={item.id} item={item} taskColor={taskColor} />
        ))
      ) : (
        <li className="text-[#1a202c] font-medium flex justify-center items-center text-center w-full pt-20">
          <p>Todo not found</p>
        </li>
      )}
    </ul>
  );
};

export default TodoList;
