import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding started...");

  // 0. Clear existing questions and groups to avoid key conflicts
  await prisma.progressActivity.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.questionGroup.deleteMany({});

  // Generate safe credentials passwords
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("password123", salt);

  // 1. Create standard administrator
  const admin = await prisma.user.upsert({
    where: { email: "admin@toeicmaster.vn" },
    update: {
      passwordHash: passwordHash,
      onboardingCompleted: true,
      role: "ADMIN",
    },
    create: {
      email: "admin@toeicmaster.vn",
      name: "Teacher Linh",
      role: "ADMIN",
      onboardingCompleted: true,
      passwordHash: passwordHash,
    },
  });
  console.log(`Seeded admin user: ${admin.email}`);
 
  // 2. Create standard learner
  const learner = await prisma.user.upsert({
    where: { email: "learner@toeicmaster.vn" },
    update: {
      passwordHash: passwordHash,
      onboardingCompleted: true,
      role: "LEARNER",
    },
    create: {
      email: "learner@toeicmaster.vn",
      name: "Minh Dep Trai",
      role: "LEARNER",
      targetScore: 650,
      onboardingCompleted: true,
      currentStreak: 5,
      passwordHash: passwordHash,
    },
  });
  console.log(`Seeded learner user: ${learner.email}`);
 
  // 2.5 Create non-onboarded learner for E2E testing
  const newbie = await prisma.user.upsert({
    where: { email: "newbie@toeicmaster.vn" },
    update: {
      targetScore: null,
      onboardingCompleted: false,
      currentStreak: 0,
      passwordHash: passwordHash,
    },
    create: {
      email: "newbie@toeicmaster.vn",
      name: "New Student",
      role: "LEARNER",
      targetScore: null,
      onboardingCompleted: false,
      currentStreak: 0,
      passwordHash: passwordHash,
    },
  });
  console.log(`Seeded non-onboarded user: ${newbie.email}`);

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

  // 3. Create Standalone Listening Part 1 Photograph Questions (Minimum 3)
  const part1Questions = [
    {
      text: "Look at the photograph and choose the best statement describing it.",
      optionA: "A woman is taking a folder from a cabinet.",
      optionB: "A woman is closing a drawer of a desk.",
      optionC: "A woman is writing on a piece of paper.",
      optionD: "A woman is moving a piece of furniture.",
      correctAnswer: "A",
      explanationVi: "Trong ảnh người phụ nữ đang lấy một tập tài liệu từ tủ ('woman is taking a folder from a cabinet').",
      part: 1,
      subSkillTag: "photograph_office",
      difficulty: "easy",
      audioUrl: "https://assets.toeicmaster.vn/audio/part1_q1.mp3",
      imageUrl: "https://assets.toeicmaster.vn/images/part1_q1.jpg",
    },
    {
      text: "Look at the photograph and choose the best statement describing it.",
      optionA: "Some people are boarding an airplane.",
      optionB: "Some people are waiting at a gate.",
      optionC: "Some people are placing luggage in overhead bins.",
      optionD: "Some people are walking on a runway.",
      correctAnswer: "B",
      explanationVi: "Người dân đang chờ đợi ở cổng ('waiting at a gate') trong phòng chờ sân bay.",
      part: 1,
      subSkillTag: "photograph_airport",
      difficulty: "medium",
      audioUrl: "https://assets.toeicmaster.vn/audio/part1_q2.mp3",
      imageUrl: "https://assets.toeicmaster.vn/images/part1_q2.jpg",
    },
    {
      text: "Look at the photograph and choose the best statement describing it.",
      optionA: "One of the men is wearing a safety helmet.",
      optionB: "The men are working in an outdoor garden.",
      optionC: "One of the men is lifting a heavy metal bar.",
      optionD: "The men are discussing a blueprint document.",
      correctAnswer: "D",
      explanationVi: "Hai người đàn ông đang thảo luận về bản vẽ thiết kế ('discussing a blueprint document') tại công trường.",
      part: 1,
      subSkillTag: "photograph_construction",
      difficulty: "hard",
      audioUrl: "https://assets.toeicmaster.vn/audio/part1_q3.mp3",
      imageUrl: "https://assets.toeicmaster.vn/images/part1_q3.jpg",
    },
  ];

  for (const q of part1Questions) {
    await prisma.question.create({ data: q });
  }
  console.log("Seeded 3 standalone Listening Part 1 photograph questions.");

  // 4. Create Standalone Reading Part 5 Incomplete Sentences (Minimum 5)
  const part5Questions = [
    {
      text: "The new marketing director decided to _____ the advertising budget to focus more on digital channels.",
      optionA: "reallocate",
      optionB: "reallocated",
      optionC: "reallocating",
      optionD: "reallocation",
      correctAnswer: "A",
      explanationVi: "Sau cấu trúc động từ nguyên mẫu 'decided to' cần một động từ nguyên thế (bare infinitive). 'reallocate' (A) là động từ duy nhất phù hợp ngữ pháp.",
      part: 5,
      subSkillTag: "infinitives",
      difficulty: "easy",
    },
    {
      text: "The supervisor requested that all monthly sales reports be completed _____ before Friday afternoon.",
      optionA: "promptly",
      optionB: "prompt",
      optionC: "promptness",
      optionD: "prompter",
      correctAnswer: "A",
      explanationVi: "Khoảng trống đứng sau phân từ hai 'completed' và bổ nghĩa cho hành động này, vì vậy ta cần một trạng từ chỉ cách thức. 'promptly' (A) có nghĩa là nhanh chóng/kịp thời.",
      part: 5,
      subSkillTag: "adverbs",
      difficulty: "easy",
    },
    {
      text: "Ms. Patel will oversee the client presentation herself because Mr. Jackson is _____ busy with another project.",
      optionA: "extremely",
      optionB: "extreme",
      optionC: "extremes",
      optionD: "extremity",
      correctAnswer: "A",
      explanationVi: "Cần một trạng từ bổ nghĩa cho tính từ 'busy'. 'extremely' (A) có nghĩa là cực kỳ/rất.",
      part: 5,
      subSkillTag: "adverbs_modifying_adjectives",
      difficulty: "medium",
    },
    {
      text: "Employees participating in the leadership training workshop are advised to review the materials _____.",
      optionA: "themselves",
      optionB: "their",
      optionC: "them",
      optionD: "they",
      correctAnswer: "A",
      explanationVi: "Cần đại từ phản thân 'themselves' (A) đóng vai trò làm trạng ngữ nhấn mạnh hành động tự ôn tập tài liệu của nhân viên.",
      part: 5,
      subSkillTag: "reflexive_pronouns",
      difficulty: "medium",
    },
    {
      text: "_____ the high cost of raw materials, the construction company maintained a healthy profit margin last quarter.",
      optionA: "Despite",
      optionB: "Although",
      optionC: "Even though",
      optionD: "Whereas",
      correctAnswer: "A",
      explanationVi: "Khoảng trống đứng trước một cụm danh từ 'the high cost...'. 'Despite' (A) là giới từ phù hợp chỉ sự nhượng bộ (mặc dù). 'Although', 'Even though' cần đi kèm một mệnh đề.",
      part: 5,
      subSkillTag: "prepositions_vs_conjunctions",
      difficulty: "hard",
    },
  ];

  for (const q of part5Questions) {
    await prisma.question.create({ data: q });
  }
  console.log("Seeded 5 standalone Reading Part 5 grammar/vocab questions.");

  // 5. Create Grouped Listening Part 3 Conversation (1 Group with 3 Questions)
  const part3Group = await prisma.questionGroup.create({
    data: {
      audioUrl: "https://assets.toeicmaster.vn/audio/part3_conv1.mp3",
      explanation: "Hội thoại giữa hai đồng nghiệp bàn về việc dời ngày tổ chức buổi hội thảo công nghệ do sự cố đặt chỗ phòng họp.",
      part: 3,
    },
  });

  const part3Questions = [
    {
      text: "Why is the tech seminar being rescheduled?",
      optionA: "A speaker cancelled the session.",
      optionB: "The auditorium booking was doubled.",
      optionC: "Poor weather conditions are expected.",
      optionD: "Required equipment is unavailable.",
      correctAnswer: "B",
      explanationVi: "Người phụ nữ nói 'The conference hall was mistakenly reserved for another corporate event on the same day' -> Hội trường hội thảo bị đặt trùng lịch.",
      part: 3,
      subSkillTag: "listening_details",
      difficulty: "medium",
      questionGroupId: part3Group.id,
    },
    {
      text: "What does the man offer to do?",
      optionA: "Call the catering company.",
      optionB: "Send email notifications to attendees.",
      optionC: "Draft a new scheduling timeline.",
      optionD: "Refund the ticket purchases.",
      correctAnswer: "B",
      explanationVi: "Người đàn ông nói 'I can compile the list of registered participants and email them about the date changes right away' -> Gửi thông báo qua email cho người tham gia.",
      part: 3,
      subSkillTag: "listening_action_offers",
      difficulty: "medium",
      questionGroupId: part3Group.id,
    },
    {
      text: "When will the seminar most likely take place?",
      optionA: "Next Monday afternoon",
      optionB: "This coming Friday morning",
      optionC: "Next Thursday morning",
      optionD: "Next Wednesday afternoon",
      correctAnswer: "C",
      explanationVi: "Người phụ nữ đề xuất 'Let's secure the morning slot next Thursday instead' -> Sáng Thứ Năm tuần tới.",
      part: 3,
      subSkillTag: "listening_inferences",
      difficulty: "hard",
      questionGroupId: part3Group.id,
    },
  ];

  for (const q of part3Questions) {
    await prisma.question.create({ data: q });
  }
  console.log("Seeded 1 Listening Part 3 Conversation Group with 3 child questions.");

  // 6. Create Grouped Reading Part 7 Reading Passage (1 Group with 2 Questions)
  const part7Group = await prisma.questionGroup.create({
    data: {
      passageText: `
        <div class="space-y-4">
          <p class="font-bold">MEMORANDUM</p>
          <p><strong>TO:</strong> All Sales Department Staff</p>
          <p><strong>FROM:</strong> Marcus Vance, Regional Sales Manager</p>
          <p><strong>DATE:</strong> May 28, 2026</p>
          <p><strong>SUBJECT:</strong> Upcoming Software Integration Training Sessions</p>
          <hr/>
          <p>As announced last month, our branch will officially transition to the Apex CRM system starting July 1. This new software will streamline customer relation tracking and replace our aging sales logs.</p>
          <p>To ensure a seamless transition, mandatory hands-on training sessions have been scheduled. Each employee must register for one session. The workshops will take place in Conference Room B on the third floor. Please visit the company portal by June 15 to select one of the following available slots:</p>
          <ul class="list-disc pl-5">
            <li>Session 1: June 18, 9:00 AM - 12:00 PM</li>
            <li>Session 2: June 20, 2:00 PM - 5:00 PM</li>
            <li>Session 3: June 23, 10:00 AM - 1:00 PM</li>
          </ul>
          <p>Failure to complete training prior to the system launch will affect access credentials. Direct any immediate technical questions to the IT Helpdesk.</p>
        </div>
      `,
      explanation: "Bản ghi nhớ nội bộ gửi cho nhân viên bộ phận bán hàng thông báo về các buổi đào tạo bắt buộc về việc tích hợp hệ thống quản lý khách hàng Apex CRM.",
      part: 7,
    },
  });

  const part7Questions = [
    {
      text: "What is the primary purpose of the memorandum?",
      optionA: "To recruit staff for training session leadership positions.",
      optionB: "To announce system requirements for employee computers.",
      optionC: "To notify workers about mandatory software training workshops.",
      optionD: "To propose changes to the company sales database.",
      correctAnswer: "C",
      explanationVi: "Bản ghi nhớ nhắc nhở nhân viên về 'upcoming software integration training sessions' và 'mandatory hands-on training sessions' -> Thông báo đào tạo bắt buộc.",
      part: 7,
      subSkillTag: "reading_main_purpose",
      difficulty: "medium",
      questionGroupId: part7Group.id,
    },
    {
      text: "By what date must employees complete registration for their session?",
      optionA: "June 15",
      optionB: "June 18",
      optionC: "July 1",
      optionD: "May 28",
      correctAnswer: "A",
      explanationVi: "Văn bản nêu rõ: 'Please visit the company portal by June 15 to select one of the following available slots' -> Nhân viên phải đăng ký trước ngày 15 tháng 6.",
      part: 7,
      subSkillTag: "reading_details",
      difficulty: "medium",
      questionGroupId: part7Group.id,
    },
  ];

  for (const q of part7Questions) {
    await prisma.question.create({ data: q });
  }
  console.log("Seeded 1 Reading Part 7 Passage Group with 2 child questions.");

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
