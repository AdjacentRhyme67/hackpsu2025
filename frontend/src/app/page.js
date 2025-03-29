"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";

export default function Home() {
  const targetText = "the quick brown fox";
  const [typedText, setTypedText] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const typingAreaRef = useRef(null);
  const cursorRef = useRef(null); // Reference to the cursor span

  const handleInputChange = (e) => {
    const input = e.target.textContent;
    setTypedText(input);
    setCursorPosition(input.length);
  };

  const getTextStyle = (char, index) => {
    if (typedText[index] === undefined) {
      return { opacity: 0.5, color: "#ffffff" };
    }

    if (typedText[index] === char) {
      return { color: "green" };
    } else {
      return { color: "red" };
    }
  };

  useEffect(() => {
    if (typingAreaRef.current) {
      typingAreaRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (cursorRef.current) {
      const spans = document.querySelectorAll(`.${styles.text} > span`);
      if (cursorPosition < spans.length) {
        const cursorSpan = spans[cursorPosition];
        cursorRef.current.style.left = `${cursorSpan.offsetLeft}px`;
      } else if (spans.length > 0) {
        // Handle cursor at the end
        const lastSpan = spans[spans.length -1];
        cursorRef.current.style.left = `${lastSpan.offsetLeft + lastSpan.offsetWidth}px`;
      }
    }
  }, [cursorPosition]);

  return (
    <div className={styles.container}>
      <div
        ref={typingAreaRef}
        className={styles.typingArea}
        contentEditable="true"
        onInput={handleInputChange}
        suppressContentEditableWarning={true}
      ></div>
      <div className={styles.text}>
        {targetText.split("").map((char, index) => (
          <span key={index} style={getTextStyle(char, index)}>
            {char}
            {index === cursorPosition && (
              <span ref={cursorRef} className={styles.cursor}></span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}