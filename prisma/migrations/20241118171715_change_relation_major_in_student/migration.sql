/*
  Warnings:

  - You are about to drop the column `major` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `majorId` on the `Student` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_majorId_fkey";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "major",
DROP COLUMN "majorId",
ADD COLUMN     "majorCode" TEXT;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_majorCode_fkey" FOREIGN KEY ("majorCode") REFERENCES "Major"("majorCode") ON DELETE SET NULL ON UPDATE CASCADE;
