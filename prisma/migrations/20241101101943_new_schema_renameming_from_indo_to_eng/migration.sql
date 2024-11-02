/*
  Warnings:

  - You are about to drop the column `visiMisi` on the `ConfigSchool` table. All the data in the column will be lost.
  - You are about to drop the `Artikel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ekstrakurikuler` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Fasilitas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Jurusan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Kelas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ArtikelMedia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EkstrakurikulerMedia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FasilitasMedia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_JurusanMedia` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Artikel" DROP CONSTRAINT "Artikel_bannerId_fkey";

-- DropForeignKey
ALTER TABLE "Kelas" DROP CONSTRAINT "Kelas_staffId_fkey";

-- DropForeignKey
ALTER TABLE "_ArtikelMedia" DROP CONSTRAINT "_ArtikelMedia_A_fkey";

-- DropForeignKey
ALTER TABLE "_ArtikelMedia" DROP CONSTRAINT "_ArtikelMedia_B_fkey";

-- DropForeignKey
ALTER TABLE "_EkstrakurikulerMedia" DROP CONSTRAINT "_EkstrakurikulerMedia_A_fkey";

-- DropForeignKey
ALTER TABLE "_EkstrakurikulerMedia" DROP CONSTRAINT "_EkstrakurikulerMedia_B_fkey";

-- DropForeignKey
ALTER TABLE "_FasilitasMedia" DROP CONSTRAINT "_FasilitasMedia_A_fkey";

-- DropForeignKey
ALTER TABLE "_FasilitasMedia" DROP CONSTRAINT "_FasilitasMedia_B_fkey";

-- DropForeignKey
ALTER TABLE "_JurusanMedia" DROP CONSTRAINT "_JurusanMedia_A_fkey";

-- DropForeignKey
ALTER TABLE "_JurusanMedia" DROP CONSTRAINT "_JurusanMedia_B_fkey";

-- AlterTable
ALTER TABLE "ConfigSchool" DROP COLUMN "visiMisi",
ADD COLUMN     "visionMision" TEXT;

-- DropTable
DROP TABLE "Artikel";

-- DropTable
DROP TABLE "Ekstrakurikuler";

-- DropTable
DROP TABLE "Fasilitas";

-- DropTable
DROP TABLE "Jurusan";

-- DropTable
DROP TABLE "Kelas";

-- DropTable
DROP TABLE "_ArtikelMedia";

-- DropTable
DROP TABLE "_EkstrakurikulerMedia";

-- DropTable
DROP TABLE "_FasilitasMedia";

-- DropTable
DROP TABLE "_JurusanMedia";

-- CreateTable
CREATE TABLE "Article" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "bannerId" INTEGER,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "jurusan" TEXT NOT NULL,
    "tahunAjaran" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "staffId" INTEGER,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Major" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "prioritas" INTEGER NOT NULL DEFAULT 15,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Major_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Extracurricular" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "prioritas" INTEGER NOT NULL DEFAULT 15,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Extracurricular_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facility" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "prioritas" INTEGER NOT NULL DEFAULT 15,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ArticleMedia" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MajorMedia" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ExtracurricularMedia" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_FacilityMedia" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ArticleMedia_AB_unique" ON "_ArticleMedia"("A", "B");

-- CreateIndex
CREATE INDEX "_ArticleMedia_B_index" ON "_ArticleMedia"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MajorMedia_AB_unique" ON "_MajorMedia"("A", "B");

-- CreateIndex
CREATE INDEX "_MajorMedia_B_index" ON "_MajorMedia"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ExtracurricularMedia_AB_unique" ON "_ExtracurricularMedia"("A", "B");

-- CreateIndex
CREATE INDEX "_ExtracurricularMedia_B_index" ON "_ExtracurricularMedia"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FacilityMedia_AB_unique" ON "_FacilityMedia"("A", "B");

-- CreateIndex
CREATE INDEX "_FacilityMedia_B_index" ON "_FacilityMedia"("B");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleMedia" ADD CONSTRAINT "_ArticleMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleMedia" ADD CONSTRAINT "_ArticleMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MajorMedia" ADD CONSTRAINT "_MajorMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "Major"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MajorMedia" ADD CONSTRAINT "_MajorMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExtracurricularMedia" ADD CONSTRAINT "_ExtracurricularMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "Extracurricular"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExtracurricularMedia" ADD CONSTRAINT "_ExtracurricularMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacilityMedia" ADD CONSTRAINT "_FacilityMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "Facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacilityMedia" ADD CONSTRAINT "_FacilityMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
