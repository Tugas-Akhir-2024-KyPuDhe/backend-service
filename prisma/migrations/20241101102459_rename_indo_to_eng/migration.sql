/*
  Warnings:

  - You are about to drop the column `jurusan` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `tahunAjaran` on the `Class` table. All the data in the column will be lost.
  - Added the required column `major` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schoolYear` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Class" DROP COLUMN "jurusan",
DROP COLUMN "tahunAjaran",
ADD COLUMN     "major" TEXT NOT NULL,
ADD COLUMN     "schoolYear" TEXT NOT NULL;
