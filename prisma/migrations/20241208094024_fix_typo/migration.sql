/*
  Warnings:

  - You are about to drop the column `timeStarte` on the `CourseInClass` table. All the data in the column will be lost.
  - Added the required column `timeStart` to the `CourseInClass` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CourseInClass" DROP COLUMN "timeStarte",
ADD COLUMN     "timeStart" TEXT NOT NULL;
