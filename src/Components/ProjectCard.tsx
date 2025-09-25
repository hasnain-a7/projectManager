import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { type Task } from "@/TaskContext/TaskContext";
import { Progress } from "./ui/progress";
import {
  Paperclip,
  Calendar,
  MessagesSquare,
  MoreHorizontal,
} from "lucide-react";
interface Project {
  id?: string;
  title: string;
  url?: string;
  userId?: string;
  createdAt?: string;
  dueDate?: string;
}
interface ProjectCardProps {
  project: Project;
  tasks: Task[];
  onClick?: (projectId: string) => void;
}
const getTaskStats = (tasks: Task[]) => {
  const completed = tasks.filter((task) => task.status === "completed").length;
  const inProgress = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;
  const pending = tasks.filter((task) => task.status === "pending").length;
  const total = tasks.length;

  return { completed, inProgress, pending, total };
};

const calculateProgress = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export const ProjectCard = ({ project, tasks, onClick }: ProjectCardProps) => {
  const { completed, total } = getTaskStats(tasks);
  const percentage = calculateProgress(completed, total);

  const handleCardClick = () => {
    if (project.title) {
      onClick?.(project.title);
    }
  };

  return (
    <Card
      className="w-full py-4  border border-border/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader className="">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="text-xs font-medium">
            {project?.label || "Personal"}
          </Badge>

          <button className="text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <CardTitle className="text-base font-semibold line-clamp-2">
          {project.title}
        </CardTitle>

        {/* Meta info row */}
        <div className="flex items-center flex-wrap gap-3 text-xs">
          <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 font-medium">
            {project?.priority || "HIGH"}
          </span>

          {project.dueDate && (
            <span className="text-blue-600 font-medium flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {project.dueDate}
            </span>
          )}

          <span className="flex items-center gap-1 text-muted-foreground">
            <Paperclip className="w-3 h-3" /> {project?.attachments || 0}
          </span>

          <span className="flex items-center gap-1 text-muted-foreground">
            <MessagesSquare className="w-3 h-3" /> {project?.comments || 0}
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2 flex-1">
          <Progress value={percentage} className="h-2 flex-1 rounded-full" />
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {completed}/{total}
          </span>
        </div>

        <div className="flex -space-x-2 ml-2">
          {project?.members?.map((m, i) => (
            <img
              key={i}
              src={m.avatar}
              alt={m.name}
              className="w-6 h-6 rounded-full border-2 border-background"
            />
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};
