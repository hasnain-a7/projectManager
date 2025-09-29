import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Task } from "@/TaskContext/TaskContext";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LatestUpdatedTasksProps {
  latestTasks: Task[];
}

const LatestUpdatedTasks: React.FC<LatestUpdatedTasksProps> = ({
  latestTasks,
}) => {
  return (
    <Card className="w-1/4 h-96 rounded-md shadow-md bg-card">
      <CardHeader>
        <CardTitle className="text-md">Latest Tasks</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-80 w-full">
          <div className="flex flex-col gap-2 p-2">
            {latestTasks &&
              latestTasks.map((task) => (
                <Card
                  key={task.id}
                  className="border rounded-md p-2 cursor-pointer"
                >
                  <CardContent className="p-0">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-xs text-gray-500">
                      Last updated:{" "}
                      {new Date(
                        task.updatedAt || task.createdAt
                      ).toLocaleString()}
                    </p>
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
