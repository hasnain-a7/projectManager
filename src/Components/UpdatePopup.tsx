import React from "react";

interface UpdatePopupProps {
  updatedTitle: string;
  handleTitle: React.Dispatch<React.SetStateAction<string>>;
  updatediscription: string;
  handleDiscription: React.Dispatch<React.SetStateAction<string>>;
  saveTodo: () => void;
  cancelUpdate: () => void;
}

const UpdatePopup: React.FC<UpdatePopupProps> = ({
  updatedTitle,
  handleTitle,
  updatediscription,
  handleDiscription,
  saveTodo,
  cancelUpdate,
}) => {
  return (
    <div id="popup-overlay">
      <div id="popup">
        <h3 id="popup-title">Update Description</h3>
        <input
          type="text"
          placeholder="Enter updated Title"
          value={updatedTitle}
          onChange={(e) => handleTitle(e.target.value)}
        />
        <textarea
          className="popup-textarea"
          name="popup-description"
          value={updatediscription}
          onChange={(e) => handleDiscription(e.target.value)}
          placeholder="Enter updated description..."
          rows={4}
        />
        <div id="popup-actions">
          <button id="popup-save-btn" onClick={saveTodo}>
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
