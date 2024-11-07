-- CreateTable
CREATE TABLE "BannerPage" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "title_link" TEXT,
    "link" TEXT,
    "prioritas" INTEGER NOT NULL DEFAULT 15,
    "bannerId" INTEGER,
    "createdBy" TEXT,
    "updateBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BannerPage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BannerPage" ADD CONSTRAINT "BannerPage_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
