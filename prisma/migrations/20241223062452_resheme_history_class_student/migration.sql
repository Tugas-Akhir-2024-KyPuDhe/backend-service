/*
  Warnings:

  - Added the required column `currentClassId` to the `HistoryClass` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HistoryClass" ADD COLUMN     "currentClassId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "HistoryClass" ADD CONSTRAINT "HistoryClass_currentClassId_fkey" FOREIGN KEY ("currentClassId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
