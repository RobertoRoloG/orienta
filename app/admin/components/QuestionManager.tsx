"use client";

import { useState, useEffect } from "react";
import { Edit, Trash, Plus } from "lucide-react";

export default function QuestionManager({ token }: { token: string }) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQ, setEditingQ] = useState<any | null>(null);
  
  // form state
  const [text, setText] = useState("");
  const [weight, setWeight] = useState(1.0);
  const [selectedDims, setSelectedDims] = useState<string[]>([]);

  const dimensionsList = ["Lógica", "Analítica", "Creatividad", "Social", "Estructura", "Actividad", "Verbal", "Empatía", "Manual"];

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/questions/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setQuestions(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!text.trim() || selectedDims.length === 0) {
      alert("El texto y al menos una dimensión son requeridos.");
      return;
    }

    const payload = {
      text,
      dimensions: selectedDims,
      weight
    };

    const url = editingQ?.id 
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/questions/${editingQ.id}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/questions/`;
    
    const method = editingQ?.id ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setEditingQ(null);
        fetchQuestions();
      } else {
        alert("Error al guardar la pregunta.");
      }
    } catch(e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta pregunta?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/questions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchQuestions();
    } catch(e) {
      console.error(e);
    }
  };

  const openModal = (q: any = null) => {
    if (q) {
      setEditingQ(q);
      setText(q.text);
      setWeight(q.weight);
      setSelectedDims(q.dimensions || []);
    } else {
      setEditingQ({ isNew: true });
      setText("");
      setWeight(1.0);
      setSelectedDims([]);
    }
  };

  const toggleDim = (d: string) => {
    if (selectedDims.includes(d)) setSelectedDims(selectedDims.filter(x => x !== d));
    else setSelectedDims([...selectedDims, d]);
  };

  if (loading) return <div>Cargando preguntas...</div>;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Gestión de Preguntas ({questions.length})</h2>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-xl font-bold transition">
          <Plus size={16}/> Nueva Pregunta
        </button>
      </div>

      <div className="space-y-4">
        {questions.map(q => (
          <div key={q.id} className="bg-black/50 border border-white/10 p-4 rounded-xl flex justify-between items-center group hover:border-emerald-500/50 transition">
            <div className="flex-1">
              <p className="font-medium text-white/90">{q.text}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex gap-2">
                  {q.dimensions.map((d: string) => (
                    <span key={d} className="text-xs bg-white/10 px-2 py-1 rounded text-cyan-300">{d}</span>
                  ))}
                </div>
                <span className="text-xs text-white/40">Peso: {q.weight}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
              <button onClick={() => openModal(q)} className="p-2 hover:bg-white/10 rounded-lg text-emerald-400 transition"><Edit size={18}/></button>
              <button onClick={() => handleDelete(q.id)} className="p-2 hover:bg-white/10 rounded-lg text-red-400 transition"><Trash size={18}/></button>
            </div>
          </div>
        ))}
      </div>

      {editingQ && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-6">{editingQ.isNew ? "Nueva Pregunta" : "Editar Pregunta"}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-1">Texto de la pregunta</label>
                <input 
                  value={text} onChange={e => setText(e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-xl p-3 outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Dimensiones que evalúa</label>
                <div className="flex flex-wrap gap-2">
                  {dimensionsList.map(d => (
                    <button 
                      key={d} onClick={() => toggleDim(d)}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition ${selectedDims.includes(d) ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-black border-white/20 text-white/60 hover:border-white/50'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1">Peso (Multiplicador)</label>
                <input 
                  type="number" step="0.1"
                  value={weight} onChange={e => setWeight(parseFloat(e.target.value) || 1)}
                  className="w-full bg-black border border-white/20 rounded-xl p-3 outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button onClick={() => setEditingQ(null)} className="px-6 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition">Cancelar</button>
              <button onClick={handleSave} className="px-6 py-2 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
