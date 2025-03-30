"use client";
import React, { createContext, useState, useContext } from 'react';

const VariableContext = createContext();

export const VariableProvider = ({ children }) => {
    const [aggregateWpm, setAggregateWpm] = useState(0);
    const [missedChars, setMissedChars] = useState({});
    const [missedCharFrequencies, setMissedCharFrequencies] = useState({});
    const [allCharCounts, setAllCharCounts] = useState({});
    const [targetText, setTargetText] = useState("Default");
    const [analyticsData, setAnalyticsData] = useState({});

    const value = {
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
    };

    return (
        <VariableContext.Provider value={value}>
          {children}
        </VariableContext.Provider>
      );
    };

    export function useVariable() {
      const context = useContext(VariableContext);
      if (context === undefined) {
        throw new Error("useVariable must be used within a VariableProvider");
      }
      return context;
    }