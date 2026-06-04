"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black text-white">
      
      <nav className="flex items-center justify-between px-8 py-6 border-b border-white/10">
        <h1 className="text-2xl font-bold">Orienta</h1>

        <div className="flex gap-6">
          <a href="#">Cómo funciona</a>
          <a href="#">Carreras</a>
          <a href="#">Contacto</a>
        </div>
      </nav>

      <section className="flex flex-col items-center justify-center text-center px-6 py-32">
        
        <h2 className="text-6xl font-bold max-w-4xl leading-tight">
          Explora carreras y profesiones compatibles con tu perfil
        </h2>

        <p className="text-white/70 mt-6 max-w-2xl text-lg">
          Descubre opciones profesionales según tus intereses,
          habilidades y objetivos laborales.
        </p>

        <button
          onClick={() => router.push("/test")}
          className="mt-10 bg-white text-black px-8 py-4 rounded-xl font-semibold hover:scale-105 transition"
        >
          Comenzar evaluación
        </button>

      </section>

    </main>
  );
}