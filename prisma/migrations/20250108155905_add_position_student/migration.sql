-- CreateTable
CREATE TABLE "PositionStudentInClass" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "nis" TEXT NOT NULL,
    "classId" INTEGER NOT NULL,
    "positionName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PositionStudentInClass_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PositionStudentInClass" ADD CONSTRAINT "PositionStudentInClass_nis_fkey" FOREIGN KEY ("nis") REFERENCES "Student"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PositionStudentInClass" ADD CONSTRAINT "PositionStudentInClass_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
