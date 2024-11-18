/*
  Warnings:

  - You are about to drop the column `kapasitas` on the `Class` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[majorCode]` on the table `Major` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Class" DROP COLUMN "kapasitas",
ADD COLUMN     "capacity" INTEGER DEFAULT 30;

-- AlterTable
ALTER TABLE "Major" ADD COLUMN     "majorCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Major_majorCode_key" ON "Major"("majorCode");
