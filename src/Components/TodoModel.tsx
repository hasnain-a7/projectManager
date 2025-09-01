import React from "react";
import { useState } from "react";
interface Props {
  formData: { title: string; description: string };
  setFormData: React.Dispatch<
    React.SetStateAction<{ title: string; description: string }>
  >;
  onSubmit: () => void;
  onCancel: () => void;
  editId: string | null;
}

const TodoModel: React.FC<Props> = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  editId,
}) => {
  const [loading, setloading] = useState<boolean>(false);
  const HandleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((pre) => ({
      ...pre,
      title: e.target.value,
    }));
  };
  const HandleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData((pre) => ({
      ...pre,
      description: e.target.value,
    }));
  };
  const handleSubmit = () => {
    setloading(true);
    onSubmit();
    setloading(false);
  };

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
          onChange={HandleTitleChange}
          className="w-full p-2 border border-gray-300 rounded-lg mb-3 "
        />

        <textarea
          placeholder="Enter Description"
          rows={4}
          value={formData.description}
          onChange={HandleDescriptionChange}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 "
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#1A202C] text-white rounded-lg cursor-pointer"
          >
            {loading ? "Loading..." : editId === null ? "Add" : "Update"}
          </button>
          <button
            onClick={onCancel}
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
