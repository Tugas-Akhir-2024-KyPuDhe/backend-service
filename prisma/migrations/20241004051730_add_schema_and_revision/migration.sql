-- CreateTable
CREATE TABLE "ConfigSchool" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "visiMisi" TEXT NOT NULL,
    "address" TEXT,
    "mediaId" INTEGER,
    "telp" TEXT,
    "email" TEXT NOT NULL,
    "npsn" TEXT NOT NULL,
    "fb" TEXT,
    "ig" TEXT,
    "tiktok" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConfigSchool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artikel" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artikel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kelas" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "jurusan" TEXT NOT NULL,
    "tahunAjaran" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "staffId" INTEGER,

    CONSTRAINT "Kelas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jurusan" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jurusan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ekstrakurikuler" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ekstrakurikuler_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fasilitas" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fasilitas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ArtikelMedia" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_JurusanMedia" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_EkstrakurikulerMedia" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_FasilitasMedia" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ArtikelMedia_AB_unique" ON "_ArtikelMedia"("A", "B");

-- CreateIndex
CREATE INDEX "_ArtikelMedia_B_index" ON "_ArtikelMedia"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_JurusanMedia_AB_unique" ON "_JurusanMedia"("A", "B");

-- CreateIndex
CREATE INDEX "_JurusanMedia_B_index" ON "_JurusanMedia"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EkstrakurikulerMedia_AB_unique" ON "_EkstrakurikulerMedia"("A", "B");

-- CreateIndex
CREATE INDEX "_EkstrakurikulerMedia_B_index" ON "_EkstrakurikulerMedia"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FasilitasMedia_AB_unique" ON "_FasilitasMedia"("A", "B");

-- CreateIndex
CREATE INDEX "_FasilitasMedia_B_index" ON "_FasilitasMedia"("B");

-- AddForeignKey
ALTER TABLE "ConfigSchool" ADD CONSTRAINT "ConfigSchool_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kelas" ADD CONSTRAINT "Kelas_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtikelMedia" ADD CONSTRAINT "_ArtikelMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "Artikel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtikelMedia" ADD CONSTRAINT "_ArtikelMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JurusanMedia" ADD CONSTRAINT "_JurusanMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "Jurusan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JurusanMedia" ADD CONSTRAINT "_JurusanMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EkstrakurikulerMedia" ADD CONSTRAINT "_EkstrakurikulerMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "Ekstrakurikuler"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EkstrakurikulerMedia" ADD CONSTRAINT "_EkstrakurikulerMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FasilitasMedia" ADD CONSTRAINT "_FasilitasMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "Fasilitas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FasilitasMedia" ADD CONSTRAINT "_FasilitasMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
