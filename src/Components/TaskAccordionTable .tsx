"use client";

import React from "react";
import { Plus, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Task } from "@/TaskContext/TaskContext";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TaskDetailsAccordion from "./TaskDetailsAccordion";
import { Dialog, DialogTrigger, DialogContent } from "@radix-ui/react-dialog";
import { useUserContextId } from "@/AuthContext/UserContext";
import TodoModel from "./TodoModel";
interface TaskAccordionTableProps {
  tasks: Task[];
  loading: boolean;
  handleshowpop: () => void;
  projectTitle: string;
}

const TaskAccordionTable: React.FC<TaskAccordionTableProps> = ({
  tasks,
  loading,
  projectTitle,
}) => {
  const navigate = useNavigate();
  const userContextId = useUserContextId();

  // const handleDeleteTask = async (taskId: string) => {
  //   if (!userContextId) return;

  //   const confirmDelete = window.confirm(
  //     "Are you sure you want to delete this task?"
  //   );
  //   if (!confirmDelete) return;

  //   try {
  //     await deleteTaskFromProject(projectTitle, userContextId, taskId);
  //     alert("Task deleted successfully!");
  //   } catch (err) {
  //     console.error(err);
  //     alert("Failed to delete task.");
  //   }
  // };
  const getPriorityInfo = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffInTime = due.getTime() - today.getTime();
    const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));

    if (diffInDays < 0)
      return {
        label: "Overdue",
        className: "bg-destructive text-destructive-foreground line-through",
      };
    if (diffInDays <= 2)
      return { label: "High", className: "bg-primary text-primary-foreground" };
    if (diffInDays <= 7)
      return {
        label: "Medium",
        className: "bg-secondary text-secondary-foreground",
      };
    return { label: "Low", className: "bg-accent text-accent-foreground" };
  };

  const STATUSES = ["backlog", "pending", "inactive", "active", "completed"];

  // Group tasks by status, ensure dueDate is always a string
  const groupedTasks = tasks.reduce((acc, task) => {
    const status = task.status || "backlog";
    if (!acc[status]) acc[status] = [];
    acc[status].push({
      ...task,
      dueDate: task.dueDate || new Date().toISOString().split("T")[0],
    } as Task & { dueDate: string });
    return acc;
  }, {} as Record<string, (Task & { dueDate: string })[]>);

  const taskSections = STATUSES.map((status) => {
    let badgeColor = "bg-muted text-muted-foreground";
    switch (status) {
      case "pending":
        badgeColor =
          "bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
        break;
      case "active":
        badgeColor = "bg-primary text-primary-foreground";
        break;
      case "completed":
        badgeColor =
          "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200";
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
    <div className="min-h-full w-full p-0">
      <Card className=" border border-border/40 rounded-lg shadow-sm hover:shadow-md hover:border-border transition-all duration-300 cursor-pointer">
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-lg">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">
                {projectTitle.toUpperCase()}'s Tasks
              </h4>
            </div>

            {!loading && (
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <TodoModel projectTitle={projectTitle} />
                  </DialogContent>
                </Dialog>

                <Button
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => navigate("/dashboard")}
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
            defaultValue={["backlog"]}
            className="space-y-2"
          >
            {taskSections.map((section) => (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger className="px-3 py-2 hover:no-underline">
                  <div className="flex items-center">
                    <Badge
                      className={`${section.badgeColor} w-20 mr-3 rounded-sm`}
                    >
                      {section.title}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      • {section.tasks.length} Task
                      {section.tasks.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-0 pb-0">
                  <div>
                    <div className="hidden sm:grid grid-cols-12 gap-2 px-3 py-2 bg-card text-card-foreground text-xs font-semibold uppercase">
                      <div className="col-span-5">Name</div>
                      <div className="col-span-2">Priority</div>
                      <div className="col-span-2">Due Date</div>
                      <div className="col-span-3">Created</div>
                    </div>

                    {section.tasks.map((task) => (
                      <div key={task.id} className="border-b bg-card">
                        <div className="hidden sm:grid grid-cols-12 gap-2 py-2 items-center">
                          <div className="col-span-5 ">
                            <TaskDetailsAccordion
                              task={task}
                              projectTitle={projectTitle}
                            />
                          </div>
                          <div className="col-span-2 flex items-center">
                            <Badge
                              className={
                                getPriorityInfo(task.dueDate).className
                              }
                            >
                              {getPriorityInfo(task.dueDate).label}
                            </Badge>
                          </div>
                          <div className="col-span-2 flex items-center">
                            <span className="text-sm">
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

                        <div className="sm:hidden flex flex-col gap-1 px-3 py-2">
                          <TaskDetailsAccordion
                            task={task}
                            projectTitle={projectTitle}
                          />
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Priority:</span>
                            <Badge
                              className={
                                getPriorityInfo(task.dueDate).className
                              }
                            >
                              {getPriorityInfo(task.dueDate).label}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Due Date:</span>
                            <span>
                              {task.dueDate
                                ? new Date(task.dueDate).toLocaleDateString()
                                : "—"}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Created:</span>
                            <span>
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
