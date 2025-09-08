"use client";

import * as React from "react";
import { useParams } from "react-router-dom";
import TodoModel from "@/Components/TodoModel";
import TodoSingleList from "@/Components/TodoSingleList";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { useTaskContext } from "../TaskContext/TaskContext";

const ProjectPage: React.FC = () => {
  const { projectId } = useParams();
  const { todos, showPopup, handleShowAdd } = useTaskContext();
  const [newTaskTitle, setNewTaskTitle] = React.useState("");

  return (
    <div className="p-2 space-y-2">
      <h1 className="text-2xl font-bold">Project: {projectId}</h1>

      <div className="flex gap-2">
        <Input
          placeholder="New task title..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
      </div>
      <button
        onClick={handleShowAdd}
        className="fixed bottom-8 right-8 w-12 h-12 flex items-center justify-center rounded-full bg-[#101204] text-white text-lg shadow-md hover:scale-105 transition-transform cursor-pointer"
      >
        <FaPlus size={18} />
      </button>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {todos.map((task) => (
          <TodoSingleList key={task.id} item={task} />
        ))}
      </ul>

      {showPopup && <TodoModel />}
    </div>
  );
};

export default ProjectPage;
