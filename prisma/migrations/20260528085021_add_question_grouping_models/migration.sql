-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "questionGroupId" TEXT;

-- CreateTable
CREATE TABLE "QuestionGroup" (
    "id" TEXT NOT NULL,
    "passageText" TEXT,
    "audioUrl" TEXT,
    "imageUrl" TEXT,
    "explanation" TEXT,
    "part" INTEGER NOT NULL,
    "testSetId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuestionGroup_part_idx" ON "QuestionGroup"("part");

-- CreateIndex
CREATE INDEX "Question_part_idx" ON "Question"("part");

-- CreateIndex
CREATE INDEX "Question_questionGroupId_idx" ON "Question"("questionGroupId");

-- AddForeignKey
ALTER TABLE "QuestionGroup" ADD CONSTRAINT "QuestionGroup_testSetId_fkey" FOREIGN KEY ("testSetId") REFERENCES "TestSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_questionGroupId_fkey" FOREIGN KEY ("questionGroupId") REFERENCES "QuestionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
