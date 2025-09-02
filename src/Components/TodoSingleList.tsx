import React from "react";
import { useTaskContext } from "../TaskContext/TaskContext";

interface TodoSingleListProps {
  item: {
    id: string;
    title: string;
    todo: string;
    createdAt: string;
    completed: boolean;
  };
  taskColor: string | null;
}

const TodoSingleList: React.FC<TodoSingleListProps> = ({ item, taskColor }) => {
  const { openEdit, deleteTodo } = useTaskContext();
  return (
    <li className="mb-2.5">
      <div
        className={`p-5 rounded-lg shadow-md flex justify-between items-center flex-wrap gap-2.5 max-md:flex-col max-md:items-stretch max-md:text-left ${
          taskColor === item.id ? "bg-green-300" : "bg-white"
        }`}
      >
        <div className="flex flex-col w-full p-2">
          <h3 className="m-0 text-lg font-semibold text-[#1a202c] flex-1 min-w-[200px] max-md:min-w-0 max-md:my-0.5">
            Title: {item.title}
          </h3>
          <p className="my-1 text-[#333333] flex-1 min-w-[200px] max-md:min-w-0 max-md:my-0.5">
            Description: {item.todo}
          </p>
        </div>
        <p className="my-1 text-xs text-[#5e5e5e] flex-1 min-w-[100px] max-md:min-w-0 max-md:my-0.5 font-medium">
          Time: {item.createdAt}
        </p>

        <div className="flex gap-1">
          <button
            className="py-2 px-4 border-none rounded-md text-sm font-medium cursor-pointer transition-colors duration-200 ml-1 bg-[#1a202c] text-white hover:bg-[#1a202c] max-md:my-1 max-md:mr-1 max-md:inline-block"
            onClick={() => openEdit(item.id)}
          >
            Edit
          </button>
          <button
            className="py-2 px-4 border-none rounded-md text-sm font-medium cursor-pointer transition-colors duration-200 ml-1 bg-[#e53e3e] text-white hover:bg-[#c53030] max-md:my-1 max-md:mr-1 max-md:inline-block"
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
