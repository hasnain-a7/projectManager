import React from "react";
import { Plus, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Todo } from "@/TaskContext/TaskContext";
import { useNavigate } from "react-router-dom";
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

  // Priority label styles → now semantic
  const getPriorityInfo = (dueDate: string | null) => {
    if (!dueDate) {
      return { label: "No Date", className: "bg-muted text-muted-foreground" };
    }

    const today = new Date();
    const due = new Date(dueDate);
    const diffInTime = due.getTime() - today.getTime();
    const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));

    if (diffInDays < 0) {
      return {
        label: "Overdue",
        className: "bg-destructive text-destructive-foreground line-through",
      };
    }
    if (diffInDays <= 2) {
      return { label: "High", className: "bg-primary text-primary-foreground" };
    }
    if (diffInDays <= 7) {
      return {
        label: "Medium",
        className: "bg-secondary text-secondary-foreground",
      };
    }
    return { label: "Low", className: "bg-accent text-accent-foreground" };
  };

  const STATUSES = ["backlog", "pending", "inactive", "active", "completed"];

  const groupedTasks = tasks.reduce((acc, task) => {
    const status = task.status || "backlog";
    if (!acc[status]) acc[status] = [];
    acc[status].push({
      ...task,
      dueDate: task.dueDate || new Date().toISOString().split("T")[0],
    });
    return acc;
  }, {} as Record<string, Todo[]>);

  const taskSections = STATUSES.map((status) => {
    let badgeColor = "bg-muted text-muted-foreground";
    switch (status) {
      case "backlog":
        badgeColor = "bg-muted text-muted-foreground";
        break;
      case "pending":
        badgeColor =
          "bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
        break;
      case "inactive":
        badgeColor = "bg-muted text-muted-foreground";
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
    <div className="min-h-full w-full">
      <Card className="shadow-sm rounded-2xl bg-card text-card-foreground ">
        <CardHeader>
          <CardTitle className="flex justify-between items-center text-lg">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">{projectTitle}'s Tasks</h4>
            </div>

            {!loading && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-pointer"
                  onClick={handleshowpop}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  className="cursor-pointer"
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
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-card text-card-foreground text-xs font-semibold  uppercase">
                      <div className="col-span-5">Name</div>
                      <div className="col-span-2">Priority</div>
                      <div className="col-span-2">Due Date</div>
                      <div className="col-span-3">Created</div>
                    </div>

                    {section.tasks.map((task, index) => (
                      <div key={task.id} className="border-b bg-card">
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
