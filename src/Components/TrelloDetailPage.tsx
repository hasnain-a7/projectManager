import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, FolderOpen } from "lucide-react";

type TaskDetailModalProps = {
  task: any | null;
  onClose: () => void;
};

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose }) => {
  if (!task) return null;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "default";
      case "completed":
        return "secondary";
      case "inactive":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <Dialog open={!!task} onOpenChange={onClose}>
      <DialogContent className="min-w-3xl max-h-[90vh] p-2 gap-0 overflow-hidden ">
        <ScrollArea className="max-h-[90vh] overflow-auto">
          {task.attachments && task.attachments.length > 0 && (
            <div className="w-full aspect-video bg-muted relative overflow-hidden">
              <img
                src={task.attachments[0]}
                alt="Task attachment"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6 space-y-6">
            <DialogHeader>
              <div className="flex items-start justify-between gap-4">
                <DialogTitle className="text-2xl font-bold pr-8">
                  {task.title}
                </DialogTitle>
                <Badge
                  variant={getStatusVariant(task.status)}
                  className="shrink-0"
                >
                  {task.status}
                </Badge>
              </div>
            </DialogHeader>

            {task.projectTitle && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <FolderOpen className="h-4 w-4" />
                <span className="text-sm font-medium">{task.projectTitle}</span>
              </div>
            )}

            <Separator />

            {task.todo && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Description
                </h3>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {task.todo}
                </p>
              </div>
            )}

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              {task.dueDate && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-xs font-medium">Due Date</span>
                  </div>
                  <p className="text-sm font-semibold">
                    {formatDate(task.dueDate)}
                  </p>
                </div>
              )}

              {task.createdAt && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs font-medium">Created At</span>
                  </div>
                  <p className="text-sm font-semibold">{task.createdAt}</p>
                </div>
              )}
            </div>

            {task.updatedAt && (
              <>
                <Separator />
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Last Updated
                  </p>
                  <p className="text-sm">{formatDate(task.updatedAt)}</p>
                </div>
              </>
            )}

            {/* Multiple Attachments */}
            {task.attechments && task.attechments.length > 1 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    Additional Attachments
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {task.attechments
                      .slice(1)
                      .map((attachment: string, index: number) => (
                        <img
                          key={index}
                          src={attachment}
                          alt={`Attachment ${index + 2}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                      ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailModal;
