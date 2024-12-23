/*
  Warnings:

  - You are about to drop the column `tahunAjaran` on the `HistoryClass` table. All the data in the column will be lost.
  - Added the required column `academicYear` to the `HistoryClass` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HistoryClass" DROP COLUMN "tahunAjaran",
ADD COLUMN     "academicYear" TEXT NOT NULL;
