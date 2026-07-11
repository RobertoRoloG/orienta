"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Send, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export default function Contacto() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/v1/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ first_name: "", last_name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center pt-20 pb-12">
      {/* Fondos degradados para un toque visual premium */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">

        {/* Lado Izquierdo: Información de Contacto */}
        <div className="flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 w-fit mb-8">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm font-medium text-white/80">Soporte 24/7</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            ¿Tienes alguna <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              duda o sugerencia?
            </span>
          </h1>

          <p className="text-white/60 text-lg mb-12 max-w-md leading-relaxed">
            Estamos aquí para ayudarte a encontrar tu camino ideal. Escríbenos y nuestro equipo de orientación te responderá lo antes posible.
          </p>

          <div className="space-y-8">
            <div className="flex items-center gap-5 group">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 group-hover:text-cyan-400 transition-all duration-300">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-sm text-white/50 mb-1 uppercase tracking-wider font-semibold">Correo Electrónico</p>
                <p className="font-medium text-white/90 text-lg">roberto.rolo.guinot@gmail.com</p>
              </div>
            </div>

            <div className="flex items-center gap-5 group">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-purple-500/10 group-hover:border-purple-500/30 group-hover:text-purple-400 transition-all duration-300">
                <Phone size={24} />
              </div>
              <div>
                <p className="text-sm text-white/50 mb-1 uppercase tracking-wider font-semibold">Teléfono</p>
                <p className="font-medium text-white/90 text-lg">+34 669 29 33 06</p>
              </div>
            </div>

            <div className="flex items-center gap-5 group">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 group-hover:text-emerald-400 transition-all duration-300">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-sm text-white/50 mb-1 uppercase tracking-wider font-semibold">Sede Principal</p>
                <p className="font-medium text-white/90 text-lg">Madrid, España</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Derecho: Formulario Glassmorphism */}
        <div className="bg-white/[0.03] border border-white/10 backdrop-blur-2xl p-8 md:p-10 rounded-[2rem] shadow-2xl">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-white/60 font-medium ml-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  placeholder="Tu nombre"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 focus:ring-1 focus:ring-cyan-400/50 transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-white/60 font-medium ml-1">Apellidos</label>
                <input
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  placeholder="Tus apellidos"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 focus:ring-1 focus:ring-cyan-400/50 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-white/60 font-medium ml-1">Correo Electrónico</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="correo@ejemplo.com"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 focus:ring-1 focus:ring-cyan-400/50 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-white/60 font-medium ml-1">Mensaje</label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="¿En qué podemos ayudarte?"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 focus:ring-1 focus:ring-cyan-400/50 transition-all resize-none"
              ></textarea>
            </div>

            {status === "success" && (
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                <CheckCircle2 size={20} />
                <p className="text-sm font-medium">¡Mensaje enviado correctamente! Te responderemos pronto.</p>
              </div>
            )}
            
            {status === "error" && (
              <div className="flex items-center gap-2 text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                <AlertCircle size={20} />
                <p className="text-sm font-medium">Hubo un error al enviar el mensaje. Inténtalo de nuevo.</p>
              </div>
            )}

            <button
              disabled={isSubmitting}
              className="mt-2 group w-full flex items-center justify-center gap-3 bg-white text-black font-bold rounded-xl px-6 py-4 hover:scale-[1.02] hover:bg-gray-100 transition-all active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  Enviar Mensaje
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}
