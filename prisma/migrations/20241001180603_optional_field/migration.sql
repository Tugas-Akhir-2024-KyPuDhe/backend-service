-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_mediaId_fkey";

-- AlterTable
ALTER TABLE "Staff" ALTER COLUMN "mediaId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "mediaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
