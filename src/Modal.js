import React, { useState, useEffect } from "react";
import "./App.css";

const Modal = ({ visible, onClose, onSave, element, initialConfig }) => {
  const [config, setConfig] = useState(initialConfig);

  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
    }
  }, [initialConfig]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig({ ...config, [name]: value });
  };

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-heading">
          <div>Edit {element}</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="black"
            onClick={onClose}
            className="close-btn"
          >
            <path d="M18 6.414L17.586 6 12 11.586 6.414 6 6 6.414 11.586 12 6 17.586 6.414 18 12 12.414 17.586 18 18 17.586 12.414 12z" />
          </svg>
        </div>
        <div className="edit-values">
          <label>
            X
            <div>
              <input
                className="value-border"
                type="number"
                name="x"
                value={config.x}
                onChange={handleChange}
              />
            </div>
          </label>
          <label>
            Y
            <div>
              <input
                className="value-border"
                type="number"
                name="y"
                value={config.y}
                onChange={handleChange}
              />
            </div>
          </label>
          <label>
            Text
            <div>
              <input
                className="value-border"
                type="text"
                name="text"
                value={config.text || ""}
                onChange={handleChange}
              />
            </div>
          </label>
          <label>
            Font Size
            <div>
              <input
                className="value-border"
                type="number"
                name="fontSize"
                value={config.fontSize || ""}
                onChange={handleChange}
              />
            </div>
          </label>
          <label>
            Font Weight
            <div>
              <input
                className="value-border"
                type="number"
                name="fontWeight"
                value={config.fontWeight || ""}
                onChange={handleChange}
              />
            </div>
          </label>
        </div>
        <button onClick={handleSave} className="btn">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Modal;
