import React, { useState } from "react";
import { useTaskContext } from "../TaskContext/TaskContext";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { db } from "../Config/firbase";
import { updateDoc, doc } from "firebase/firestore";

const DashboardPage: React.FC = () => {
  const { todos } = useTaskContext();

  const [tasks, setTasks] = useState(todos.filter((t) => !t.completed));
  const [done, setDone] = useState(todos.filter((t) => t.completed));
  const [status, setStatus] = useState<string[]>([]);
  const handleTaskcompeletedFirebase = async (task: object) => {
    const todoRef = doc(db, "todos", task.id);
    await updateDoc(todoRef, { completed: true });
  };

  const handleDragEnd = (event) => {
    const { source, destination } = event;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;
    if (source.droppableId === "tasks" && destination.droppableId === "done") {
      const movedTask = tasks[source.index];
      handleTaskcompeletedFirebase(movedTask);
      const newTasks = tasks.filter((_, index) => index !== source.index);
      setTasks(newTasks);

      const newDone = [...done];
      newDone.splice(destination.index, 0, { ...movedTask, completed: true });
      setDone(newDone);
    }
  };
  const statuses = ["backlog", "pending", "active", "inactive", "cancelled"];
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-wrap gap-6 p-6 pb-20  h-screen bg-[#D1D5DC]">
        <Droppable droppableId="tasks">
          {(provided) => (
            <div
              className="flex-1 bg-green-50 rounded-lg shadow-md p-5 border border-green-200"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <h2 className="font-bold text-xl mb-4 text-green-700">Default</h2>
              <div className="flex flex-col gap-3">
                {tasks.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <div
                        className="p-4 flex justify-between bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className="flex justify-between gap-2">
                          <h3 className="text-md font-medium">Title:</h3>
                          {item.title}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
        {statuses.map((statusKey) => (
          <div
            key={statusKey}
            className="bg-gray-100 rounded-lg p-4 min-w-[250px] flex flex-col"
          >
            <h2 className="font-bold text-lg mb-4 capitalize">{statusKey}</h2>

            <div className="flex flex-col gap-3">
              {todos
                .filter((todo) => todo.status === statusKey)
                .map((todo) => (
                  <div
                    key={todo.id}
                    className="p-4 flex gap-3 bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer"
                  >
                    <h3 className="text-md font-medium">Title:</h3>
                    {todo.title}
                  </div>
                ))}
            </div>
          </div>
        ))}

        <Droppable droppableId="done" direction="vertical">
          {(provided) => (
            <div
              className="flex-1 bg-cyan-50 rounded-lg shadow-md p-5 border border-cyan-200"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <h2 className="font-bold text-xl mb-4 text-cyan-700">
                Done Tasks
              </h2>
              <div className="flex flex-col gap-3">
                {done.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <div
                        className="p-4 flex justify-between bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className="flex justify-between gap-2">
                          <h3 className="text-md font-medium">Title:</h3>

                          {item.title}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default DashboardPage;
