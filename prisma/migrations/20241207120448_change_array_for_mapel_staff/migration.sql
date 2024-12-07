/*
  Warnings:

  - The `mapel` column on the `Staff` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "mapel",
ADD COLUMN     "mapel" TEXT[];
