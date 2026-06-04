"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { questions } from "@/data/questions";

import { calculateProfile } from "@/lib/scoring";

export default function TestPage() {

  const router = useRouter();

  const [current, setCurrent] = useState(0);

  const [answers, setAnswers] = useState<number[]>(
    Array(questions.length).fill(0)
  );

  const question = questions[current];

  const handleAnswer = (answer: number) => {

    const newAnswers = [...answers];

    newAnswers[current] = answer;

    setAnswers(newAnswers);

    // siguiente pregunta
    if (current < questions.length - 1) {

      setCurrent(current + 1);

    } else {

      // calcular perfil
      const profile = calculateProfile(
        newAnswers,
        questions
      );

      // guardar perfil
      localStorage.setItem(
        "userProfile",
        JSON.stringify(profile)
      );

      // navegar a resultados
      router.push("/results");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">

      <div className="max-w-xl w-full">

        <p className="text-sm text-white/60 mb-4">
          Pregunta {current + 1} de {questions.length}
        </p>

        <h1 className="text-2xl font-semibold mb-10">
          {question.text}
        </h1>

        <div className="flex gap-3">

          {[1, 2, 3, 4, 5].map((num) => (

            <button
              key={num}
              onClick={() => handleAnswer(num)}
              className="bg-white text-black w-12 h-12 rounded-lg hover:scale-105 transition"
            >
              {num}
            </button>

          ))}

        </div>

      </div>

    </div>
  );
}