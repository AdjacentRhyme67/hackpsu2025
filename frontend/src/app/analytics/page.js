"use client";

import { useVariable } from "../VariableContext";

export default function AnalyticsPage() {
    const { aggregateWpm, analyticsData } = useVariable();

        
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
            <h2 style={{ fontSize: "3em", marginTop: "10px"}}>Análisis</h2>

            <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                width: "80%", 
                marginTop: "10vh" 
            }}>
                <div style={{ textAlign: "left", fontSize: "2.5em" }}>
                    <h3 style={{ textDecoration: "underline" }}>Most Missed Letters</h3>
                    <h3>Las letras más perdidas</h3>
                    <p>&nbsp;</p>
                    <p>1. Letter "{analyticsData["firstLetter"]}" : {analyticsData["firstLetterPercent"]}%</p>
                    <p style={{ fontSize: "0.8em" }}>Letra "{analyticsData["firstLetter"]}" : {analyticsData["firstLetterPercent"]}%</p>
                    <p>&nbsp;</p>
                    <p>2. Letter "{analyticsData["secondLetter"]}" : {analyticsData["secondLetterPercent"]}%</p>
                    <p style={{ fontSize: "0.8em" }}>Letra "{analyticsData["secondLetter"]}" : {analyticsData["secondLetterPercent"]}%</p>
                </div>
                <div style={{ textAlign: "right", fontSize: "2.5em" }}>
                    <h3 style={{ textDecoration: "underline" }}>Words Per Minute (WPM)</h3>
                    <h3>Palabras por minuto</h3>
                    <p style={{ textAlign: "right", fontSize: "7em" }}>{aggregateWpm}</p>
                </div>
            </div>
        </main>
    );
}