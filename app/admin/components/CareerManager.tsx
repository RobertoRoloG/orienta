"use client";

import { useState, useEffect } from "react";
import { Edit, Trash, Plus, Award } from "lucide-react";

export default function CareerManager({ token }: { token: string }) {
  const [careers, setCareers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingC, setEditingC] = useState<any | null>(null);

  // form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  
  // Dimensions state
  const dimensionsList = ["logic", "analytics", "creativity", "social", "structure", "activity", "verbal", "empathy", "manual"];
  const [dims, setDims] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/careers/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setCareers(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const openModal = (c: any = null) => {
    if (c) {
      setEditingC(c);
      setName(c.name);
      setDescription(c.description || "");
      setTags(c.tags ? c.tags.join(", ") : "");
      setDims(c.dimension_profile || {});
    } else {
      setEditingC({ isNew: true });
      setName("");
      setDescription("");
      setTags("");
      
      const emptyDims: Record<string, number> = {};
      dimensionsList.forEach(d => emptyDims[d] = 0);
      setDims(emptyDims);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert("El nombre de la carrera es obligatorio.");
      return;
    }

    const payload = {
      name,
      description: description || null,
      tags: tags.split(",").map(t => t.trim()).filter(t => t),
      dimension_profile: dims,
      academic_weights: editingC?.academic_weights || {} // Keep old academic weights for now
    };

    const url = editingC?.id 
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/careers/${editingC.id}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/careers/`;
    
    const method = editingC?.id ? "PUT" : "POST";

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
        setEditingC(null);
        fetchCareers();
      } else {
        const error = await res.json();
        alert(`Error al guardar: ${error.detail || 'Desconocido'}`);
      }
    } catch(e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta carrera?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/careers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchCareers();
    } catch(e) {
      console.error(e);
    }
  };

  const handleDimChange = (dim: string, val: string) => {
    setDims(prev => ({ ...prev, [dim]: parseFloat(val) || 0 }));
  };

  if (loading) return <div>Cargando carreras...</div>;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Gestión de Carreras ({careers.length})</h2>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-xl font-bold transition">
          <Plus size={16}/> Nueva Carrera
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {careers.map(c => (
          <div key={c.id} className="bg-black/50 border border-white/10 p-5 rounded-xl flex flex-col group hover:border-emerald-500/50 transition">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-emerald-400 flex items-center gap-2">
                <Award size={18}/> {c.name}
              </h3>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => openModal(c)} className="p-1 hover:bg-white/10 rounded text-emerald-400"><Edit size={16}/></button>
                <button onClick={() => handleDelete(c.id)} className="p-1 hover:bg-white/10 rounded text-red-400"><Trash size={16}/></button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {(c.tags || []).map((t: string) => (
                <span key={t} className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/70 uppercase tracking-wider">{t}</span>
              ))}
            </div>

            <div className="mt-auto grid grid-cols-3 gap-2">
              {Object.entries(c.dimension_profile || {}).slice(0, 3).map(([k, v]) => (
                <div key={k} className="text-center bg-white/5 rounded p-1">
                  <div className="text-[9px] text-white/50 uppercase">{k.substring(0,3)}</div>
                  <div className="font-mono text-xs font-bold">{v as number}</div>
                </div>
              ))}
              <div className="text-center bg-white/5 rounded p-1 flex items-center justify-center text-xs text-white/40">
                +{Object.keys(c.dimension_profile || {}).length > 3 ? Object.keys(c.dimension_profile || {}).length - 3 : 0}
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingC && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl w-full max-w-4xl my-auto">
            <h3 className="text-xl font-bold mb-6">{editingC.isNew ? "Nueva Carrera" : "Editar Carrera"}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-emerald-400 font-semibold border-b border-white/10 pb-2">Información General</h4>
                
                <div>
                  <label className="block text-sm text-white/60 mb-1">Nombre</label>
                  <input 
                    value={name} onChange={e => setName(e.target.value)}
                    className="w-full bg-black border border-white/20 rounded-xl p-3 outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-1">Etiquetas (separadas por coma)</label>
                  <input 
                    value={tags} onChange={e => setTags(e.target.value)}
                    placeholder="Ej: Tecnología, Ciencias, Ingeniería"
                    className="w-full bg-black border border-white/20 rounded-xl p-3 outline-none focus:border-emerald-500 transition text-sm"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-emerald-400 font-semibold border-b border-white/10 pb-2 mb-4">Perfil Dimensional (0 - 10)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {dimensionsList.map(d => (
                    <div key={d} className="bg-black/50 p-2 rounded-lg border border-white/10">
                      <label className="block text-xs text-white/60 mb-1 capitalize">{d}</label>
                      <input 
                        type="number" step="0.1" min="0" max="10"
                        value={dims[d] !== undefined ? dims[d] : 0} 
                        onChange={e => handleDimChange(d, e.target.value)}
                        className="w-full bg-transparent border-b border-white/20 outline-none focus:border-emerald-500 font-mono text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-white/10">
              <button onClick={() => setEditingC(null)} className="px-6 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition">Cancelar</button>
              <button onClick={handleSave} className="px-6 py-2 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition">Guardar Carrera</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
