import React, { useState } from "react";
import { Plus, FileText, Calendar, User, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Todo } from "@/TaskContext/TaskContext";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TaskDetailsAccordion from "./TaskDetailsAccordion";

interface TaskAccordionTableProps {
  tasks: Todo[];
}

const TaskAccordionTable: React.FC<TaskAccordionTableProps> = ({ tasks }) => {
  const [expandedTasks, setExpandedTasks] = useState({});

  const toggleTaskDetails = (taskId: string | number) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  // Group tasks dynamically by status
  const groupedTasks = tasks.reduce((acc, task) => {
    const status = task.status || "backlog";
    if (!acc[status]) acc[status] = [];

    acc[status].push({
      ...task,
      dueDate: task.createdAt || new Date().toLocaleDateString(), // default due date
    });
    return acc;
  }, {} as Record<string, Todo[]>);

  const taskSections = Object.keys(groupedTasks).map((status) => {
    let badgeColor = "bg-gray-100 text-gray-800";

    switch (status) {
      case "in-progress":
        badgeColor = "bg-green-100 text-green-800";
        break;
      case "completed":
        badgeColor = "bg-blue-100 text-blue-800";
        break;
      case "active":
        badgeColor = "bg-yellow-100 text-yellow-800";
        break;
      case "backlog":
        badgeColor = "bg-blue-200 text-black";

        break;
      case "inactive":
        badgeColor = "bg-gray-100 text-gray-800";
        break;
    }

    return {
      id: status,
      title: status.toUpperCase(),
      badgeColor,
      tasks: groupedTasks[status],
    };
  });

  const getPriorityVariant = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);

    const diffInTime = due.getTime() - today.getTime();
    const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));

    if (diffInDays <= 0) return "destructive"; // overdue or today → red
    if (diffInDays <= 7) return "warning"; // within a week → orange
    if (diffInDays <= 30) return "secondary"; // within a month → gray
    return "default";
  };

  return (
    <div className="min-h-full w-full ">
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg">
            <FileText className="h-5 w-5 mr-2 text-blue-600" /> My Tasks
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Accordion
            type="multiple"
            defaultValue={["backlog", "in-progress"]}
            className="space-y-2"
          >
            {taskSections.map((section) => (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="border rounded-lg"
              >
                <AccordionTrigger className="px-3 py-2 hover:no-underline">
                  <div className="flex items-center">
                    <Badge className={`${section.badgeColor} mr-3`}>
                      {section.title}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      • {section.tasks.length} task
                      {section.tasks.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-0 pb-0">
                  <div className="border-t">
                    <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      <div className="col-span-6">Name</div>
                      <div className="col-span-3">Priority</div>
                      <div className="col-span-3">Due Date</div>
                    </div>

                    {/* Task Rows */}
                    {section.tasks.map((task, index) => (
                      <div
                        key={task.id}
                        className={`border-b last:border-b-0 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                      >
                        <div className="grid grid-cols-12 gap-2 px-3 py-2 items-center">
                          <div className="col-span-6">
                            <TaskDetailsAccordion task={task} />
                          </div>
                          <div className="col-span-3 flex items-center">
                            <Badge variant={getPriorityVariant(task.dueDate)}>
                              {task.priority || "high"}
                            </Badge>
                          </div>
                          <div className="col-span-3 flex items-center">
                            <span className={`text-sm `}>{task.dueDate}</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="p-4 border-t bg-gray-50/30">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-600 hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add task
                      </Button>
                    </div>
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
