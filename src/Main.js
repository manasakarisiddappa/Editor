import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Modal from "./Modal";
import "./App.css";

const Main = () => {
  const [elements, setElements] = useState(
    JSON.parse(localStorage.getItem("elements")) || []
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [currentElement, setCurrentElement] = useState(null);
  const [initialConfig, setInitialConfig] = useState({});
  const [selectedElementId, setSelectedElementId] = useState(null);

  useEffect(() => {
    //updating the local storage on change of elements
    localStorage.setItem("elements", JSON.stringify(elements));
  }, [elements]);

  const addElement = (element, config) => {
    //adding new element to the of type label or input or button
    setElements([...elements, { ...config, id: Date.now(), type: element }]);
  };

  const updateElement = (id, config) => {
    //updating existing element with the new config
    setElements(
      elements.map((el) => (el.id === id ? { ...el, ...config } : el))
    );
  };

  const deleteElement = (id) => {
    //deleting the element on press of delete button
    setElements(elements.filter((el) => el.id !== id));
  };

  const handleDrop = (e) => {
    //on drop of the element this funciton will get executed
    e.preventDefault();
    const element = e.dataTransfer.getData("element");
    const elementId = e.dataTransfer.getData("elementId");

    if (element) {
      //if new element from sidebar is dropped.
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setCurrentElement(element);
      setInitialConfig({ x, y });
      setModalVisible(true);
    } else if (elementId) {
      // if existing element is moved and dropped
      const id = parseInt(elementId, 10);
      const offsetX = parseInt(e.dataTransfer.getData("offsetX"), 10);
      const offsetY = parseInt(e.dataTransfer.getData("offsetY"), 10);
      const x = ((e.clientX - offsetX) / window.innerWidth) * 100;
      const y = ((e.clientY - offsetY) / window.innerHeight) * 100;
      updateElement(id, { x, y });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSelect = (id) => {
    // when existing element is selected
    setSelectedElementId(id);
  };

  const handleKeyDown = (e) => {
    if (selectedElementId) {
      if (e.key === "Enter") {
        // if enter key is pressed
        const element = elements.find((el) => el.id === selectedElementId);
        setCurrentElement(element.type);
        setInitialConfig(element);
        setModalVisible(true);
      } else if (e.key === "Delete") {
        // if delete key is pressed
        deleteElement(selectedElementId);
        setSelectedElementId(null);
      }
    }
  };

  useEffect(() => {
    // to handle the key press events
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedElementId, elements]);

  const handleDragStart = (e, id) => {
    const element = elements.find((el) => el.id === id);
    e.dataTransfer.setData("elementId", id);
    e.dataTransfer.setData(
      "offsetX",
      e.clientX - (element.x / 100) * window.innerWidth
    );
    e.dataTransfer.setData(
      "offsetY",
      e.clientY - (element.y / 100) * window.innerHeight
    );
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
            style={{ position: "absolute", left: `${el.x}%`, top: `${el.y}%` }}
            onClick={() => handleSelect(el.id)}
            draggable
            onDragStart={(e) => handleDragStart(e, el.id)}
          >
            {el.type === "Label" && (
              <label
                style={{
                  fontSize: `${el.fontSize}px`,
                  fontWeight: el.fontWeight,
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
                  fontWeight: el.fontWeight,
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
