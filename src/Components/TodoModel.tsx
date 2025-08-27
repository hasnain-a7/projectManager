import React from "react";

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
  return (
    <div className="popup-overlay">
      <div className="popup">
        <h3>{editId === null ? "Add Todo" : "Update Todo"}</h3>

        <input
          type="text"
          placeholder="Enter Title"
          value={formData.title}
          onChange={HandleTitleChange}
        />

        <textarea
          placeholder="Enter Description"
          rows={4}
          value={formData.description}
          onChange={HandleDescriptionChange}
        />

        <div className="popup-actions">
          <button onClick={onSubmit}>
            {editId === null ? "Add" : "Update"}
          </button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default TodoModel;
