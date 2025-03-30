"use client";
import React, { createContext, useState, useContext } from 'react';

const VariableContext = createContext();

export const VariableProvider = ({ children }) => {
    const [targetText, setTargetText] = useState("Default");

    return (
        <VariableContext.Provider value={{ targetText, setTargetText }}>
          {children}
        </VariableContext.Provider>
      );
    };

export const useVariable = () => useContext(VariableContext);