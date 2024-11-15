/*
  Warnings:

  - You are about to drop the column `galeriId` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `galeriId` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Media" DROP COLUMN "galeriId";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "galeriId";
