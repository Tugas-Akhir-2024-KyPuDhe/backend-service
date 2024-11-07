/*
  Warnings:

  - You are about to drop the column `visionMision` on the `ConfigSchool` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BannerPage" ADD COLUMN     "status" TEXT;

-- AlterTable
ALTER TABLE "ConfigSchool" DROP COLUMN "visionMision",
ADD COLUMN     "mision" TEXT,
ADD COLUMN     "vision" TEXT;
