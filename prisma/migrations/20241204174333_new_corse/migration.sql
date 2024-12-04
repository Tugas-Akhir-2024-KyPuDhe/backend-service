-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "imageId" INTEGER,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Active';

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
