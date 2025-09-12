import React, { useState } from "react";
import { useTaskContext } from "../TaskContext/TaskContext";
import { useUserContextId } from "../AuthContext/UserContext";
import { IoCloudUploadOutline } from "react-icons/io5";
import "../App.css";
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
  const handleDateChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, dueDate: e.target.value });
    console.log(formData.dueDate);
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

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, status: e.target.value });
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

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 bg-background/80 flex justify-center items-center z-50">
      <div className="bg-card text-card-foreground flex flex-col rounded-2xl shadow-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4 text-foreground">
          {editId === null ? "Add Todo" : "Update Todo"}
        </h3>

        <input
          type="text"
          placeholder="Enter Title"
          value={formData.title}
          onChange={handleTitleChange}
          className="w-full p-2 border border-input rounded-lg mb-3 bg-background text-foreground"
        />

        <textarea
          placeholder="Enter Description"
          rows={4}
          value={formData.description}
          onChange={handleDescriptionChange}
          className="w-full p-2 border border-input rounded-lg mb-4 bg-background text-foreground"
        />

        <div className="flex flex-col w-full mb-4">
          <label
            htmlFor="dueDate"
            className="mb-1 font-semibold text-foreground"
          >
            Due Date:
          </label>
          <input
            type="date"
            id="dueDate"
            value={formData.dueDate || ""}
            onChange={handleDateChange}
            className="border border-input bg-background text-foreground rounded px-2 py-1"
          />
        </div>

        <div className="flex flex-col w-full mb-4">
          <label
            htmlFor="status"
            className="mb-1 font-semibold text-foreground"
          >
            Status:
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={handleStatusChange}
            className="border border-input bg-background text-foreground rounded px-2 py-1"
          >
            <option value="">Select</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
            <option value="backlog">Backlog</option>
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleSubmit}
            disabled={localLoading || loading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg cursor-pointer disabled:opacity-50"
          >
            {localLoading || loading
              ? "Loading..."
              : editId === null
              ? "Add"
              : "Update"}
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoModel;
