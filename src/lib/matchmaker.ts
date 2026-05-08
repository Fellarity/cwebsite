import { prisma } from "./prisma";
import { User, TutorProfile } from "@prisma/client";

export type RecommendedTutor = User & {
  tutorProfile: TutorProfile | null;
};

export async function getRecommendedTutors(userId: string): Promise<RecommendedTutor[]> {
  // 1. Fetch Student Profile
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId },
  });

  if (!studentProfile) return [];

  const goal = studentProfile.learningGoal;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onboardingAnswers = studentProfile.onboardingAnswers as any;
  const preferredLanguage = onboardingAnswers?.language || "English";

  // 2. Query Tutors
  const tutors = await prisma.user.findMany({
    where: {
      role: "TUTOR",
      tutorProfile: {
        isNot: null,
      }
    },
    include: {
      tutorProfile: true
    },
    take: 10 // Get a bunch to filter in-memory if needed, but let's try basic first
  });

  // 3. Simple in-memory filtering for better reliability with experimental versions
  const matched = tutors.filter(t => {
    if (!t.tutorProfile) return false;
    const hasGoal = t.tutorProfile.expertise.includes(goal || "");
    const hasLang = t.tutorProfile.languages.includes(preferredLanguage);
    return hasGoal || hasLang;
  }).slice(0, 3);

  return matched as RecommendedTutor[];
}
