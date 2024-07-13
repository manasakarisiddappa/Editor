import React from "react";

const Sidebar = () => {
  const elements = ["Label", "Input", "Button"];

  return (
    <div className="sidebar">
      <h2>Blocks</h2>
      {elements.map((element, index) => (
        <div
          key={index}
          draggable
          onDragStart={(e) => e.dataTransfer.setData("element", element)}
          className="sidebar-element"
        >
          {element}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
