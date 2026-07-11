"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black text-white">
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