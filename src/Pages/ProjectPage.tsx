"use client";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import TodoModel, { type TaskFormData } from "@/components/TodoModel";
import TaskAccordionTable from "@/components/TaskAccordionTable ";
import { useTaskContext, type Task } from "../TaskContext/TaskContext";
import Loader from "@/components/Loader";

const ProjectPage: React.FC = () => {
  const { projectId } = useParams();
  const { taskCache, loading, addTaskToProjectByTitle, setTaskCache } =
    useTaskContext();
  const [showPopup, setShowPopup] = useState(false);

  const projectDocId = Object.keys(taskCache).find(
    (id) => taskCache[id].title === projectId
  );
  const specificTasks = projectDocId ? taskCache[projectDocId].tasks : [];

  const handleAddTask = async (formData: TaskFormData) => {
    if (!projectDocId) return;

    try {
      const userId = specificTasks[0]?.userId || "";
      const taskId = await addTaskToProjectByTitle(
        projectId!,
        userId,
        formData
      );

      const newTask: Task = {
        id: taskId,
        ...formData,
        userId,
      };

      setTaskCache((prev) => ({
        ...prev,
        [projectId!]: {
          title: projectId!,
          tasks: [...(prev[projectId!]?.tasks || []), newTask],
        },
      }));

      setShowPopup(false);
    } catch (err) {
      console.error("❌ Failed to add task", err);
    }
  };

  return (
    <div className="min-h-screen w-full p-2 space-y-4 flex flex-col bg-background text-foreground">
      <div className="flex-1 overflow-auto">
        {loading ? (
<div className="flex flex-col justify-center items-center h-full py-20">
  <Loader /> {/* Optional loader from dev branch */}
  <span className="text-muted-foreground text-lg mt-2">
    Loading tasks...
  </span>
</div>
        ) : (
          <TaskAccordionTable
            tasks={specificTasks}
            loading={loading}
            handleshowpop={() => setShowPopup(true)}
            projectTitle={projectId!}
          />
        )}
      </div>

      {showPopup && <TodoModel projectTitle={projectId!} />}
    </div>
  );
};

export default ProjectPage;
