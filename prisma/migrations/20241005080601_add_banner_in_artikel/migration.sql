-- AlterTable
ALTER TABLE "Artikel" ADD COLUMN     "bannerId" INTEGER;

-- AddForeignKey
ALTER TABLE "Artikel" ADD CONSTRAINT "Artikel_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
