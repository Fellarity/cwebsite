/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  const tutors = [
    {
      name: "Dr. Elena Vance",
      email: "elena.vance@example.com",
      bio: "Expert in Neural Networks and Deep Learning with 10+ years of academic experience.",
      expertise: ["Python", "PyTorch", "AI Ethics"],
      hourlyRate: 85,
    },
    {
      name: "Marcus Thorne",
      email: "marcus.t@example.com",
      bio: "Full-stack engineer specializing in LLM integration and vector databases.",
      expertise: ["TypeScript", "Next.js", "LangChain"],
      hourlyRate: 65,
    },
    {
      name: "Sienna Miller",
      email: "sienna.m@example.com",
      bio: "Data Scientist focusing on Natural Language Processing and sentiment analysis.",
      expertise: ["R", "Scikit-Learn", "NLP"],
      hourlyRate: 75,
    }
  ];

  for (const t of tutors) {
    const user = await prisma.user.upsert({
      where: { email: t.email },
      update: {},
      create: {
        email: t.email,
        name: t.name,
        emailVerified: true,
        role: "TUTOR",
        tutorProfile: {
          create: {
            bio: t.bio,
            expertise: t.expertise,
            hourlyRate: t.hourlyRate,
            languages: ["English", "Dutch"],
            verificationStatus: "APPROVED",
            availability: {
              createMany: {
                data: [
                  { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
                  { dayOfWeek: 3, startTime: "09:00", endTime: "17:00" },
                  { dayOfWeek: 5, startTime: "10:00", endTime: "15:00" },
                ]
              }
            }
          }
        }
      }
    });
    console.log(`✅ Created tutor: ${user.name}`);
  }

  const plans = [
    { title: "Quick Starter", sessionCount: 4, duration: 60, price: 199 },
    { title: "Deep Dive", sessionCount: 10, duration: 60, price: 449 },
    { title: "Mastery Path", sessionCount: 20, duration: 60, price: 799 },
  ];

  for (const p of plans) {
    await prisma.plan.create({
      data: p
    });
    console.log(`✅ Created plan: ${p.title}`);
  }

  console.log("🌳 Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
