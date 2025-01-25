/*
  Warnings:

  - You are about to drop the `AttendanceStudents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DetailAttendanceStudents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AttendanceStudents" DROP CONSTRAINT "AttendanceStudents_classId_fkey";

-- DropForeignKey
ALTER TABLE "DetailAttendanceStudents" DROP CONSTRAINT "DetailAttendanceStudents_attendanceId_fkey";

-- DropForeignKey
ALTER TABLE "DetailAttendanceStudents" DROP CONSTRAINT "DetailAttendanceStudents_nis_fkey";

-- DropTable
DROP TABLE "AttendanceStudents";

-- DropTable
DROP TABLE "DetailAttendanceStudents";

-- CreateTable
CREATE TABLE "StudentAttendance" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "classId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "status" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentDetailAttendance" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "attendanceId" INTEGER NOT NULL,
    "nis" TEXT NOT NULL,
    "checkInTime" TIMESTAMP(3),
    "checkOutTime" TIMESTAMP(3),
    "status" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentDetailAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentAttendance_uuid_key" ON "StudentAttendance"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "StudentDetailAttendance_uuid_key" ON "StudentDetailAttendance"("uuid");

-- AddForeignKey
ALTER TABLE "StudentAttendance" ADD CONSTRAINT "StudentAttendance_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentDetailAttendance" ADD CONSTRAINT "StudentDetailAttendance_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "StudentAttendance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentDetailAttendance" ADD CONSTRAINT "StudentDetailAttendance_nis_fkey" FOREIGN KEY ("nis") REFERENCES "Student"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;
