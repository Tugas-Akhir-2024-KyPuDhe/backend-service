/*
  Warnings:

  - You are about to drop the `_HistoryClassToStudentsinClass` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_HistoryClassToStudentsinClass" DROP CONSTRAINT "_HistoryClassToStudentsinClass_A_fkey";

-- DropForeignKey
ALTER TABLE "_HistoryClassToStudentsinClass" DROP CONSTRAINT "_HistoryClassToStudentsinClass_B_fkey";

-- AlterTable
ALTER TABLE "HistoryClass" ADD COLUMN     "studentsinClassId" INTEGER;

-- DropTable
DROP TABLE "_HistoryClassToStudentsinClass";

-- AddForeignKey
ALTER TABLE "HistoryClass" ADD CONSTRAINT "HistoryClass_studentsinClassId_fkey" FOREIGN KEY ("studentsinClassId") REFERENCES "StudentsinClass"("id") ON DELETE SET NULL ON UPDATE CASCADE;
