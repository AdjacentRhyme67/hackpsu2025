"use client";

import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useVariable } from "../VariableContext";

export default function Spanish() {
  const router = useRouter();
  const { 
    targetText, 
    setTargetText,
    aggregateWpm,
    setAggregateWpm,
    missedChars,
    setMissedChars,
    missedCharFrequencies,
    setMissedCharFrequencies,
    allCharCounts,
    setAllCharCounts,
    analyticsData,
    setAnalyticsData
  } = useVariable();

  const [typedText, setTypedText] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const typingAreaRef = useRef(null);
  const cursorRef = useRef(null);
  const [paragraphCounter , setParagraphCounter] = useState(0);
  const [spanishText, setSpanishText] = useState("");

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const [redIndexes, setRedIndexes] = useState([]);

  const createSpanishText = async () => {
    try {
        const response = await fetch('http://127.0.0.1:5000/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(targetText), // Send the target text to the server for translation
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        const combinedText = data["one"] + " " + data["two"] + " " + data["three"] + " " + data["four"]; // Combine the translated text from the response
        setSpanishText(combinedText);
      } catch (error) {
       
      
    }
  }

  useEffect(() => {

    createSpanishText();
    }, [targetText]); 

    


   // Call the fetchData function

  useEffect(() => {
      if (targetText === "DONE") {

          setAggregateWpm(Math.round(aggregateWpm/4));
          router.push("/analytics");  // Navigate to Analytics Page
      }
  }, [targetText, router]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redIndexesParam = params.get("redIndexes");
    if (redIndexesParam) {
      setRedIndexes(JSON.parse(redIndexesParam));
    }
  }, []);

  

  const handleInputChange = (e) => {
    const input = e.target.textContent;
    setTypedText(input);
    setCursorPosition(input.length);
    checkCompletion();
    if (!startTime) {
      setStartTime(Date.now());
    }
    if (input.length === targetText.length) {
      setEndTime(Date.now()); // Sets end time
      
    }

  };

  const getTextStyle = (char, index, typedText) => {
    if (typedText[index] === undefined) {
      return { opacity: 0.5, color: "#ffffff" };
    }

    if (typedText[index] === char) {
      return { color: "green" };
    } else {
        return {
            color: "red",
            textDecoration: 'line-through'
          };
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
    if (endTime && !typedText.endsWith("DONE")) { // Only proceed if we have an end time and haven't already completed
      
      
      const newCounter = paragraphCounter + 1;
      setParagraphCounter(newCounter); // Update counter first
      
      const dataToSend = {
        missedChars: {...missedChars},
        missedCharFrequencies: {...missedCharFrequencies},
        allCharCounts: {...allCharCounts}
      };
      
      if (newCounter >= 3) {
        
        setTargetText("DONE");

        try {
          const response = await fetch('http://127.0.0.1:5000/api-analytics', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          setAnalyticsData(data); // Assuming the server returns some analytics data


       
        } catch (error) {
          console.error("Error sending data to the server:", error);
          // Handle error appropriately, maybe show a notification to the user
        }
        

      } else {
       
        // Create a copy of the data to ensure it's consistent
        
        
        try {
          const response = await fetch('http://127.0.0.1:5000/api-data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          
          const combinedText = Object.values(data).join(" ");
          setTargetText(combinedText);
        } catch (error) {
         
        }
      }
    }
  };


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
  }, [cursorPosition, targetText]);

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
      setAggregateWpm(aggregateWpm + wpm);
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

  useEffect(() => {
    setTypedText("");
    setCursorPosition(0);
    setStartTime(null);
    setEndTime(null);

    // Delay cursor update
    setTimeout(() => {
        setCursorPosition(0); // Ensure cursor is at the beginning
    }, 0); // Use 0 for minimal delay
  }, [targetText]);

  useEffect(() => {
    if (typingAreaRef.current) {
        typingAreaRef.current.textContent = ""; // Reset the content
    }
}, [targetText]); // Reset when targetText changes

  function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
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
          <span key={index} style={getTextStyle(char, index, typedText)}>
            {char}
            {index === cursorPosition && (
              <span ref={cursorRef} className={styles.cursor}></span>
            )}
          </span>
        ))}
      </div>
      <p className={styles.timer}>Elapsed Time: {formatTime(elapsedTime)}</p>
      <p className={styles.spanishText}>{spanishText}</p>
      <h4 className={styles.translateH}> Translation: </h4>
    </div>
  );
}