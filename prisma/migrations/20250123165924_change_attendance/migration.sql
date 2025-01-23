/*
  Warnings:

  - The `status` column on the `DetailAttendanceStudents` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "DetailAttendanceStudents" DROP COLUMN "status",
ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 1;
