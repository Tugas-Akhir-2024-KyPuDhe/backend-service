/*
  Warnings:

  - You are about to drop the column `statusNaik` on the `HistoryClass` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HistoryClass" DROP COLUMN "statusNaik",
ADD COLUMN     "status" TEXT DEFAULT 'Aktif';
