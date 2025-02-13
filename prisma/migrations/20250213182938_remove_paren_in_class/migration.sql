/*
  Warnings:

  - You are about to drop the `_ParentsOfStudentinClass` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ParentsOfStudentinClass" DROP CONSTRAINT "_ParentsOfStudentinClass_A_fkey";

-- DropForeignKey
ALTER TABLE "_ParentsOfStudentinClass" DROP CONSTRAINT "_ParentsOfStudentinClass_B_fkey";

-- DropTable
DROP TABLE "_ParentsOfStudentinClass";
