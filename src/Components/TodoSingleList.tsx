"use client";

import React, { useState } from "react";

import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import TaskDetailModal from "./TrelloDetailPage";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TodoSingleListProps {
  item: {
    id: string;
    title: string;
    todo: string;
    createdAt: string;
    completed: boolean;
  };
  taskColor?: string | null;
  projectid: string;
  deleteProjectTask: (projectId: string, taskId: string) => Promise<void>;
  updateProjectTask: any;
  openEdit: (id: string) => void;
}

const TodoSingleList: React.FC<TodoSingleListProps> = ({
  item,
  projectid,
  deleteProjectTask,

  openEdit,
}) => {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <li>
        <Card className="min-h-[200px] max-w-[300px] bg-[#101204] text-[#B6C2CF] shadow-sm border border-[#2C333A] flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {item.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col ">
            <p className="line-clamp-4">{item.todo}</p>
            <Button
              variant="link"
              size="sm"
              className="p-0 text-blue-400 hover:underline self-start"
              onClick={() => setShowDetail(!showDetail)}
            >
              Details..
            </Button>
          </CardContent>

          <CardFooter className="flex justify-between items-center">
            <p className="text-xs text-[#B6C2CF]">Created: {item.createdAt}</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => openEdit(item.id)}
              >
                <FaRegEdit size={14} />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => deleteProjectTask(projectid, item.id)}
              >
                <MdOutlineDelete size={14} />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </li>

      {showDetail && (
        <TaskDetailModal task={item} onClose={() => setShowDetail(false)} />
      )}
    </>
  );
};

export default TodoSingleList;
