export type UserProfile = {
  logic: number;
  analytics: number;
  creativity: number;
  social: number;
  structure: number;
  tech: number;
  activity: number;
};

export type Question = {
  id: number;
  text: string;
  weights: Partial<UserProfile>;
  importance: 1 | 1.5 | 2;
};

export type CareerProfile = UserProfile & {
  name: string;
};