/*
  Warnings:

  - The `portofolio` column on the `StudentsGrades` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `proyek` column on the `StudentsGrades` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `attitude` column on the `StudentsGrades` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `finalGrade` column on the `StudentsGrades` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `task` on the `StudentsGrades` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `UH` on the `StudentsGrades` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `PTS` on the `StudentsGrades` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `PAS` on the `StudentsGrades` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "StudentsGrades" DROP COLUMN "task",
ADD COLUMN     "task" INTEGER NOT NULL,
DROP COLUMN "UH",
ADD COLUMN     "UH" INTEGER NOT NULL,
DROP COLUMN "PTS",
ADD COLUMN     "PTS" INTEGER NOT NULL,
DROP COLUMN "PAS",
ADD COLUMN     "PAS" INTEGER NOT NULL,
DROP COLUMN "portofolio",
ADD COLUMN     "portofolio" INTEGER,
DROP COLUMN "proyek",
ADD COLUMN     "proyek" INTEGER,
DROP COLUMN "attitude",
ADD COLUMN     "attitude" INTEGER,
DROP COLUMN "finalGrade",
ADD COLUMN     "finalGrade" INTEGER;
