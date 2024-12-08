/*
  Warnings:

  - You are about to drop the `SubjectsInClass` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SubjectsInClass" DROP CONSTRAINT "SubjectsInClass_classId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectsInClass" DROP CONSTRAINT "SubjectsInClass_courseCode_fkey";

-- DropForeignKey
ALTER TABLE "SubjectsInClass" DROP CONSTRAINT "SubjectsInClass_teacherId_fkey";

-- DropTable
DROP TABLE "SubjectsInClass";

-- CreateTable
CREATE TABLE "CourseInClass" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "day" TEXT NOT NULL,
    "timeStarte" TEXT NOT NULL,
    "timeEnd" TEXT NOT NULL,

    CONSTRAINT "CourseInClass_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CourseInClass" ADD CONSTRAINT "CourseInClass_courseCode_fkey" FOREIGN KEY ("courseCode") REFERENCES "Course"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseInClass" ADD CONSTRAINT "CourseInClass_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseInClass" ADD CONSTRAINT "CourseInClass_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
