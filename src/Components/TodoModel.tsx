import React, { useState } from "react";
import { useTaskContext } from "../TaskContext/TaskContext";
import { useUserContextId } from "../AuthContext/UserContext";
type userContext = {
  userContextId: string | null;
};

const TodoModel: React.FC = () => {
  const {
    formData,
    setFormData,
    addTodo,
    updateTodo,
    showPopup,
    setShowPopup,
    editId,
    loading,
  } = useTaskContext();
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

  const handleSubmit = () => {
    if (editId === null) addTodo(userContextId ?? "");
    else updateTodo();
  };
  const handleSave = () => {
    setLocalLoading(true);
    handleSubmit();
    setLocalLoading(false);
  };

  const handleCancel = () => {
    setFormData({ title: "", description: "", status: "backlog" });
    setShowPopup(false);
  };
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, status: value });
    console.log("Selected Status:", value);
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white flex justify-center items-center flex-col rounded-2xl shadow-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          {editId === null ? "Add Todo" : "Update Todo"}
        </h3>

        <input
          type="text"
          placeholder="Enter Title"
          value={formData.title}
          onChange={handleTitleChange}
          className="w-full p-2 border border-gray-300 rounded-lg mb-3"
        />

        <textarea
          placeholder="Enter Description"
          rows={4}
          value={formData.description}
          onChange={handleDescriptionChange}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        />
        {editId !== null && (
          <div className="flex flex-col w-full mb-4">
            <label htmlFor="status" className="mb-1 font-semibold">
              Status:
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={handleStatusChange}
              className="border border-gray-300 rounded px-2 py-1"
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
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={handleSave}
            disabled={localLoading || loading}
            className="px-4 py-2 bg-[#1A202C] text-white rounded-lg cursor-pointer disabled:opacity-50"
          >
            {localLoading || loading
              ? "Loading..."
              : editId === null
              ? "Add"
              : "Update"}
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoModel;
