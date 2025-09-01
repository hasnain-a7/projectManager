import React from "react";
import { useTaskContext } from "../TaskContext/TaskContext";

const UpdatePopup: React.FC = () => {
  const { formData, setFormData, handleSubmit, setShowPopup } =
    useTaskContext();

  const handleTitle = (value: string) => {
    setFormData({ ...formData, title: value });
  };

  const handleDescription = (value: string) => {
    setFormData({ ...formData, description: value });
  };

  const cancelUpdate = () => setShowPopup(false);

  return (
    <div id="popup-overlay">
      <div id="popup">
        <h3 id="popup-title">Update Description</h3>
        <input
          type="text"
          placeholder="Enter updated Title"
          value={formData.title}
          onChange={(e) => handleTitle(e.target.value)}
        />
        <textarea
          className="popup-textarea"
          name="popup-description"
          value={formData.description}
          onChange={(e) => handleDescription(e.target.value)}
          placeholder="Enter updated description..."
          rows={4}
        />
        <div id="popup-actions">
          <button id="popup-save-btn" onClick={handleSubmit}>
            Update
          </button>
          <button id="popup-cancel-btn" onClick={cancelUpdate}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePopup;
