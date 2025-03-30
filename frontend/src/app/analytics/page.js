"use client";

export default function AnalyticsPage() {
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
            <h1 style={{ fontSize: "6em", marginTop: "5vh" }}>Analytics</h1>
            <h2 style={{ fontSize: "3em", marginTop: "10px" }}>Análisis</h2>

            <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                width: "80%", 
                marginTop: "10vh" 
            }}>
                <div style={{ textAlign: "left", fontSize: "1.5em" }}>
                    <h3>Most Missed Letters</h3>
                    <p>1.) Letter "E" : 15%</p>
                    <p style={{ fontSize: "0.8em" }}>Letra "E" : 15%</p>
                    <p>2.) Letter "A" : 12%</p>
                    <p style={{ fontSize: "0.8em" }}>Letra "A" : 12%</p>
                    <p>3.) Letter "S" : 10%</p>
                    <p style={{ fontSize: "0.8em" }}>Letra "S" : 10%</p>
                </div>
                <div style={{ flex: 1 }}>
                    {/* Placeholder for future content */}
                </div>
            </div>
        </main>
    );
}