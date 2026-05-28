import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding started...");

  // Generate safe credentials passwords
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("password123", salt);

  // 1. Create standard administrator
  const admin = await prisma.user.upsert({
    where: { email: "admin@toeicmaster.vn" },
    update: {},
    create: {
      email: "admin@toeicmaster.vn",
      name: "Teacher Linh",
      role: "ADMIN",
      passwordHash: passwordHash,
    },
  });
  console.log(`Seeded admin user: ${admin.email}`);

  // 2. Create standard learner
  const learner = await prisma.user.upsert({
    where: { email: "learner@toeicmaster.vn" },
    update: {},
    create: {
      email: "learner@toeicmaster.vn",
      name: "Minh Dep Trai",
      role: "LEARNER",
      targetScore: 650,
      currentStreak: 5,
      passwordHash: passwordHash,
    },
  });
  console.log(`Seeded learner user: ${learner.email}`);

  // 3. Create dummy vocabulary cards
  const vocabs = [
    {
      word: "abbreviate",
      partOfSpeech: "verb",
      translation: "rút gọn, viết tắt",
      phonetic: "/əˈbriːvieɪt/",
      audioUrl: "https://assets.toeicmaster.vn/audio/abbreviate.mp3",
      contextExampleEn: "Please do not abbreviate words in your official TOEIC answer sheet.",
      contextExampleVi: "Vui lòng không viết tắt các từ trong tờ trả lời TOEIC chính thức của bạn.",
    },
    {
      word: "beneficial",
      partOfSpeech: "adjective",
      translation: "có lợi, hữu ích",
      phonetic: "/ˌbenɪˈfɪʃl/",
      audioUrl: "https://assets.toeicmaster.vn/audio/beneficial.mp3",
      contextExampleEn: "Daily spaced-repetition vocabulary learning is highly beneficial.",
      contextExampleVi: "Học từ vựng lặp lại ngắt quãng hàng ngày là rất có lợi.",
    },
  ];

  for (const vocab of vocabs) {
    const v = await prisma.vocabulary.upsert({
      where: { word: vocab.word },
      update: {},
      create: vocab,
    });
    console.log(`Seeded vocabulary word: ${v.word}`);
  }

  console.log("Seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
