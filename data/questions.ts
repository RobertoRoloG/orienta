import { Question } from "@/types";

export const questions: Question[] = [
  {
    id: 1,
    text: "¿Te gusta resolver problemas matemáticos o lógicos?",
    weights: {
      logic: 1
    },
    importance: 2
  },

  {
    id: 2,
    text: "¿Te interesa entender cómo funcionan las aplicaciones o sistemas?",
    weights: {
      tech: 1,
      logic: 0.5
    },
    importance: 2
  }
];