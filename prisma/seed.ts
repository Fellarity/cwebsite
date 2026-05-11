import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Create Mock Tutors
  const tutors = [
    {
      name: "Dr. Elena Vance",
      email: "elena.vance@example.com",
      bio: "Expert in Neural Networks and Deep Learning with 10+ years of academic experience.",
      expertise: ["Python", "PyTorch", "AI Ethics", "ChatGPT", "Claude", "Hugging Face"],
      hourlyRate: 60,
    },
    {
      name: "Marcus Thorne",
      email: "marcus.t@example.com",
      bio: "Full-stack engineer specializing in LLM integration and vector databases.",
      expertise: ["TypeScript", "Next.js", "LangChain", "LlamaIndex", "Pinecone", "Cursor"],
      hourlyRate: 55,
    },
    {
      name: "Sienna Miller",
      email: "sienna.m@example.com",
      bio: "Data Scientist focusing on Natural Language Processing and sentiment analysis.",
      expertise: ["R", "Scikit-Learn", "NLP", "Google Gemini", "Perplexity AI", "Poe"],
      hourlyRate: 50,
    }
  ];

  for (const t of tutors) {
    const user = await prisma.user.upsert({
      where: { email: t.email },
      update: {
        tutorProfile: {
          update: {
            expertise: t.expertise,
            hourlyRate: t.hourlyRate,
          }
        }
      },
      create: {
        email: t.email,
        name: t.name,
        emailVerified: true,
        role: Role.TUTOR,
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
    console.log(`✅ Created/Updated tutor: ${user.name}`);
  }

  // 2. Create Initial Plans based on EUR 50-60 model
  const plans = [
    { title: "Dev Test Plan", sessionCount: 5, duration: 60, price: 1 },
    { title: "Single Session", sessionCount: 1, duration: 60, price: 60 },
    { title: "Starter Bundle", sessionCount: 5, duration: 60, price: 275 },
    { title: "Mastery Bundle", sessionCount: 10, duration: 60, price: 500 },
  ];

  for (const p of plans) {
    await prisma.plan.upsert({
      where: { id: p.title.replace(/\s+/g, '-').toLowerCase() }, // Artificial ID for seeding stability
      update: p,
      create: {
        id: p.title.replace(/\s+/g, '-').toLowerCase(),
        ...p
      }
    });
    console.log(`✅ Created/Updated plan: ${p.title}`);
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
