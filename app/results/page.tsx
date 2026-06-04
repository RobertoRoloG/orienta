"use client";

import { useEffect, useState } from "react";

import { careers } from "@/data/careers";

import { calculateMatch } from "@/lib/matching";

import { CareerProfile, UserProfile } from "@/types";

type RankedCareer = CareerProfile & {
  match: number;
};

export default function ResultsPage() {

  const [ranked, setRanked] = useState<RankedCareer[]>([]);

  useEffect(() => {

    // leer perfil guardado
    const stored = localStorage.getItem("userProfile");

    if (!stored) return;

    const profile: UserProfile = JSON.parse(stored);

    // calcular matches
    const results = careers
      .map((career) => ({
        ...career,
        match: calculateMatch(profile, career)
      }))
      .sort((a, b) => b.match - a.match);

    setRanked(results);

  }, []);

  // mientras carga
  if (ranked.length === 0) {

    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Cargando resultados...</p>
      </div>
    );
  }

  const mainCareer = ranked[0];

  const alternatives = ranked.slice(1, 4);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">

      <div className="max-w-3xl mx-auto">

        <p className="text-white/60 mb-3">
          Tu perfil profesional
        </p>

        <h1 className="text-4xl font-bold mb-8">
          {mainCareer.name}
        </h1>

        <div className="bg-white text-black rounded-xl p-6 mb-10">

          <p className="text-lg mb-2">
            Compatibilidad
          </p>

          <p className="text-5xl font-bold">
            {mainCareer.match.toFixed(1)}%
          </p>

        </div>

        <h2 className="text-2xl font-semibold mb-6">
          Otras opciones compatibles
        </h2>

        <div className="flex flex-col gap-4">

          {alternatives.map((career) => (

            <div
              key={career.name}
              className="border border-white/20 rounded-xl p-5"
            >

              <h3 className="text-xl font-semibold">
                {career.name}
              </h3>

              <p className="text-white/70 mt-2">
                Compatibilidad: {career.match.toFixed(1)}%
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}