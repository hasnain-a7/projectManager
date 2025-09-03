import React, { useState } from "react";
import { useTaskContext } from "../TaskContext/TaskContext";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import TaskDetailModal from "./TrelloDetailPage";

interface TodoSingleListProps {
  item: {
    id: string;
    title: string;
    todo: string;
    createdAt: string;
    completed: boolean;
  };
  taskColor?: string | null;
}

const TodoSingleList: React.FC<TodoSingleListProps> = ({ item }) => {
  const { openEdit, deleteTodo } = useTaskContext();
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <li className="mb-2.5">
        <div
          className={`p-4 rounded-md border border-[#2C333A] shadow-sm min-h-[220px] max-w-[300px]
             flex flex-col justify-between gap-2 bg-[#101204] text-[#B6C2CF] cursor-default`}
        >
          <h3 className="text-lg font-semibold text-[#B6C2CF]">{item.title}</h3>

          <div className="flex flex-col max-w-[100%]">
            <p className="text-[#B6C2CF] line-clamp-3">{item.todo}</p>

            <button
              className="text-sm text-blue-400 hover:underline mt-1 self-start cursor-pointer"
              onClick={() => setShowDetail(!showDetail)}
            >
              Details..
            </button>
          </div>

          <div className="flex justify-between  mt-2">
            <p className="text-xs text-[#B6C2CF] mt-1">
              Created: {item.createdAt}
            </p>
            <div className=" flex gap-2 ml-2">
              <button
                className="p-2.5 bg-[#c8cbd1] text-[#2a2f36] font-medium cursor-pointer rounded-md "
                onClick={() => openEdit(item.id)}
              >
                <FaRegEdit size={16} />
              </button>
              <button
                className="p-2.5 bg-[#e25656] text-[#B6C2CF] cursor-pointer rounded-md hover:bg-[#c53030]"
                onClick={() => deleteTodo(item.id)}
              >
                <MdOutlineDelete size={16} />
              </button>
            </div>
          </div>
        </div>
      </li>

      {showDetail && (
        <TaskDetailModal task={item} onClose={() => setShowDetail(false)} />
      )}
    </>
  );
};

export default TodoSingleList;
