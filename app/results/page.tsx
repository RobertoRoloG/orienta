"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { ArrowLeft, Award, Zap, BrainCircuit } from "lucide-react";

type UserProfile = {
  logic: number;
  analytics: number;
  creativity: number;
  social: number;
  structure: number;
  activity: number;
  verbal: number;
  empathy: number;
  manual: number;
};

type RankedCareer = {
  id: number;
  name: string;
  match: number;
  breakdown: {
    test: number;
    tastes: number;
    grades: number;
  };
};

const DIMENSION_COLORS: Record<string, string> = {
  "Lógica": "#3b82f6", // blue
  "Analítica": "#06b6d4", // cyan
  "Creatividad": "#d946ef", // fuchsia
  "Social": "#ec4899", // pink
  "Estructura": "#eab308", // yellow
  "Actividad": "#f97316", // orange
  "Verbal": "#8b5cf6", // violet
  "Empatía": "#10b981", // emerald
  "Manual": "#f43f5e", // rose
};

export default function ResultsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [ranked, setRanked] = useState<RankedCareer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    const storedCareers = localStorage.getItem("rankedCareers");

    if (!storedProfile || !storedCareers) {
      router.push("/test");
      return;
    }

    setProfile(JSON.parse(storedProfile));
    setRanked(JSON.parse(storedCareers));
    setLoading(false);
  }, [router]);

  if (loading || !profile) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Generando reporte...</div>;
  }

  // Format data for Recharts
  const chartData = [
    { subject: 'Lógica', A: profile.logic, fullMark: 10 },
    { subject: 'Analítica', A: profile.analytics, fullMark: 10 },
    { subject: 'Creatividad', A: profile.creativity, fullMark: 10 },
    { subject: 'Social', A: profile.social, fullMark: 10 },
    { subject: 'Estructura', A: profile.structure, fullMark: 10 },
    { subject: 'Actividad', A: profile.activity, fullMark: 10 },
    { subject: 'Verbal', A: profile.verbal, fullMark: 10 },
    { subject: 'Empatía', A: profile.empathy, fullMark: 10 },
    { subject: 'Manual', A: profile.manual, fullMark: 10 },
  ];

  const mainCareer = ranked[0];
  const alternatives = ranked.slice(1, 4);

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="max-w-6xl mx-auto px-6 pt-10">
        <h1 className="text-3xl font-bold mb-10 text-center">Análisis de Inteligencia Vocacional</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* LEFT COLUMN: RADAR CHART */}
        <div className="flex flex-col items-center justify-center animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="flex items-center gap-3 mb-6">
            <BrainCircuit className="text-cyan-400" size={28} />
            <h2 className="text-2xl font-bold">Tu Perfil Cognitivo</h2>
          </div>
          <p className="text-white/60 text-center mb-8 max-w-sm">
            Este gráfico de araña representa la intensidad de tus aptitudes naturales. Cada dimensión brilla con su propio color.
          </p>
          
          <div className="w-full h-[400px] bg-white/5 rounded-3xl p-4 border border-white/10 relative overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
                <PolarGrid stroke="#333" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={(props: any) => {
                    const { payload, x, y, textAnchor } = props;
                    const color = DIMENSION_COLORS[payload.value] || "#fff";
                    return (
                      <text x={x} y={y} textAnchor={textAnchor} fill={color} fontSize={14} fontWeight="bold" className="drop-shadow-md">
                        {payload.value}
                      </text>
                    );
                  }}
                />
                {/* Ticks at 0, 2.5, 5, 7.5, 10 */}
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 10]} 
                  tickCount={5} 
                  axisLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '8px' }}
                  itemStyle={{ color: '#06b6d4' }}
                />
                <Radar
                  name="Tu Puntuación"
                  dataKey="A"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fill="#06b6d4"
                  fillOpacity={0.2}
                  dot={(props: any) => {
                    const { cx, cy, payload } = props;
                    const color = DIMENSION_COLORS[payload.subject] || "#fff";
                    return (
                      <circle key={payload.subject} cx={cx} cy={cy} r={5} fill={color} stroke="#000" strokeWidth={1.5} />
                    );
                  }}
                  activeDot={{ r: 7, fill: '#fff', stroke: '#06b6d4' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Dimension Summary */}
          <div className="w-full mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {chartData.map((dim) => (
              <div key={dim.subject} className="bg-white/5 border border-white/10 rounded-lg p-3 flex justify-between items-center hover:bg-white/10 transition">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: DIMENSION_COLORS[dim.subject] }}></div>
                  <span className="text-sm text-white/80">{dim.subject}</span>
                </div>
                <span className="font-mono font-bold text-white">{dim.A.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: CAREERS */}
        <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-150">
          <div className="flex items-center gap-3 mb-6">
            <Award className="text-emerald-400" size={28} />
            <h2 className="text-2xl font-bold">Tus Carreras Ideales</h2>
          </div>

          {/* Top 1 */}
          <div 
            onClick={() => router.push(`/carreras/${mainCareer.id}`)}
            className="cursor-pointer bg-gradient-to-br from-emerald-900/40 to-black border border-emerald-500/30 rounded-2xl p-6 mb-8 relative overflow-hidden group hover:border-emerald-500 transition"
          >
            <div className="absolute top-0 right-0 bg-emerald-500 text-black font-bold px-4 py-1 rounded-bl-xl text-sm">
              TOP MATCH
            </div>
            <h3 className="text-3xl font-bold mb-2 text-emerald-50">{mainCareer.name}</h3>
            <div className="flex items-end gap-2 mb-6">
              <span className="text-5xl font-black text-emerald-400">{mainCareer.match.toFixed(1)}%</span>
              <span className="text-white/60 mb-1">Afinidad Global</span>
            </div>
            
            <div className="bg-black/40 rounded-xl p-4 border border-white/5">
              <p className="text-xs text-white/50 mb-2 uppercase tracking-wider font-semibold">Desglose del Algoritmo</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/80">Personalidad (Test)</span>
                <span className="font-mono">{mainCareer.breakdown.test.toFixed(1)}/100</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-white/80">Tus Gustos</span>
                <span className="font-mono text-cyan-300">{mainCareer.breakdown.tastes.toFixed(1)}/100</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-white/80">Tus Notas (Corte)</span>
                <span className="font-mono text-fuchsia-300">{mainCareer.breakdown.grades.toFixed(1)}/100</span>
              </div>
            </div>
          </div>

          {/* Alternatives */}
          <h3 className="text-xl font-semibold mb-4 text-white/80 flex items-center gap-2">
            <Zap size={20} className="text-amber-400"/> Alternativas Altamente Compatibles
          </h3>
          <div className="space-y-4">
            {alternatives.map((career, idx) => (
              <div 
                key={career.name} 
                onClick={() => router.push(`/carreras/${career.id}`)}
                className="cursor-pointer border border-white/10 bg-white/5 rounded-xl p-5 hover:bg-white/10 hover:border-white/30 transition"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold">{career.name}</h4>
                  <span className="text-xl font-bold text-emerald-400">{career.match.toFixed(1)}%</span>
                </div>
                <div className="flex gap-4 mt-3 text-xs text-white/50 font-mono">
                  <span>T: {career.breakdown.test.toFixed(0)}</span>
                  <span>G: {career.breakdown.tastes.toFixed(0)}</span>
                  <span>N: {career.breakdown.grades.toFixed(0)}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
        </div>
      </div>
    </div>
  );
}