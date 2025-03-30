"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function LaunchPage() {
    const [age, setAge] = useState('');
    const [grade, setGrade] = useState('');
    const [ageError, setAgeError] = useState('');

    const handleStart = (e) => {
        if (age < 6) {
            e.preventDefault(); // Prevent navigation
            setAgeError('Not valid age, must be 6 years or older.');
            return;
        }

        setAgeError(''); // Clear any previous error

        // You can store age and grade here (e.g., in local storage, context, etc.)
        // For now, we'll just log them to the console.
        console.log("Age:", age, "Grade:", grade);
    };

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

    return (
        <main style={{ 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "center", // Center vertically
            alignItems: "center", // Center horizontally
            height: "100vh", 
            backgroundColor: "#001f3d", 
            color: "#ffffff", 
            fontFamily: "monospace", 
            textAlign: "center" 
        }}>
            <h1>Welcome to the Typing Test App!</h1>
            <p style={{marginBottom: '20px'}}>¡Bienvenido a la aplicación de prueba de mecanografía!</p>

            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '10px', 
                marginBottom: '20px',
                width: '300px' // Adjust width for better input alignment
            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ width: '100px', textAlign: 'left' }}>Age/Edad:</label>
                    <input 
                        type="number" 
                        value={age} 
                        onChange={(e) => setAge(e.target.value)} 
                        style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd', backgroundColor: '#36393f', color: 'white' }} 
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ width: '100px', textAlign: 'left' }}>Grade/Grado:</label>
                    <select 
                        value={grade} 
                        onChange={(e) => setGrade(e.target.value)} 
                        style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd', backgroundColor: '#36393f', color: 'white' }} 
                    >
                        <option value="">Select Grade</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>
            </div>

            {grade && <p style={{ marginBottom: '20px' }}>{gradeDescriptions[grade]}</p>}

            <Link href="/typing" onClick={(e) => handleStart(e)}>
                <button style={{ 
                    padding: "10px 20px", 
                    fontSize: "16px",
                    backgroundColor: "#0070f3", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "4px", 
                    cursor: "pointer" 
                }}>
                    Enter App
                </button>
            </Link>

            {ageError && <div style={{ marginTop: '10px', color: 'red', textAlign: 'center' }}>
                <p>Not valid age, must be 6 years or older.</p>
                <p>Edad no válida, debe tener 6 años o más.</p>
            </div>}
        </main>
    );
}