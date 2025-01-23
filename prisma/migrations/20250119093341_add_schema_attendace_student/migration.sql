-- CreateTable
CREATE TABLE "AttendanceStudents" (
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

    CONSTRAINT "AttendanceStudents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailAttendanceStudents" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "attendanceId" INTEGER NOT NULL,
    "nis" TEXT NOT NULL,
    "checkInTime" TIMESTAMP(3),
    "checkOutTime" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DetailAttendanceStudents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceStudents_uuid_key" ON "AttendanceStudents"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "DetailAttendanceStudents_uuid_key" ON "DetailAttendanceStudents"("uuid");

-- AddForeignKey
ALTER TABLE "AttendanceStudents" ADD CONSTRAINT "AttendanceStudents_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailAttendanceStudents" ADD CONSTRAINT "DetailAttendanceStudents_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "AttendanceStudents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailAttendanceStudents" ADD CONSTRAINT "DetailAttendanceStudents_nis_fkey" FOREIGN KEY ("nis") REFERENCES "Student"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;
