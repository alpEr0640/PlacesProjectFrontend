import React, { useState } from "react";

export default function Tooltip({text,children} ) {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div
      className="tooltipsContainer"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
        {children}
      {isVisible && <div className="tooltips"> {text}</div>}
    </div>
  );
}
