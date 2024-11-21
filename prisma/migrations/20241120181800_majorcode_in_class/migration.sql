/*
  Warnings:

  - You are about to drop the column `majorId` on the `Class` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_majorId_fkey";

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "majorId",
ADD COLUMN     "majorCode" TEXT;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_majorCode_fkey" FOREIGN KEY ("majorCode") REFERENCES "Major"("majorCode") ON DELETE SET NULL ON UPDATE CASCADE;
