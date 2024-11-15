-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_parentOfStudentId_fkey";

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "galeriId" INTEGER;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "galeriId" INTEGER;

-- CreateTable
CREATE TABLE "Galeri" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Galeri_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GaleriMedia" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GaleriMedia_AB_unique" ON "_GaleriMedia"("A", "B");

-- CreateIndex
CREATE INDEX "_GaleriMedia_B_index" ON "_GaleriMedia"("B");

-- AddForeignKey
ALTER TABLE "_GaleriMedia" ADD CONSTRAINT "_GaleriMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "Galeri"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GaleriMedia" ADD CONSTRAINT "_GaleriMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
