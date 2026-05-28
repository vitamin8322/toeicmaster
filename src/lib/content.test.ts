import { describe, it, expect, afterAll } from "vitest";
import { prisma } from "./db";

describe("TOEIC Content Relational Model Integration Tests", () => {
  // Store generated IDs for cleanup
  let createdStandaloneId: string;
  let createdGroupId: string;
  let childQuestionIds: string[] = [];

  it("should successfully create and query standalone questions (Part 5)", async () => {
    // 1. Create a standalone Part 5 question
    const standalone = await prisma.question.create({
      data: {
        text: "The sales division achieved its target _____ than expected.",
        optionA: "early",
        optionB: "earlier",
        optionC: "earliest",
        optionD: "early bird",
        correctAnswer: "B",
        explanationVi: "Cần trạng từ so sánh hơn 'earlier' để bổ nghĩa cho động từ 'achieved' kết hợp với cụm từ chỉ thời gian 'than expected'.",
        part: 5,
        subSkillTag: "comparatives",
        difficulty: "medium",
      },
    });

    expect(standalone.id).toBeDefined();
    createdStandaloneId = standalone.id;

    // 2. Query the standalone question from DB and assert values
    const retrieved = await prisma.question.findUnique({
      where: { id: createdStandaloneId },
    });

    expect(retrieved).not.toBeNull();
    expect(retrieved?.correctAnswer).toBe("B");
    expect(retrieved?.part).toBe(5);
    expect(retrieved?.questionGroupId).toBeNull(); // No group association
  });

  it("should successfully create a QuestionGroup and relate multiple child questions (Part 7)", async () => {
    // 1. Create a reading passage group
    const group = await prisma.questionGroup.create({
      data: {
        passageText: "<p>This is a temporary test passage about operations integration.</p>",
        explanation: "Bản tin nội bộ tạm thời.",
        part: 7,
      },
    });

    expect(group.id).toBeDefined();
    createdGroupId = group.id;

    // 2. Create related questions in the group
    const q1 = await prisma.question.create({
      data: {
        text: "What is being tested?",
        optionA: "A software",
        optionB: "A database model",
        optionC: "A template",
        optionD: "A mock framework",
        correctAnswer: "B",
        explanationVi: "Kiểm thử mô hình cơ sở dữ liệu.",
        part: 7,
        subSkillTag: "test_sub",
        difficulty: "easy",
        questionGroupId: createdGroupId,
      },
    });

    const q2 = await prisma.question.create({
      data: {
        text: "Who wrote this integration test?",
        optionA: "Antigravity",
        optionB: "A human",
        optionC: "A compiler",
        optionD: "A server",
        correctAnswer: "A",
        explanationVi: "Do Antigravity thực hiện.",
        part: 7,
        subSkillTag: "test_sub",
        difficulty: "easy",
        questionGroupId: createdGroupId,
      },
    });

    childQuestionIds.push(q1.id, q2.id);

    // 3. Query the QuestionGroup using Prisma include block
    const retrievedGroup = await prisma.questionGroup.findUnique({
      where: { id: createdGroupId },
      include: {
        questions: true,
      },
    });

    expect(retrievedGroup).not.toBeNull();
    expect(retrievedGroup?.part).toBe(7);
    expect(retrievedGroup?.questions).toBeDefined();
    expect(retrievedGroup?.questions.length).toBe(2);
    
    // Assert relationships
    const questionTexts = retrievedGroup?.questions.map((q) => q.text);
    expect(questionTexts).toContain("What is being tested?");
    expect(questionTexts).toContain("Who wrote this integration test?");
  });

  it("should enforce onDelete: Cascade relation mapping between QuestionGroup and child Questions", async () => {
    // Deleting the QuestionGroup should cascade-delete all related child Questions
    await prisma.questionGroup.delete({
      where: { id: createdGroupId },
    });

    // Attempt to retrieve the deleted group
    const deletedGroup = await prisma.questionGroup.findUnique({
      where: { id: createdGroupId },
    });
    expect(deletedGroup).toBeNull();

    // Verify child questions no longer exist in the database (Cascade Delete validation)
    for (const qId of childQuestionIds) {
      const deletedQuestion = await prisma.question.findUnique({
        where: { id: qId },
      });
      expect(deletedQuestion).toBeNull();
    }
  });

  // Clean up standalone test entries post test run
  afterAll(async () => {
    if (createdStandaloneId) {
      await prisma.question.delete({
        where: { id: createdStandaloneId },
      }).catch(() => {});
    }
    await prisma.$disconnect();
  });
});
