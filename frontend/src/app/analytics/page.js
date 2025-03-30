"use client";

import { useVariable } from "../VariableContext";

export default function AnalyticsPage() {
    const { aggregateWpm } = useVariable();
        
    return (
        <main style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#001f3d",
            color: "#ffffff",
            fontFamily: "monospace",
            textAlign: "center"
        }}>
            <h1 style={{ fontSize: "6em", marginTop: "5vh", textDecoration: "underline" }}>Analytics</h1>
            <h2 style={{ fontSize: "3em", marginTop: "10px", textDecoration: "underline" }}>Análisis</h2>

            <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                width: "80%", 
                marginTop: "10vh" 
            }}>
                <div style={{ textAlign: "left", fontSize: "2.5em" }}>
                    <h3 style={{ textDecoration: "underline" }}>Most Missed Letters</h3>
                    <h3 style={{ textDecoration: "underline" }}>Las letras más perdidas</h3>
                    <p>1.) Letter "E" : 15%</p>
                    <p style={{ fontSize: "0.8em" }}>Letra "E" : 15%</p>
                    <p>2.) Letter "A" : 12%</p>
                    <p style={{ fontSize: "0.8em" }}>Letra "A" : 12%</p>
                    <p>3.) Letter "S" : 10%</p>
                    <p style={{ fontSize: "0.8em" }}>Letra "S" : 10%</p>
                </div>
                <div style={{ textAlign: "right", fontSize: "2.5em" }}>
                    <h3 style={{ textDecoration: "underline" }}>Words Per Minute (WPM)</h3>
                    <h3 style={{ textDecoration: "underline" }}>Palabras por minuto</h3>
                    <p style={{ textAlign: "right", fontSize: "7em" }}>{aggregateWpm}</p>
                </div>
            </div>
        </main>
    );
}