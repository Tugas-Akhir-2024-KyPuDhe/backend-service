/*
  Warnings:

  - You are about to drop the column `date` on the `Article` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "date",
ADD COLUMN     "category" TEXT;
