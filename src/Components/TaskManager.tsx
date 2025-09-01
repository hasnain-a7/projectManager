import React from "react";
import TodoList from "./TodoList";
import TodoModel from "./TodoModel";
import SearchInput from "./SearchInput";
import { FaPlus, FaSearch } from "react-icons/fa";
import Loader from "./Loader";
import { useTaskContext } from "../TaskContext/TaskContext";

const TaskManager: React.FC = () => {
  const {
    taskSearchInput,
    handleTaskSearch,
    showPopup,
    handleShowAdd,
    highlightedTask,
    loading,
  } = useTaskContext();

  return (
    <div className="w-full min-h-screen flex flex-col flex-1 relative font-sans bg-gray-300 pb-20 pt-5">
      <div className="flex justify-center items-center gap-2 my-2 w-[90%] mx-auto">
        <SearchInput
          taskSearchInput={taskSearchInput}
          handleTaskSearch={handleTaskSearch}
        />
        <button className="px-4 py-3 mb-4 bg-[#1a202c] text-white text-sm font-medium rounded-md cursor-pointer transition-colors duration-200 hover:bg-gray-700">
          <FaSearch />
        </button>
      </div>

      <button
        onClick={handleShowAdd}
        className="fixed bottom-8 right-8 w-12 h-12 flex items-center justify-center rounded-full bg-gray-900 text-white text-lg shadow-md hover:scale-105 transition-transform cursor-pointer"
      >
        <FaPlus size={18} />
      </button>

      <div className="w-[90%] mx-auto h-full">
        {loading ? <Loader /> : <TodoList taskColor={highlightedTask} />}
      </div>

      {showPopup && <TodoModel />}
    </div>
  );
};

export default TaskManager;
