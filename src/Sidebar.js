import React from "react";

const Sidebar = () => {
  const elements = ["Label", "Input", "Button"];

  return (
    <div className="sidebar">
      <div className="sidebar-heading">Blocks</div>
      <div className="sidebar-content">
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
    </div>
  );
};

export default Sidebar;
