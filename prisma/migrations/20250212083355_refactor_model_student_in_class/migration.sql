/*
  Warnings:

  - You are about to drop the column `studentinClassId` on the `HistoryClass` table. All the data in the column will be lost.
  - You are about to drop the column `studentinClassId` on the `ParentOfStudent` table. All the data in the column will be lost.
  - You are about to drop the column `studentinClassId` on the `StudentDetailAttendance` table. All the data in the column will be lost.
  - You are about to drop the column `studentinClassId` on the `StudentPositionInClass` table. All the data in the column will be lost.
  - You are about to drop the column `studentinClassId` on the `StudentsGrades` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HistoryClass" DROP COLUMN "studentinClassId",
ADD COLUMN     "studentsinClassId" INTEGER;

-- AlterTable
ALTER TABLE "ParentOfStudent" DROP COLUMN "studentinClassId";

-- AlterTable
ALTER TABLE "StudentDetailAttendance" DROP COLUMN "studentinClassId",
ADD COLUMN     "studentsinClassId" INTEGER;

-- AlterTable
ALTER TABLE "StudentPositionInClass" DROP COLUMN "studentinClassId",
ADD COLUMN     "studentsinClassId" INTEGER;

-- AlterTable
ALTER TABLE "StudentsGrades" DROP COLUMN "studentinClassId",
ADD COLUMN     "studentsinClassId" INTEGER;

-- CreateTable
CREATE TABLE "_ParentsOfStudentinClass" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ParentsOfStudentinClass_AB_unique" ON "_ParentsOfStudentinClass"("A", "B");

-- CreateIndex
CREATE INDEX "_ParentsOfStudentinClass_B_index" ON "_ParentsOfStudentinClass"("B");

-- AddForeignKey
ALTER TABLE "HistoryClass" ADD CONSTRAINT "HistoryClass_studentsinClassId_fkey" FOREIGN KEY ("studentsinClassId") REFERENCES "StudentsinClass"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentsGrades" ADD CONSTRAINT "StudentsGrades_studentsinClassId_fkey" FOREIGN KEY ("studentsinClassId") REFERENCES "StudentsinClass"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentPositionInClass" ADD CONSTRAINT "StudentPositionInClass_studentsinClassId_fkey" FOREIGN KEY ("studentsinClassId") REFERENCES "StudentsinClass"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentDetailAttendance" ADD CONSTRAINT "StudentDetailAttendance_studentsinClassId_fkey" FOREIGN KEY ("studentsinClassId") REFERENCES "StudentsinClass"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParentsOfStudentinClass" ADD CONSTRAINT "_ParentsOfStudentinClass_A_fkey" FOREIGN KEY ("A") REFERENCES "ParentOfStudent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParentsOfStudentinClass" ADD CONSTRAINT "_ParentsOfStudentinClass_B_fkey" FOREIGN KEY ("B") REFERENCES "StudentsinClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;
