"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User as UserIcon, Lock, Mail, Check, X } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Password validation state
  const [validLength, setValidLength] = useState(false);
  const [validNumber, setValidNumber] = useState(false);
  const [validUpper, setValidUpper] = useState(false);

  useEffect(() => {
    setValidLength(password.length >= 8);
    setValidNumber(/\d/.test(password));
    setValidUpper(/[A-Z]/.test(password));
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validLength || !validNumber || !validUpper) {
      setError("La contraseña no cumple con los requisitos mínimos.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Error al crear la cuenta");
      }

      // Success, redirect to login
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />
          
          <h2 className="text-3xl font-bold text-center mb-2">Crea tu cuenta</h2>
          <p className="text-white/60 text-center mb-8">Únete para guardar tu progreso</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Nombre</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 transition"
                  placeholder="Tu nombre"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 transition"
                  placeholder="tu@correo.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Contraseña</label>
              <div className="relative mb-3">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 transition"
                  placeholder="••••••••"
                />
              </div>
              
              {/* Validaciones de contraseña */}
              <div className="space-y-1 bg-black/50 p-3 rounded-lg border border-white/5">
                <p className={`text-xs flex items-center gap-2 ${validLength ? 'text-emerald-400' : 'text-white/40'}`}>
                  {validLength ? <Check size={14}/> : <X size={14}/>} Mínimo 8 caracteres
                </p>
                <p className={`text-xs flex items-center gap-2 ${validUpper ? 'text-emerald-400' : 'text-white/40'}`}>
                  {validUpper ? <Check size={14}/> : <X size={14}/>} Al menos una mayúscula
                </p>
                <p className={`text-xs flex items-center gap-2 ${validNumber ? 'text-emerald-400' : 'text-white/40'}`}>
                  {validNumber ? <Check size={14}/> : <X size={14}/>} Al menos un número
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !validLength || !validNumber || !validUpper}
              className="w-full bg-cyan-500 text-black font-bold py-3 rounded-xl hover:bg-cyan-400 transition mt-6 disabled:opacity-50 disabled:hover:bg-cyan-500"
            >
              {loading ? "Creando cuenta..." : "Crear Cuenta"}
            </button>
          </form>

          <p className="text-center text-white/60 mt-8 text-sm">
            ¿Ya tienes cuenta? <Link href="/login" className="text-cyan-400 hover:text-cyan-300">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
