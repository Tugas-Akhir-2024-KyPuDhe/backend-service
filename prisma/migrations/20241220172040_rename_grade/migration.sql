/*
  Warnings:

  - You are about to drop the `studentsGrades` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "studentsGrades" DROP CONSTRAINT "studentsGrades_classId_fkey";

-- DropForeignKey
ALTER TABLE "studentsGrades" DROP CONSTRAINT "studentsGrades_courseCode_fkey";

-- DropForeignKey
ALTER TABLE "studentsGrades" DROP CONSTRAINT "studentsGrades_nis_fkey";

-- DropForeignKey
ALTER TABLE "studentsGrades" DROP CONSTRAINT "studentsGrades_teacherId_fkey";

-- DropTable
DROP TABLE "studentsGrades";

-- CreateTable
CREATE TABLE "StudentsGrades" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "nis" TEXT NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "courseCode" TEXT NOT NULL,
    "task" INTEGER NOT NULL,
    "UH" INTEGER NOT NULL,
    "PTS" INTEGER NOT NULL,
    "PAS" INTEGER NOT NULL,
    "portofolio" INTEGER,
    "proyek" INTEGER,
    "attitude" INTEGER,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentsGrades_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudentsGrades" ADD CONSTRAINT "StudentsGrades_nis_fkey" FOREIGN KEY ("nis") REFERENCES "Student"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentsGrades" ADD CONSTRAINT "StudentsGrades_courseCode_fkey" FOREIGN KEY ("courseCode") REFERENCES "Course"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentsGrades" ADD CONSTRAINT "StudentsGrades_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentsGrades" ADD CONSTRAINT "StudentsGrades_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
