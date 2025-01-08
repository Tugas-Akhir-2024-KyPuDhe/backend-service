/*
  Warnings:

  - You are about to drop the `PositionStudentInClass` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PositionStudentInClass" DROP CONSTRAINT "PositionStudentInClass_classId_fkey";

-- DropForeignKey
ALTER TABLE "PositionStudentInClass" DROP CONSTRAINT "PositionStudentInClass_nis_fkey";

-- DropTable
DROP TABLE "PositionStudentInClass";

-- CreateTable
CREATE TABLE "StudentPositionInClass" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "nis" TEXT NOT NULL,
    "classId" INTEGER NOT NULL,
    "positionName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentPositionInClass_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudentPositionInClass" ADD CONSTRAINT "StudentPositionInClass_nis_fkey" FOREIGN KEY ("nis") REFERENCES "Student"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentPositionInClass" ADD CONSTRAINT "StudentPositionInClass_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
