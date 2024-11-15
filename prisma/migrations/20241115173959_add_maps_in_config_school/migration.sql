/*
  Warnings:

  - You are about to drop the column `mision` on the `ConfigSchool` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ConfigSchool" DROP COLUMN "mision",
ADD COLUMN     "maps" TEXT,
ADD COLUMN     "mission" TEXT;
