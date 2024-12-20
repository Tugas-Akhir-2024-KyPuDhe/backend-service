-- CreateTable
CREATE TABLE "studentsGrades" (
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

    CONSTRAINT "studentsGrades_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "studentsGrades" ADD CONSTRAINT "studentsGrades_nis_fkey" FOREIGN KEY ("nis") REFERENCES "Student"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentsGrades" ADD CONSTRAINT "studentsGrades_courseCode_fkey" FOREIGN KEY ("courseCode") REFERENCES "Course"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentsGrades" ADD CONSTRAINT "studentsGrades_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentsGrades" ADD CONSTRAINT "studentsGrades_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
