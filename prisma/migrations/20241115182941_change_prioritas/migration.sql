/*
  Warnings:

  - The `prioritas` column on the `Galeri` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Galeri" DROP COLUMN "prioritas",
ADD COLUMN     "prioritas" INTEGER NOT NULL DEFAULT 15;
