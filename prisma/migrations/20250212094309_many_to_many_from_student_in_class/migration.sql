/*
  Warnings:

  - You are about to drop the column `studentsinClassId` on the `HistoryClass` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "HistoryClass" DROP CONSTRAINT "HistoryClass_studentsinClassId_fkey";

-- AlterTable
ALTER TABLE "HistoryClass" DROP COLUMN "studentsinClassId";

-- CreateTable
CREATE TABLE "_HistoryClassToStudentsinClass" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_HistoryClassToStudentsinClass_AB_unique" ON "_HistoryClassToStudentsinClass"("A", "B");

-- CreateIndex
CREATE INDEX "_HistoryClassToStudentsinClass_B_index" ON "_HistoryClassToStudentsinClass"("B");

-- AddForeignKey
ALTER TABLE "_HistoryClassToStudentsinClass" ADD CONSTRAINT "_HistoryClassToStudentsinClass_A_fkey" FOREIGN KEY ("A") REFERENCES "HistoryClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HistoryClassToStudentsinClass" ADD CONSTRAINT "_HistoryClassToStudentsinClass_B_fkey" FOREIGN KEY ("B") REFERENCES "StudentsinClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;
