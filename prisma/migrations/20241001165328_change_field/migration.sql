/*
  Warnings:

  - You are about to drop the column `employeeId` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `nationalId` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Student` table. All the data in the column will be lost.
  - Added the required column `nis` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nisn` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "employeeId",
ADD COLUMN     "nip" TEXT;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "nationalId",
DROP COLUMN "studentId",
ADD COLUMN     "nis" TEXT NOT NULL,
ADD COLUMN     "nisn" TEXT NOT NULL;
