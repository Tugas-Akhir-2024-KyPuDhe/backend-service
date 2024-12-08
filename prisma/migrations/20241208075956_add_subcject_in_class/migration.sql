/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Course` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "SubjectsInClass" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "day" TEXT NOT NULL,
    "timeStarte" TEXT NOT NULL,
    "timeEnd" TEXT NOT NULL,

    CONSTRAINT "SubjectsInClass_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Course_code_key" ON "Course"("code");

-- AddForeignKey
ALTER TABLE "SubjectsInClass" ADD CONSTRAINT "SubjectsInClass_courseCode_fkey" FOREIGN KEY ("courseCode") REFERENCES "Course"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectsInClass" ADD CONSTRAINT "SubjectsInClass_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectsInClass" ADD CONSTRAINT "SubjectsInClass_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
