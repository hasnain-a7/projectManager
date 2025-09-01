import React, { useState } from "react";
import { useTaskContext } from "../TaskContext/TaskContext";

const TodoModel: React.FC = () => {
  const {
    formData,
    setFormData,
    handleSubmit,
    showPopup,
    setShowPopup,
    editId,
    loading,
  } = useTaskContext();
  const [localLoading, setLocalLoading] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, title: e.target.value });
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, description: e.target.value });
  };

  const handleSave = () => {
    setLocalLoading(true);
    handleSubmit();
    setLocalLoading(false);
  };

  const handleCancel = () => {
    setFormData({ title: "", description: "" });
    setShowPopup(false);
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
