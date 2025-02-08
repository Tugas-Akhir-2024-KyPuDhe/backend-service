-- AlterTable
ALTER TABLE "HistoryClass" ADD COLUMN     "studentinClassId" INTEGER;

-- AlterTable
ALTER TABLE "ParentOfStudent" ADD COLUMN     "studentinClassId" INTEGER;

-- AlterTable
ALTER TABLE "StudentDetailAttendance" ADD COLUMN     "studentinClassId" INTEGER;

-- AlterTable
ALTER TABLE "StudentPositionInClass" ADD COLUMN     "studentinClassId" INTEGER;

-- AlterTable
ALTER TABLE "StudentsGrades" ADD COLUMN     "studentinClassId" INTEGER;

-- CreateTable
CREATE TABLE "StudentsinClass" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "classId" INTEGER,
    "status" TEXT DEFAULT 'Active',
    "birthPlace" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "gender" TEXT,
    "majorCode" TEXT,
    "nis" TEXT NOT NULL,
    "nisn" TEXT NOT NULL,
    "startYear" TIMESTAMP(3) NOT NULL,
    "endYear" TIMESTAMP(3),
    "mediaId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentsinClass_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudentsinClass" ADD CONSTRAINT "StudentsinClass_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentsinClass" ADD CONSTRAINT "StudentsinClass_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentsinClass" ADD CONSTRAINT "StudentsinClass_majorCode_fkey" FOREIGN KEY ("majorCode") REFERENCES "Major"("majorCode") ON DELETE SET NULL ON UPDATE CASCADE;
