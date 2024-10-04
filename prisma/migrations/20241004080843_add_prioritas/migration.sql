-- AlterTable
ALTER TABLE "Ekstrakurikuler" ADD COLUMN     "prioritas" INTEGER NOT NULL DEFAULT 15;

-- AlterTable
ALTER TABLE "Fasilitas" ADD COLUMN     "prioritas" INTEGER NOT NULL DEFAULT 15;

-- AlterTable
ALTER TABLE "Jurusan" ADD COLUMN     "prioritas" INTEGER NOT NULL DEFAULT 15;

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "position" TEXT;
