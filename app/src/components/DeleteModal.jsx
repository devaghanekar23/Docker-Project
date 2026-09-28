import React from "react";

export default function DeleteModal({ isOpen, onClose, onConfirm, recipeTitle }) {
  if (!isOpen) return null;

  return (
    <div className="form-overlay" onClick={onClose}>
      <div 
        className="delete-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="delete-modal-icon">⚠️</div>
        <h3>Delete Recipe?</h3>
        <p>
          Are you sure you want to delete <strong>"{recipeTitle}"</strong>?
        </p>

        <div className="delete-modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            No, Cancel
          </button>
          <button className="confirm-delete-btn" onClick={onConfirm}>
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}