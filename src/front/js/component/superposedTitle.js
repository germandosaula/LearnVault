import React, { useEffect, useRef, useState } from "react";
import "../../styles/SuperposedTitle.css";

export const SuperposedTitle = ({
  text = ["Default", "Title"],
  position = { top: "50%", left: "50%" },
  rotation = 0,
}) => {
  const containerRef = useRef(null);
  const [hasBeenVisible, setHasBeenVisible] = useState(false); // Nueva lógica para mantener la animación

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasBeenVisible(true); // Activa la animación si el componente es visible
        }
      },
      { threshold: 0.05 } // Inicia la animación antes (5% visible)
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  return (
    <div
      className={`words-container ${hasBeenVisible ? "visible" : ""}`}
      ref={containerRef}
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        zIndex: 999,
      }}
    >
      <ul className="Words">
        {text.map((line, index) => (
          <li
            className={`Words-line ${
              index % 2 === 0 ? "line-from-top" : "line-from-bottom"
            }`}
            key={index}
          >
            <p>{line}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};