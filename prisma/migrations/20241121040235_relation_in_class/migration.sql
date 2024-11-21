/*
  Warnings:

  - You are about to drop the column `majorCode` on the `Class` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_majorCode_fkey";

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "majorCode",
ADD COLUMN     "majorId" INTEGER;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "Major"("id") ON DELETE SET NULL ON UPDATE CASCADE;
