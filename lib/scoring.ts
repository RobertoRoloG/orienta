import { Question, UserProfile } from "@/types";

export function calculateProfile(
  answers: number[],
  questions: Question[]
): UserProfile {

  const profile: UserProfile = {
    logic: 0,
    analytics: 0,
    creativity: 0,
    social: 0,
    structure: 0,
    tech: 0,
    activity: 0
  };

  questions.forEach((question, index) => {

    const answer = answers[index];

    Object.entries(question.weights).forEach(([key, weight]) => {

      profile[key as keyof UserProfile] +=
        answer * (weight ?? 0) * question.importance;
    });
  });

  return profile;
}