"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { LogOut, User as UserIcon, BrainCircuit, Activity, Settings, Calendar } from "lucide-react";

export default function ProfilePage() {
  const { user, token, logout, loading } = useAuth();
  const router = useRouter();
  const [results, setResults] = useState<any[]>([]);
  const [loadingResults, setLoadingResults] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user && token) {
      // Fetch results
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/results/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setLoadingResults(false);
      })
      .catch(err => {
        console.error("Failed to fetch results", err);
        setLoadingResults(false);
      });
    }
  }, [user, loading, router, token]);

  if (loading || !user) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Cargando perfil...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">


      <div className="max-w-4xl mx-auto px-6 pt-10">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center">
              <UserIcon size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-white/50">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user.role === "admin" && (
              <button onClick={() => router.push("/admin")} className="text-emerald-400 hover:text-emerald-300 font-semibold text-sm flex items-center gap-2">
                <Settings size={16}/> Panel Admin
              </button>
            )}
            <button onClick={logout} className="text-white/60 hover:text-red-400 transition flex items-center gap-2 text-sm">
              <LogOut size={16} /> Cerrar Sesión
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Activity className="text-cyan-400" /> Tu Actividad
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center hover:border-cyan-500/50 transition group">
            <div className="w-16 h-16 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <BrainCircuit size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Test de Orientación</h3>
            <p className="text-white/60 text-sm mb-6">Realiza o repite el test para descubrir tus carreras ideales basadas en tu perfil cognitivo actual.</p>
            <button onClick={() => router.push("/test")} className="mt-auto bg-white text-black px-6 py-2 rounded-xl font-bold hover:bg-cyan-400 transition">
              Realizar Test
            </button>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
            <h3 className="text-xl font-bold mb-4">Últimos Resultados</h3>
            
            {loadingResults ? (
              <p className="text-white/60 text-sm">Cargando historial...</p>
            ) : results.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-white/60 text-sm mb-4">Aún no has guardado ningún test.</p>
              </div>
            ) : (
              <div className="space-y-4 flex-1">
                {results.slice(0, 3).map((r, idx) => (
                  <div key={idx} className="bg-black border border-white/10 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-emerald-400">{r.top_careers[0]?.name || "Sin resultados"}</h4>
                      <div className="flex items-center gap-1 text-xs text-white/50 mt-1">
                        <Calendar size={12}/>
                        {new Date(r.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        localStorage.setItem("userProfile", JSON.stringify(r.dimension_scores));
                        localStorage.setItem("rankedCareers", JSON.stringify(r.top_careers));
                        router.push("/results");
                      }}
                      className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition font-medium"
                    >
                      Ver Detalle
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {results.length > 0 && (
              <button onClick={() => {
                const latest = results[0];
                localStorage.setItem("userProfile", JSON.stringify(latest.dimension_scores));
                localStorage.setItem("rankedCareers", JSON.stringify(latest.top_careers));
                router.push("/results");
              }} className="mt-6 w-full bg-white/10 text-white border border-white/20 px-6 py-2 rounded-xl font-bold hover:bg-white/20 transition">
                Ver Resultado Actual
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
