"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { ShieldAlert, Database, Award } from "lucide-react";
import QuestionManager from "./components/QuestionManager";
import CareerManager from "./components/CareerManager";

export default function AdminPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"questions" | "careers">("questions");

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "admin") {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Verificando permisos...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="max-w-6xl mx-auto px-6 pt-10">
        <div className="flex items-center gap-4 mb-8">
          <ShieldAlert className="text-emerald-500" size={32} />
          <h1 className="text-3xl font-bold text-emerald-500">Panel de Administración</h1>
        </div>
        <div className="flex gap-4 border-b border-white/10 mb-8 pb-2 overflow-x-auto">
          <button 
            onClick={() => setActiveTab("questions")}
            className={`flex items-center gap-2 px-4 py-2 font-semibold transition whitespace-nowrap ${activeTab === "questions" ? "text-emerald-400 border-b-2 border-emerald-400" : "text-white/60 hover:text-white"}`}
          >
            <Database size={18}/> Preguntas y Test
          </button>
          <button 
            onClick={() => setActiveTab("careers")}
            className={`flex items-center gap-2 px-4 py-2 font-semibold transition whitespace-nowrap ${activeTab === "careers" ? "text-emerald-400 border-b-2 border-emerald-400" : "text-white/60 hover:text-white"}`}
          >
            <Award size={18}/> Carreras Profesionales
          </button>
        </div>
        
        {token && (
          <div>
            {activeTab === "questions" && <QuestionManager token={token} />}
            {activeTab === "careers" && <CareerManager token={token} />}
          </div>
        )}
      </div>
    </div>
  );
}
