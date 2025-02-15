/*
  Warnings:

  - You are about to drop the column `finalScore` on the `StudentsGrades` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StudentsGrades" DROP COLUMN "finalScore",
ADD COLUMN     "finalGrade" TEXT;
