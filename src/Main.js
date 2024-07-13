import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Modal from "./Modal";
import "./App.css"; // Ensure you have this CSS file for styling

const Main = () => {
  const [elements, setElements] = useState(
    JSON.parse(localStorage.getItem("elements")) || []
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [currentElement, setCurrentElement] = useState(null);
  const [initialConfig, setInitialConfig] = useState({});
  const [selectedElementId, setSelectedElementId] = useState(null);

  useEffect(() => {
    localStorage.setItem("elements", JSON.stringify(elements));
  }, [elements]);

  const addElement = (element, config) => {
    setElements([...elements, { ...config, id: Date.now(), type: element }]);
  };

  const updateElement = (id, config) => {
    setElements(
      elements.map((el) => (el.id === id ? { ...el, ...config } : el))
    );
  };

  const deleteElement = (id) => {
    setElements(elements.filter((el) => el.id !== id));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const element = e.dataTransfer.getData("element");
    const elementId = e.dataTransfer.getData("elementId");

    if (element) {
      const x = e.clientX;
      const y = e.clientY;
      setCurrentElement(element);
      setInitialConfig({ x, y });
      setModalVisible(true);
    } else if (elementId) {
      const id = parseInt(elementId, 10);
      const offsetX = parseInt(e.dataTransfer.getData("offsetX"), 10);
      const offsetY = parseInt(e.dataTransfer.getData("offsetY"), 10);
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;
      updateElement(id, { x, y });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSelect = (id) => {
    setSelectedElementId(id);
  };

  const handleKeyDown = (e) => {
    if (selectedElementId) {
      if (e.key === "Enter") {
        const element = elements.find((el) => el.id === selectedElementId);
        setCurrentElement(element.type);
        setInitialConfig(element);
        setModalVisible(true);
      } else if (e.key === "Delete") {
        deleteElement(selectedElementId);
        setSelectedElementId(null);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedElementId, elements]);

  const handleDragStart = (e, id) => {
    const element = elements.find((el) => el.id === id);
    e.dataTransfer.setData("elementId", id);
    e.dataTransfer.setData("offsetX", e.clientX - element.x);
    e.dataTransfer.setData("offsetY", e.clientY - element.y);
  };

  return (
    <div className="main">
      <Sidebar />
      <div className="page" onDrop={handleDrop} onDragOver={handleDragOver}>
        {elements.map((el) => (
          <div
            key={el.id}
            className={`element ${
              el.id === selectedElementId ? "selected" : ""
            }`}
            style={{ position: "absolute", left: el.x, top: el.y }}
            onClick={() => handleSelect(el.id)}
            draggable
            onDragStart={(e) => handleDragStart(e, el.id)}
          >
            {el.type === "Label" && (
              <label
                style={{
                  fontSize: `${el.fontSize}px`,
                  fontWeight: `${el.fontWeight}`,
                }}
              >
                {el.text}
              </label>
            )}
            {el.type === "Input" && (
              <input
                type="text"
                value={el.text}
                style={{
                  fontSize: `${el.fontSize}px`,
                  fontWeight: `${el.fontWeight}`,
                }}
                readOnly
              />
            )}
            {el.type === "Button" && (
              <button
                style={{
                  fontSize: `${el.fontSize}px`,
                  fontWeight: `${el.fontWeight}`,
                }}
              >
                {el.text}
              </button>
            )}
          </div>
        ))}
      </div>
      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={(config) => {
          if (selectedElementId) {
            updateElement(selectedElementId, config);
          } else {
            addElement(currentElement, config);
          }
          setSelectedElementId(null);
        }}
        element={currentElement}
        initialConfig={initialConfig}
      />
    </div>
  );
};

export default Main;
