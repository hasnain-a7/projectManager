import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // for dynamic route
import { useTaskContext } from "../TaskContext/TaskContext";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { db } from "../Config/firbase";
import { updateDoc, doc } from "firebase/firestore";
import { FaPlus } from "react-icons/fa";
import TodoModel from "../components/TodoModel";

interface TrelloBoardProps {
  projectId?: string;
}

const TrelloBoard: React.FC<TrelloBoardProps> = () => {
  const { taskCache, handleShowAdd, showPopup } = useTaskContext();
  const { projectId } = useParams(); 
  const finalProjectId = projectId ;

  const [statusTasks, setStatusTasks] = useState<{ [key: string]: any[] }>({});
  const [loading, setLoading] = useState(true);

  const statuses = ["backlog", "pending", "active", "inactive", "completed"];

  useEffect(() => {
    let tasks: any[] = [];

    if (finalProjectId) {
      // Only that project’s tasks
      tasks = taskCache[finalProjectId]?.tasks || [];
    } else {
      // Flatten all tasks (dashboard view)
      tasks = Object.values(taskCache)
        .map((project) => project.tasks)
        .flat();
    }

    if (tasks.length === 0) {
      setLoading(true);
      setStatusTasks({});
    } else {
      const statusTasksObj: { [key: string]: any[] } = {};
      statuses.forEach((status) => {
        statusTasksObj[status] = tasks.filter((task) => task.status === status);
      });
      setStatusTasks(statusTasksObj);
      setLoading(false);
    }
  }, [taskCache, finalProjectId]);

  const updateTaskStatusInFirebase = async (
    taskId: string,
    newStatus: string
  ) => {
    try {
      const projectIdForTask = Object.keys(taskCache).find((pid) =>
        taskCache[pid].tasks.some((t) => t.id === taskId)
      );
      if (!projectIdForTask) return;

      const todoRef = doc(db, "Projects", projectIdForTask, "tasks", taskId);
      await updateDoc(todoRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleDragEnd = (event: any) => {
    const { source, destination } = event;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceId = source.droppableId;
    const destId = destination.droppableId;

    const newStatusTasks = { ...statusTasks };
    const movedTask = newStatusTasks[sourceId].splice(source.index, 1)[0];
    if (sourceId !== destId) {
      movedTask.status = destId;
    }
    newStatusTasks[destId].splice(destination.index, 0, movedTask);
    setStatusTasks(newStatusTasks);

    if (sourceId !== destId) {
      updateTaskStatusInFirebase(movedTask.id, destId);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-2 p-4 w-screen min-h-screen relative overflow-y-auto scrollbar-thin">
        {statuses.map((statusKey) => (
          <Droppable droppableId={statusKey} type="TASK" key={statusKey}>
            {(provided) => (
              <div
                className="flex-none rounded-2xl shadow-md transition-all duration-300 transform hover:scale-[1.02] p-3 min-w-[200px] max-w-[260px] max-h-min overflow-y-auto bg-[#101204] text-[#B6C2CF]"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h2 className="font-bold text-lg mb-3 capitalize text-[#B6C2CF]">
                  {statusKey}
                </h2>

                <div className="flex flex-col gap-3">
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    (statusTasks[statusKey] || []).map((todo, index) => (
                      <Draggable
                        key={todo.id}
                        draggableId={todo.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="relative p-3 flex flex-col gap-2 bg-[#2f383f] text-[#B6C2CF] rounded-lg shadow-sm hover:shadow-md transition cursor-pointer hover:border border-white"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {todo.attechments?.length > 0 && (
                              <img
                                src={todo.attechments[0]}
                                alt="todo-attachment"
                                className="w-full h-28 object-cover rounded-md"
                              />
                            )}
                            <span
                              className={`text-sm ${
                                todo.status === "completed"
                                  ? "line-through text-gray-500"
                                  : "text-[#B6C2CF]"
                              }`}
                            >
                              {todo.title}
                            </span>
                            {todo.todo && (
                              <p className="text-xs text-[#9DAAB6] line-clamp-3">
                                {todo.todo}
                              </p>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  <div className="w-full">
                    <div
                      className="flex gap-2 cursor-pointer"
                      onClick={handleShowAdd}
                    >
                      <button className="cursor-pointer">
                        <FaPlus />
                      </button>
                      <h3>Add Card</h3>
                    </div>
                  </div>
                </div>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>

      {/* Add Task Modal */}
      {showPopup && finalProjectId && <TodoModel projectId={finalProjectId} />}
    </DragDropContext>
  );
};

export default TrelloBoard;
