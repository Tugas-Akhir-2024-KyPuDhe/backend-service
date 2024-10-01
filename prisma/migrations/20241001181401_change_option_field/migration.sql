/*
  Warnings:

  - You are about to drop the column `file` on the `Media` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Media" DROP COLUMN "file";

-- AlterTable
ALTER TABLE "Permission" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Staff" ALTER COLUMN "birthPlace" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "birthPlace" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;
