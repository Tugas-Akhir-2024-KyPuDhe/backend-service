/*
  Warnings:

  - Added the required column `description` to the `Galeri` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prioritas` to the `Galeri` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Galeri` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Galeri" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "prioritas" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;
