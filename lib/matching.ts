import { CareerProfile, UserProfile } from "@/types";

export function calculateMatch(
  user: UserProfile,
  career: CareerProfile
) {

  const keys = Object.keys(user) as (keyof UserProfile)[];

  let sum = 0;

  keys.forEach((key) => {
    sum += Math.pow(user[key] - career[key], 2);
  });

  const distance = Math.sqrt(sum);

  return Math.max(0, 100 - distance / 3);
}