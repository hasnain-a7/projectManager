import React from "react";

type TaskDetailModalProps = {
  task: any | null;
  onClose: () => void;
};

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-50 transition-all ease-in duration-100">
      <div className="h-[400px] w-[1000px] flex bg-card rounded-lg overflow-hidden relative shadow-lg ">
        <div className="w-1/2 p-5 flex flex-col justify-between overflow-y-auto">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {task.title}
          </h2>

          {task.todo && (
            <div className="mb-4">
              <p className="text-sm text-gray-300 font-semibold mb-1">
                Description:
              </p>
              <p className="text-sm text-gray-300 line-clamp-10">{task.todo}</p>
            </div>
          )}

          <div className="text-xs flex justify-between items-center w-full gap-2 text-gray-400 mt-auto">
            <span className="capitalize font-medium">
              Category:
              <span className="text-gray-300 p-2">{task.categories}</span>
            </span>
            <span className="capitalize font-medium">
              Status:
              <span className="text-gray-300 p-2">{task.status}</span>
            </span>
          </div>
        </div>

        <div className="w-1/2 p-5 flex items-center justify-center bg-[#1a1a1a] ">
          <button
            className="absolute top-2 right-2 text-gray-400 cursor-pointer  hover:text-white font-bold"
            onClick={onClose}
          >
            ✖
          </button>
          {task.attechments && task.attechments.length > 0 ? (
            <img
              src={task.attechments[0]}
              alt="attachment"
              className="w-full h-full object-cover rounded-3xl p-3"
            />
          ) : (
            <p className="text-gray-500">No Image</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
