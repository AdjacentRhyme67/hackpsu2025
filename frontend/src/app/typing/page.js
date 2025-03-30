"use client";

import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import styles from "./page.module.css";
import { useVariable, VariableProvider } from "../VariableContext";

export default function Home() {
  const { targetText } = useVariable(); // Access the target text from context
  const [typedText, setTypedText] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const typingAreaRef = useRef(null);
  const cursorRef = useRef(null);
  const totalCharacterCount = targetText.length;

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const [missedChars, setMissedChars] = useState({});
  const [missedCharFrequencies, setMissedCharFrequencies] = useState({});
  const [allCharCounts, setAllCharCounts] = useState({});

  const handleInputChange = (e) => {
    const input = e.target.textContent;
    setTypedText(input);
    setCursorPosition(input.length);
    checkCompletion();
    if (!startTime) {
      setStartTime(Date.now());
    }
    if (input.length === targetText.length) {
      setEndTime(Date.now());
    }

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

  const isWordBoundary = (text, position) => {
    if (position === 0 || position === text.length) {
      return true;
    }
    return text[position - 1] === " " || text[position] === " ";
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Backspace") {
      const selection = window.getSelection();
      const position = selection.anchorOffset;

      if (e.key === "Backspace" && position === 0) {
        e.preventDefault();
        return;
      }

      if (
        isWordBoundary(typingAreaRef.current.textContent, position) &&
        (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Backspace")
      ) {
        e.preventDefault();
      }
    }
  };

  const checkCompletion = async () => {
    const coloredCharacters = document.querySelectorAll(`.${styles.text} > span[style*="color: green"], .${styles.text} > span[style*="color: red"]`);
      if (coloredCharacters.length / totalCharacterCount == 1) {
        fetch('http://127.0.0.1:5000/api/data', { // Your Flask endpoint
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({missedChars, missedCharFrequencies, allCharCounts }), // Send a message or data
          })
          .then(response => {

          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }

          return response.json();
        })
        .then(data => {
          setTargetText(data.response.toString());
        })
          .catch(error => {
              console.error('Error:', error); // Handle any errors
          });
      }};



  useEffect(() => {
    if (typingAreaRef.current) {
      typingAreaRef.current.focus();
      typingAreaRef.current.addEventListener("keydown", handleKeyDown);
      return () => {
        if (typingAreaRef.current) {
          typingAreaRef.current.removeEventListener("keydown", handleKeyDown);
        }
      };
    }
  }, []);

  useEffect(() => {
    if (cursorRef.current) {
      const spans = document.querySelectorAll(`.${styles.text} > span`);
      if (cursorPosition < spans.length) {
        const cursorSpan = spans[cursorPosition];
        cursorRef.current.style.left = `${cursorSpan.offsetLeft}px`;
        cursorRef.current.style.top = `${cursorSpan.offsetTop}px`;
      } else if (spans.length > 0) {
        const lastSpan = spans[spans.length - 1];
        cursorRef.current.style.left = `${lastSpan.offsetLeft + lastSpan.offsetWidth}px`;
        cursorRef.current.style.top = `${lastSpan.offsetTop}px`;
      }
    }
  }, [cursorPosition]);

  useEffect(() => {
    if (startTime) {
      const interval = setInterval(() => {
        const now = Date.now();
        const difference = now - startTime;
        setElapsedTime(difference);
      }, 10);

      if (endTime) {
        clearInterval(interval);
      }

      return () => clearInterval(interval);
    }
  }, [startTime, endTime]);

  useEffect(() => {
    if (endTime && startTime) {
      const time = (endTime - startTime) / 1000 / 60;
      const words = targetText.split(" ").length;
      setWpm(Math.round(words / time));
    }
  }, [endTime, startTime]);

  useEffect(() => {
    const missed = {};
    const missedFreq = {};
    const allChars = {};

    for (let i = 0; i < Math.min(typedText.length, targetText.length); i++) {
      const targetChar = targetText[i].toLowerCase();
      const typedChar = typedText[i] ? typedText[i].toLowerCase() : undefined;

      // Count all characters that should have been typed
      if (!allChars[targetChar]) {
        allChars[targetChar] = 1;
      } else {
        allChars[targetChar]++;
      }

      if (typedChar !== targetChar) {
        if (!missed[targetChar]) {
          missed[targetChar] = 1;
        } else {
          missed[targetChar]++;
        }

        if (!missedFreq[targetChar]) {
          missedFreq[targetChar] = {};
        }

        if (typedChar !== undefined) {
          if (!missedFreq[targetChar][typedChar]) {
            missedFreq[targetChar][typedChar] = 1;
          } else {
            missedFreq[targetChar][typedChar]++;
          }
        }
      }
    }
    setMissedChars(missed);
    setMissedCharFrequencies(missedFreq);
    setAllCharCounts(allChars);
  }, [typedText, targetText]);

  function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const remainingMilliseconds = milliseconds % 1000;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    const formattedMilliseconds = String(remainingMilliseconds).padStart(3, "0");

    return `${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
  }

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
      <p className={styles.timer}>Elapsed Time: {formatTime(elapsedTime)}</p>
    </div>
  );
}