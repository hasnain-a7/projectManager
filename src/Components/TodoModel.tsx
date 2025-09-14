"use client";
import React, { useState, useEffect } from "react";
import { useTaskContext, type Task } from "../TaskContext/TaskContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DatePicker from "./DatePicker";

export interface TaskFormData {
  title: string;
  todo: string;
  status: string;
  attachments: string[];
  dueDate: string;
  createdAt: string;
}

interface TodoModelProps {
  projectTitle: string;
  showPopup: boolean;
  setShowPopup: (v: boolean) => void;
  taskToEdit?: Task;
  onSubmit?: (formData: TaskFormData) => Promise<void>;
}

const TodoModel: React.FC<TodoModelProps> = ({
  projectTitle,
  showPopup,
  setShowPopup,
  taskToEdit,
  onSubmit,
}) => {
  const { setTaskCache } = useTaskContext();

  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    todo: "",
    status: "backlog",
    attachments: [],
    dueDate: "",
    createdAt: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title,
        todo: taskToEdit.todo,
        status: taskToEdit.status,
        attachments: taskToEdit.attachments || [],
        dueDate: taskToEdit.dueDate || "",
        createdAt: taskToEdit.createdAt,
      });
    }
  }, [taskToEdit]);

  const handleSubmit = async () => {
    if (!formData.title) return;
    setLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else if (taskToEdit) {
        setTaskCache((prev) => {
          const tasks = prev[projectTitle]?.tasks.map((t) =>
            t.id === taskToEdit.id ? { ...t, ...formData } : t
          );
          return { ...prev, [projectTitle]: { ...prev[projectTitle], tasks } };
        });
      }
      setFormData({
        title: "",
        todo: "",
        status: "backlog",
        attachments: [],
        dueDate: "",
        createdAt: "",
      });
      setShowPopup(false);
    } catch (err) {
      console.error("❌ Error saving task:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      todo: "",
      status: "backlog",
      attachments: [],
      dueDate: "",
      createdAt: "",
    });
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <Dialog open={showPopup} onOpenChange={setShowPopup}>
      <DialogContent className="sm:max-w-md rounded-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle>{taskToEdit ? "Edit Task" : "Add Task"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            placeholder="Enter title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Textarea
            placeholder="Enter description"
            rows={4}
            value={formData.todo}
            onChange={(e) => setFormData({ ...formData, todo: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-2">
            <Select
              value={formData.status}
              onValueChange={(v) => setFormData({ ...formData, status: v })}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="backlog">Backlog</SelectItem>
              </SelectContent>
            </Select>

            <DatePicker
              value={formData.dueDate || null}
              onChange={(date) =>
                setFormData({ ...formData, dueDate: date || "" })
              }
            />
          </div>

          <Input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file)
                setFormData({
                  ...formData,
                  attachments: [URL.createObjectURL(file)],
                });
            }}
          />
        </div>

        <DialogFooter className="flex justify-center gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading
              ? taskToEdit
                ? "Saving..."
                : "Adding..."
              : taskToEdit
              ? "Save"
              : "Add Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TodoModel;
