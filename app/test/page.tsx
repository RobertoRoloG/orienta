"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Brain, Heart, BookOpen, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function TestPage() {
  const router = useRouter();
  const { token } = useAuth();
  
  // Steps: 1=Test, 2=Tastes, 3=Grades
  const [step, setStep] = useState(1);
  
  // Data States
  const [questions, setQuestions] = useState<{ id: number; text: string }[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<{id: number, name: string}[]>([]);
  
  // User Input States
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [grades, setGrades] = useState<Record<number, string>>({});
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/questions`).then(res => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/metadata/tags`).then(res => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/metadata/subjects`).then(res => res.json())
    ]).then(([qData, tData, sData]) => {
      setQuestions(qData);
      setAnswers(Array(qData.length).fill(0));
      setAvailableTags(tData);
      setAvailableSubjects(sData);
      setLoading(false);
    }).catch(err => {
      setError("No se pudo conectar con el servidor. Asegúrate de que el backend está corriendo.");
      setLoading(false);
    });
  }, []);

  const handleAnswer = (answer: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      if (selectedTags.length >= 3) return;
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async () => {
    if (answers.includes(0)) {
        alert("Debes completar las preguntas del test antes de continuar.");
        setStep(1);
        return;
    }

    setSubmitting(true);
    try {
      const scoreRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/scoring/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (!scoreRes.ok) throw new Error("Error al calcular el perfil");
      const profile = await scoreRes.json();

      const gradesPayload = Object.entries(grades)
        .filter(([_, score]) => score !== "" && !isNaN(Number(score)))
        .map(([id, score]) => ({
          subject_id: parseInt(id),
          score: parseFloat(score as string)
        }));

      const matchRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/matching/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: profile,
          tastes: selectedTags.length > 0 ? selectedTags : undefined,
          grades: gradesPayload.length > 0 ? gradesPayload : undefined
        }),
      });
      if (!matchRes.ok) throw new Error("Error al buscar carreras");
      const rankedCareers = await matchRes.json();

      localStorage.setItem("userProfile", JSON.stringify(profile));
      localStorage.setItem("rankedCareers", JSON.stringify(rankedCareers));

      // Save to backend if logged in
      if (token) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/results/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              dimension_scores: profile,
              tastes: selectedTags.length > 0 ? selectedTags : undefined,
              grades: gradesPayload.length > 0 ? gradesPayload : undefined,
              top_careers: rankedCareers.slice(0, 3) // Save top 3
            }),
          });
        } catch (e) {
          console.error("No se pudo guardar el resultado", e);
        }
      }

      router.push("/results");
    } catch (err) {
      setError("Error de comunicación con el servidor.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Cargando aplicación...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white pt-8 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        
        {/* STEPPER HEADER */}
        <div className="mb-12">
          <div className="flex justify-between items-center relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 -z-10 rounded-full">
              <div 
                className="h-full bg-cyan-500 transition-all duration-500 rounded-full" 
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              ></div>
            </div>
            
            {/* Step 1 Indicator */}
            <div 
              onClick={() => setStep(1)}
              className={`flex flex-col items-center gap-2 cursor-pointer hover:scale-105 transition-transform ${step >= 1 ? 'text-cyan-400' : 'text-white/40'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-cyan-500 text-black' : 'bg-black border-2 border-white/20'}`}>
                <Brain size={18} />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider hidden sm:block">Personalidad</span>
            </div>

            {/* Step 2 Indicator */}
            <div 
              onClick={() => setStep(2)}
              className={`flex flex-col items-center gap-2 cursor-pointer hover:scale-105 transition-transform ${step >= 2 ? 'text-cyan-400' : 'text-white/40'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-500 ${step >= 2 ? 'bg-cyan-500 text-black' : 'bg-black border-2 border-white/20'}`}>
                <Heart size={18} />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider hidden sm:block">Gustos</span>
            </div>

            {/* Step 3 Indicator */}
            <div 
              onClick={() => setStep(3)}
              className={`flex flex-col items-center gap-2 cursor-pointer hover:scale-105 transition-transform ${step >= 3 ? 'text-cyan-400' : 'text-white/40'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-500 ${step >= 3 ? 'bg-cyan-500 text-black' : 'bg-black border-2 border-white/20'}`}>
                <BookOpen size={18} />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider hidden sm:block">Expediente</span>
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 mb-6 text-center bg-red-500/10 p-4 rounded-lg">{error}</p>}

        {/* STEP 1: TEST */}
        {step === 1 && questions.length > 0 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500 bg-white/5 border border-white/10 p-8 rounded-3xl min-h-[40vh] flex flex-col justify-center relative">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-cyan-500 font-bold mb-1">Paso 1 de 3</p>
                <p className="text-sm text-white/60">Pregunta {currentQuestion + 1} de {questions.length}</p>
              </div>
              
              {/* Navegador de Preguntas (Grid) */}
              <div className="grid grid-cols-7 sm:grid-cols-10 gap-1 sm:gap-2">
                {questions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestion(idx)}
                    className={`w-6 h-6 sm:w-8 sm:h-8 text-[10px] sm:text-xs font-bold rounded flex items-center justify-center transition-all ${
                      currentQuestion === idx 
                        ? 'bg-white text-black border-2 border-cyan-500 scale-110' 
                        : answers[idx] !== 0 
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 hover:bg-cyan-500/40' 
                          : 'bg-black/50 text-white/40 border border-white/10 hover:border-white/30'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-semibold mb-12 text-center mt-4 leading-relaxed">{questions[currentQuestion].text}</h1>
            
            <div className="flex gap-2 sm:gap-4 justify-center">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => handleAnswer(num)}
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl font-bold text-lg transition-all hover:scale-105 hover:bg-cyan-400 hover:text-black ${answers[currentQuestion] === num ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-white/10 text-white border border-white/20'}`}
                >
                  {num}
                </button>
              ))}
            </div>
            
            {/* Navigational controls for questions */}
            <div className="flex justify-between items-center w-full mt-12">
              <button 
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="text-white/50 hover:text-white disabled:opacity-30 flex items-center gap-2 transition"
              >
                <ArrowLeft size={16}/> Anterior
              </button>
              
              {currentQuestion < questions.length - 1 ? (
                <button 
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  disabled={answers[currentQuestion] === 0}
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl transition flex items-center gap-2 disabled:opacity-30 disabled:hover:bg-white/10"
                >
                  Siguiente <ArrowRight size={16}/>
                </button>
              ) : (
                <button 
                  onClick={() => setStep(2)}
                  disabled={answers[currentQuestion] === 0}
                  className="bg-cyan-500 text-black px-6 py-2 rounded-xl font-bold transition flex items-center gap-2 disabled:opacity-30 disabled:hover:bg-cyan-500 hover:bg-cyan-400"
                >
                  Continuar a Gustos <ArrowRight size={16}/>
                </button>
              )}
            </div>

            <div className="w-full bg-black h-1.5 rounded-full mt-8 overflow-hidden">
                <div 
                  className="bg-cyan-500 h-full transition-all duration-300" 
                  style={{ width: `${(answers.filter(a => a !== 0).length / questions.length) * 100}%` }}
                />
            </div>
          </div>
        )}

        {/* STEP 2: TASTES */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500 bg-white/5 border border-white/10 p-8 rounded-3xl">
            <p className="text-xs uppercase tracking-widest text-cyan-500 font-bold mb-1">Paso 2 de 3 (Opcional)</p>
            <h2 className="text-3xl font-bold mb-3">¿Qué te apasiona?</h2>
            <p className="text-white/60 mb-8 leading-relaxed">Selecciona hasta 3 áreas de interés para afinar tus resultados. Si no seleccionas ninguna, usaremos solo tu personalidad analizada en el paso anterior.</p>
            
            <div className="flex flex-wrap gap-3 mb-12">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-5 py-3 rounded-full border transition-all font-medium flex items-center gap-2 ${isSelected ? 'bg-cyan-500 border-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'bg-black border-white/20 text-white hover:border-white/60 hover:bg-white/5'}`}
                  >
                    {tag} {isSelected && <Check size={16} />}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between items-center border-t border-white/10 pt-6">
              <button onClick={() => setStep(1)} className="text-white/50 hover:text-white flex items-center gap-2 transition">
                <ArrowLeft size={16}/> Volver
              </button>
              <button onClick={() => setStep(3)} className="bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition">
                Siguiente Paso <ArrowRight size={16}/>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: GRADES */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500 bg-white/5 border border-white/10 p-8 rounded-3xl">
            <p className="text-xs uppercase tracking-widest text-cyan-500 font-bold mb-1">Paso 3 de 3 (Opcional)</p>
            <h2 className="text-3xl font-bold mb-3">Expediente Académico</h2>
            <p className="text-white/60 mb-8 leading-relaxed">Introduce tu media (0 a 10) en estas asignaturas troncales. Actuará como filtro realista para carreras muy exigentes. Déjalo en blanco si prefieres no usarlo.</p>
            
            <div className="space-y-3 mb-12">
              {availableSubjects.map((subject) => (
                <div key={subject.id} className="flex justify-between items-center bg-black/50 p-4 rounded-xl border border-white/10">
                  <span className="font-medium">{subject.name}</span>
                  <input
                    type="number"
                    min="0" max="10" step="0.1"
                    placeholder="Ej: 7.5"
                    value={grades[subject.id] || ""}
                    onChange={(e) => setGrades({...grades, [subject.id]: e.target.value})}
                    className="bg-transparent border-b-2 border-white/20 px-2 py-1 text-right w-20 text-white focus:outline-none focus:border-cyan-500 font-mono text-lg transition-colors"
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center border-t border-white/10 pt-6 gap-4">
              <button onClick={() => setStep(2)} className="text-white/50 hover:text-white flex items-center gap-2 transition order-2 sm:order-1">
                <ArrowLeft size={16}/> Volver
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-cyan-500 text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-cyan-400 transition shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:shadow-none w-full sm:w-auto order-1 sm:order-2 flex items-center justify-center gap-2"
              >
                <Brain size={20}/>
                {submitting ? "Calculando..." : "Realizar prueba de compatibilidad"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}