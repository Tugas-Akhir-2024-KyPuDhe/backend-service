/*
  Warnings:

  - You are about to drop the column `description` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `major` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `schoolYear` on the `Class` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Class" DROP COLUMN "description",
DROP COLUMN "major",
DROP COLUMN "schoolYear",
ADD COLUMN     "kapasitas" INTEGER DEFAULT 30,
ADD COLUMN     "majorId" INTEGER;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "classId" INTEGER,
ADD COLUMN     "major" TEXT,
ADD COLUMN     "majorId" INTEGER,
ADD COLUMN     "status" TEXT DEFAULT 'Active',
ADD COLUMN     "waliKelasId" INTEGER;

-- CreateTable
CREATE TABLE "HistoryClass" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "oldClassId" INTEGER NOT NULL,
    "tahunAjaran" TEXT NOT NULL,
    "statusNaik" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HistoryClass_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_waliKelasId_fkey" FOREIGN KEY ("waliKelasId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "Major"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoryClass" ADD CONSTRAINT "HistoryClass_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoryClass" ADD CONSTRAINT "HistoryClass_oldClassId_fkey" FOREIGN KEY ("oldClassId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "Major"("id") ON DELETE SET NULL ON UPDATE CASCADE;
