import React, { useState } from "react";
import { useTaskContext } from "../TaskContext/TaskContext";
import { useUserContextId } from "../AuthContext/UserContext";
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

type userContext = {
  userContextId: string | null;
};

interface TodoModelProps {
  projectId: string;
  updateProjectTask: () => Promise<void>;
  addNewTask: (
    projectDocId: string,
    taskData?: {
      title: string;
      todo?: string;
      status?: string;
      attechments?: string[];
      dueDate: string;
    }
  ) => Promise<void>;
}

const TodoModel: React.FC<TodoModelProps> = ({
  projectId,
  updateProjectTask,
  addNewTask,
}) => {
  const { formData, setFormData, showPopup, setShowPopup, editId, loading } =
    useTaskContext();

  const { userContextId }: userContext = useUserContextId();
  const [localLoading, setLocalLoading] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, title: e.target.value });
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, description: e.target.value });
  };

  const handleDateChange = (date: string | null) => {
    setFormData({ ...formData, dueDate: date || "" });
  };

  const handleStatusChange = (value: string) => {
    setFormData({ ...formData, status: value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData({
        ...formData,
        attachments: [url],
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.title) return;

    setLocalLoading(true);

    try {
      if (editId === null) {
        await addNewTask(projectId, {
          title: formData.title,
          todo: formData.description,
          status: formData.status,
          attechments: formData.attachments,
          dueDate: formData.dueDate,
        });
      } else {
        await updateProjectTask();
      }

      setFormData({
        title: "",
        description: "",
        status: "",
        attachments: [],
        dueDate: "",
      });
      setShowPopup(false);
    } catch (err) {
      console.error("Error adding/updating task:", err);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      description: "",
      status: "backlog",
      attachments: [],
      dueDate: "",
    });
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <Dialog open={showPopup} onOpenChange={setShowPopup}>
      <DialogContent className="sm:max-w-md rounded-xl shadow-2xl">
        <DialogHeader className="">
          <DialogTitle className="text-lg font-semibold">
            {editId === null ? "Add Todo" : "Update Todo"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 ">
          <Input
            id="title"
            placeholder="Enter title"
            value={formData.title}
            onChange={handleTitleChange}
          />

          <Textarea
            id="description"
            placeholder="Enter description..."
            rows={4}
            value={formData.description}
            onChange={handleDescriptionChange}
            className="h-24"
          />

          <div className="grid grid-cols-2 gap-2">
            <Select value={formData.status} onValueChange={handleStatusChange}>
              <SelectTrigger id="status" className="w-48">
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
              onChange={handleDateChange}
            />
          </div>

          <div className="  flex items-center gap-2 border border-muted-foreground/30 rounded-md ">
            <Input
              id="file"
              type="file"
              onChange={handleFileUpload}
              className="cursor-pointer border-none shadow-none text-sm"
            />
          </div>
        </div>

        <DialogFooter className="flex justify-center items-center gap-2">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="rounded-md"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={localLoading || loading}
            className="rounded-md"
          >
            {localLoading || loading
              ? "Loading..."
              : editId === null
              ? "Add"
              : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TodoModel;
