"use client";

import Link from 'next/link';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from "next/navigation";
import { useVariable, VariableProvider } from './VariableContext'; // Import the context to use the target text

export default function LaunchPage() {
    const router = useRouter();
    const [age, setAge] = useState('');
    const [grade, setGrade] = useState('');
    const [ageError, setAgeError] = useState('');
    const [gradeError, setGradeError] = useState('');
    const [translate, setTranslate] = useState(false); // boolean value for checkbox
    const { targetText, setTargetText } = useVariable(); // Access the target text from context

    const handleStart = (e) => {
        if (age < 6) {
            e.preventDefault();
            setAgeError('Not valid age, must be 6 years or older.');
            return;
        }

        if (!grade) {
            e.preventDefault();
            setGradeError('You must choose a grade.');
            return;
        }

        // translate is already a boolean value, you can use it directly
        console.log("Age:", age, "Grade:", grade, "Translate:", translate);

        // Example: Using the boolean value
        if (translate) {
            console.log("Language translation requested.");
            // Implement your translation logic here, such as passing it as a query parameter
            // to the /typing page or storing it in local storage.
        } else {
            console.log("Language translation not requested.");
        }

        fetch('http://127.0.0.1:5000/start_button_click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ age, grade }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Parse the JSON response
            })
            .then(data => {
                const combinedText = Object.values(data).join(" ");
                setTargetText(combinedText);
            })
            .catch(error => {
                console.error('Fetch error:', error); // Handle any errors
            });
    };

    useEffect(() => {
        if (ageError || gradeError) {
            const timer = setTimeout(() => {
                setAgeError('');
                setGradeError('');
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [ageError, gradeError]);

    const gradeDescriptions = {
        1: "1st Grade: Basic letters. 1er Grado: Letras básicas.",
        2: "2nd Grade: Simple words. 2do Grado: Palabras simples.",
        3: "3rd Grade: Short sentences. 3er Grado: Oraciones cortas.",
        4: "4th Grade: Paragraphs. 4to Grado: Párrafos.",
        5: "5th Grade: Essays. 5to Grado: Ensayos.",
        6: "6th Grade: Complex texts. 6to Grado: Textos complejos.",
        7: "7th Grade: Advanced vocab. 7mo Grado: Vocabulario avanzado.",
        8: "8th Grade: Research papers. 8vo Grado: Trabajos de investigación.",
        9: "9th Grade: Formal writing. 9no Grado: Escritura formal.",
        10: "10th Grade: Critical analysis. 10mo Grado: Análisis crítico.",
        11: "11th Grade: College prep. 11vo Grado: Preparación universitaria.",
        12: "12th Grade: Professional writing. 12vo Grado: Escritura profesional."
    };

    const linkHref = translate ? "/typing_spanish" : "/typing"; // Dynamically determine the link

    return (
        <main style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#001f3d",
            color: "#ffffff",
            fontFamily: "monospace",
            textAlign: "center",
            padding: "30px"
        }}>
            <h1 style={{ fontSize: "2.5em", marginBottom: "15px", textAlign: "center" }}>Welcome to the Typing Test App!</h1>
            <p style={{ marginBottom: '30px', fontSize: "1.3em", textAlign: "center" }}>¡Bienvenido a la aplicación de prueba de mecanografía!</p>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                marginBottom: '30px',
                width: '400px',
                maxWidth: '95%',
                alignItems: "center"
            }}>
                <div style={{ display: 'flex', width: "100%" }}>
                    <label style={{ width: '150px', textAlign: 'right', fontSize: "1.2em", paddingRight: "10px" }}>Age/Edad:</label>
                    <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#36393f', color: 'white', fontSize: "1.2em" }}
                    />
                </div>
                <div style={{ display: 'flex', width: "100%" }}>
                    <label style={{ width: '132px', textAlign: 'right', fontSize: "1.2em", paddingRight: "10px" }}>Grade/Grado:</label>
                    <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#36393f', color: 'white', fontSize: "1.2em" }}
                    >
                        <option value="">Select Grade</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>
            </div>

            {grade && <p style={{ marginBottom: '30px', fontSize: "1.2em", textAlign: "center" }}>{gradeDescriptions[grade]}</p>}

            <Link href={linkHref} onClick={(e) => handleStart(e)}>
                <button style={{
                    padding: "15px 30px",
                    fontSize: "1.3em",
                    backgroundColor: "#0070f3",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease"
                }}
                    onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
                    onMouseOut={(e) => e.target.style.backgroundColor = "#0070f3"}
                >
                    Enter App
                </button>
            </Link>

            <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
                <input
                    type="checkbox"
                    id="translate"
                    checked={translate} // Use the boolean state variable
                    onChange={(e) => setTranslate(e.target.checked)}
                    style={{ marginRight: "10px" }}
                />
                <label htmlFor="translate" style={{ fontSize: "1.1em" }}>Language Translation / Traducción de Idioma</label>
            </div>

            {(ageError || gradeError) && <div style={{ marginTop: '30px', color: 'red', textAlign: 'center', fontSize: "1.2em" }}>
                {ageError && <p>{ageError}</p>}
                {ageError && <p>Edad no válida, debe tener 6 años o más.</p>}
                {gradeError && <p>You must choose a grade.</p>}
                {gradeError && <p>Debes elegir un grado.</p>}
            </div>}
        </main>
    );
}