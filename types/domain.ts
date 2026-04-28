export type ParsedResume = {
  name: string;
  email: string;
  skills: string[];
  experience: string[];
  education: string[];
};

export type MatchResult = {
  score: number;
  missingSkills: string[];
  strengths: string[];
  reasoning: string;
};
