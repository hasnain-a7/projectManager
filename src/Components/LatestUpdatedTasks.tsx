import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { FaEdit } from "react-icons/fa";
import TodoModel from "./TodoModel";
import { Badge } from "./ui/badge";

interface LatestTask {
  id?: string;
  title: string;
  todo: string;
  createdAt: string;
  updatedAt?: string;
  status: string;
  attachments?: string[];
  dueDate?: string;
  userId?: string | null;
  projectId?: string;
  projectTitle: string;
}
interface LatestUpdatedTasksProps {
  latestTasks: LatestTask[];
}

const LatestUpdatedTasks: React.FC<LatestUpdatedTasksProps> = ({
  latestTasks,
}) => {
  return (
    <Card className="w-full md:w-1/3 h-96 border border-border/40 rounded-lg  shadow-md bg-card">
      <CardHeader className="flex justify-between -ml-3">
        <CardTitle className="text-md">Latest Tasks</CardTitle>
        <Badge variant="outline" className="text-sm -mr-3">
          {latestTasks.length}
        </Badge>
      </CardHeader>

      <CardContent className="p-0 -mt-1">
        <ScrollArea className="h-80 w-full">
          <div className="flex flex-col gap-2 p-2">
            {latestTasks?.map((task) => (
              <Card
                key={task.id}
                className="border rounded-md p-2 relative 
               transition-transform duration-200 ease-in-out 
               hover:-translate-y-1 hover:shadow-md cursor-pointer"
              >
                <CardContent className="p-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-gray-500">
                        Project: {task.projectTitle}
                      </p>
                      <p className="text-xs text-gray-500">
                        Last updated:{" "}
                        {new Date(task.updatedAt || "").toLocaleString()}
                      </p>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <FaEdit
                          size={16}
                          className="text-muted-foreground hover:text-primary cursor-pointer"
                        />
                      </DialogTrigger>
                      <DialogContent>
                        <TodoModel
                          projectTitle={task.projectTitle}
                          taskToEdit={task}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default LatestUpdatedTasks;
