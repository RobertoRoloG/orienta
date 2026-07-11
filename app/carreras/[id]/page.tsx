"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, TrendingUp, Building2, Briefcase, GraduationCap } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";

const DIMENSION_COLORS: Record<string, string> = {
  "logic": "#3b82f6",
  "analytics": "#06b6d4",
  "creativity": "#d946ef",
  "social": "#ec4899",
  "structure": "#eab308",
  "activity": "#f97316",
  "verbal": "#8b5cf6",
  "empathy": "#10b981",
  "manual": "#f43f5e",
};

const DIMENSION_NAMES: Record<string, string> = {
  "logic": "Lógica",
  "analytics": "Analítica",
  "creativity": "Creatividad",
  "social": "Social",
  "structure": "Estructura",
  "activity": "Actividad",
  "verbal": "Verbal",
  "empathy": "Empatía",
  "manual": "Manual",
};

export default function CareerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [career, setCareer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id || params.id === "undefined") {
      setLoading(false);
      return;
    }
    
    // Fetch career details
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/careers/${params.id}`)
      .then(res => {
        if (!res.ok) throw new Error("Error en la respuesta");
        return res.json();
      })
      .then(data => {
        setCareer(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching career", err);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
        <p className="text-white/60 animate-pulse">Consultando la Inteligencia Artificial...</p>
        <p className="text-xs text-white/40 mt-2">Analizando salarios y salidas laborales en tiempo real</p>
      </div>
    );
  }

  if (!career) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Carrera no encontrada</div>;
  }

  // Format data for Recharts
  const chartData = Object.entries(career.dimension_profile || {}).map(([key, val]) => ({
    subject: DIMENSION_NAMES[key] || key,
    A: Number(val),
    fullMark: 10,
    rawKey: key
  }));

  const isSimulated = career.average_salary?.includes("simulados");

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="border-b border-white/10 bg-black/50 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="text-white/60 hover:text-white transition">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Detalle de Carrera</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-10">
        
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text">
            {career.name}
          </h1>
          <div className="flex flex-wrap gap-2 mb-6">
            {(career.tags || []).map((t: string) => (
              <span key={t} className="bg-white/10 px-3 py-1 rounded-full text-sm font-medium">{t}</span>
            ))}
          </div>
          <p className="text-xl text-white/70 max-w-3xl leading-relaxed">
            {career.description || "Una excelente opción profesional basada en tu perfil."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Market Data (AI Generated) */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-white/5 to-white/0 border border-emerald-500/30 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-bl-2xl text-xs font-bold flex items-center gap-2">
                <Sparkles size={14}/> {isSimulated ? "Datos Simulados" : "Datos por IA"}
              </div>
              
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <TrendingUp className="text-emerald-400"/> Mercado Laboral
              </h2>
              
              <div className="mb-8">
                <p className="text-white/50 text-sm mb-1">Salario Medio Estimado</p>
                <p className="text-3xl font-bold text-white">{career.average_salary || "No disponible"}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-black/40 border border-emerald-500/20 rounded-xl p-4 text-center">
                  <p className="text-emerald-400 text-2xl font-bold">{career.employability_rate != null ? `${career.employability_rate}%` : "-"}</p>
                  <p className="text-white/50 text-xs mt-1">Empleabilidad</p>
                </div>
                <div className="bg-black/40 border border-cyan-500/20 rounded-xl p-4 text-center">
                  <p className="text-cyan-400 text-2xl font-bold">{career.graduation_rate != null ? `${career.graduation_rate}%` : "-"}</p>
                  <p className="text-white/50 text-xs mt-1">Egresados</p>
                </div>
                <div className="bg-black/40 border border-rose-500/20 rounded-xl p-4 text-center">
                  <p className="text-rose-400 text-2xl font-bold">{career.regret_rate != null ? `${career.regret_rate}%` : "-"}</p>
                  <p className="text-white/50 text-xs mt-1">Arrepentimiento</p>
                </div>
              </div>

              <div>
                <p className="text-white/50 text-sm mb-3">Principales Salidas Laborales</p>
                <div className="space-y-3">
                  {(career.job_prospects || []).map((job: string, idx: number) => (
                    <div key={idx} className="bg-black/50 border border-white/5 rounded-xl p-3 flex items-center gap-3">
                      <Briefcase className="text-cyan-400" size={18}/>
                      <span className="font-medium text-white/90">{job}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {career.market_data_updated_at && (
                <p className="text-[10px] text-white/30 mt-6 text-right">
                  Última actualización: {new Date(career.market_data_updated_at).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Academic Weights */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <GraduationCap className="text-cyan-400"/> Ponderación Académica
              </h2>
              {Object.keys(career.academic_weights || {}).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(career.academic_weights).map(([id, weight]) => (
                    <div key={id} className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-white/80">Asignatura {id}</span>
                      <span className="font-mono text-cyan-300 font-bold bg-cyan-900/30 px-2 py-1 rounded">x{weight as number}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/50">Esta carrera no tiene ponderaciones académicas específicas registradas.</p>
              )}
            </div>
          </div>

          {/* Radar Chart */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2 self-start">Perfil Ideal</h2>
            <p className="text-white/50 text-sm mb-8 self-start">
              Aptitudes requeridas para tener éxito en esta carrera.
            </p>
            
            <div className="w-full h-[400px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
                  <PolarGrid stroke="#333" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={(props: any) => {
                      const { payload, x, y, textAnchor } = props;
                      const dKey = chartData.find(d => d.subject === payload.value)?.rawKey || "";
                      const color = DIMENSION_COLORS[dKey] || "#fff";
                      return (
                        <text x={x} y={y} textAnchor={textAnchor} fill={color} fontSize={12} fontWeight="bold">
                          {payload.value}
                        </text>
                      );
                    }}
                  />
                  <PolarRadiusAxis angle={90} domain={[0, 10]} tickCount={5} axisLine={false} tick={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333' }} />
                  <Radar name="Perfil Requerido" dataKey="A" stroke="#10b981" strokeWidth={2} fill="#10b981" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-full mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {chartData.sort((a,b) => b.A - a.A).slice(0,6).map((dim) => (
                <div key={dim.subject} className="bg-black/50 border border-white/5 rounded p-2 flex justify-between items-center">
                  <span className="text-xs text-white/70">{dim.subject}</span>
                  <span className="font-mono text-sm font-bold text-emerald-400">{dim.A.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
