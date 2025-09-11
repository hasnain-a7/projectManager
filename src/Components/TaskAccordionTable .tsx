import React, { useState } from "react";
import { Plus, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Todo } from "@/TaskContext/TaskContext";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TaskDetailsAccordion from "./TaskDetailsAccordion";

// Props
interface TaskAccordionTableProps {
  tasks: Todo[];
  loading: boolean;
  handleshowpop: () => void;
  projectTitle: string;
}

const TaskAccordionTable: React.FC<TaskAccordionTableProps> = ({
  tasks,
  loading,
  projectTitle,
  handleshowpop,
}) => {
  const navigate = useNavigate();

  const getPriorityInfo = (dueDate: string | null) => {
    if (!dueDate) {
      return {
        label: "No Date",
        className: "bg-gray-200 text-gray-700",
      };
    }

    const today = new Date();
    const due = new Date(dueDate);
    const diffInTime = due.getTime() - today.getTime();
    const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));

    if (diffInDays < 0) {
      return {
        label: "Overdue",
        className: "bg-gray-300 text-gray-900 line-through",
      };
    }
    if (diffInDays <= 2) {
      return {
        label: "High",
        className: "bg-red-200 text-red-800",
      };
    }
    if (diffInDays <= 7) {
      return {
        label: "Medium",
        className: "bg-yellow-200 text-yellow-800",
      };
    }
    return {
      label: "Low",
      className: "bg-green-200 text-green-800",
    };
  };

  // Define fixed statuses in desired order
  const STATUSES = ["backlog", "pending", "inactive", "active", "completed"];

  // Group tasks by their status
  const groupedTasks = tasks.reduce((acc, task) => {
    const status = task.status || "backlog"; // default to backlog
    if (!acc[status]) acc[status] = [];

    acc[status].push({
      ...task,
      dueDate: task.dueDate || new Date().toISOString().split("T")[0],
    });
    return acc;
  }, {} as Record<string, Todo[]>);

  // Create sections in fixed order
  const taskSections = STATUSES.map((status) => {
    let badgeColor = "bg-gray-100 text-gray-800";

    switch (status) {
      case "backlog":
        badgeColor = "bg-gray-200 text-gray-800";
        break;
      case "pending":
        badgeColor = "bg-yellow-100 text-yellow-800";
        break;
      case "inactive":
        badgeColor = "bg-gray-300 text-gray-700";
        break;
      case "active":
        badgeColor = "bg-blue-100 text-blue-800";
        break;
      case "completed":
        badgeColor = "bg-green-100 text-green-800";
        break;
    }

    return {
      id: status,
      title: status.charAt(0).toUpperCase() + status.slice(1),
      badgeColor,
      tasks: groupedTasks[status] || [],
    };
  });

  return (
    <div className="min-h-full w-full">
      <Card className="shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="flex justify-between items-center text-lg">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">
                {projectTitle}'s Tasks
              </h4>
            </div>

            {!loading && (
              <div className="flex gap-2 bg-gray-50">
                <Button
                  variant="ghost"
                  size="sm"
                  className=" w-auto items-center justify-center bg-gray-300 text-gray-600 hover:bg-gray-500 hover:text-white cursor-pointer"
                  onClick={handleshowpop}
                >
                  <Plus className="h-4 w-4 " />
                </Button>
                <Button
                  size="sm"
                  className="bg-gray-900 text-gray-200 cursor-pointer hover:bg-gray-800"
                  onClick={() => navigate("/")}
                >
                  View Trello
                </Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Accordion
            type="multiple"
            defaultValue={["backlog", "in-progress"]}
            className="space-y-2"
          >
            {taskSections.map((section) => (
              <AccordionItem key={section.id} value={section.id} className=" ">
                <AccordionTrigger className="px-3 py-2 hover:no-underline">
                  <div className="flex items-center">
                    <Badge
                      className={`${section.badgeColor} w-20 mr-3 rounded-sm`}
                    >
                      {section.title}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      • {section.tasks.length} Task
                      {section.tasks.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-0 pb-0">
                  <div>
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
                      <div className="col-span-5">Name</div>
                      <div className="col-span-2">Priority</div>
                      <div className="col-span-2">Due Date</div>
                      <div className="col-span-3">Created Da</div>
                    </div>

                    {section.tasks.map((task, index) => (
                      <div
                        key={task.id}
                        className={`border-b ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <div className="grid grid-cols-12 gap-2 py-2 items-center">
                          <div className="col-span-5">
                            <TaskDetailsAccordion task={task} />
                          </div>
                          <div className="col-span-2 flex items-center">
                            {(() => {
                              const { label, className } = getPriorityInfo(
                                task.dueDate
                              );
                              return (
                                <Badge className={className}>{label}</Badge>
                              );
                            })()}
                          </div>
                          <div className="col-span-2 flex items-center">
                            <span className="text-sm">
                              {" "}
                              {task.dueDate
                                ? new Date(task.dueDate).toLocaleDateString()
                                : "—"}
                            </span>
                          </div>
                          <div className="col-span-3 flex items-center">
                            <span className="text-sm">
                              {task.createdAt
                                ? new Date(task.createdAt).toLocaleDateString()
                                : "—"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskAccordionTable;
