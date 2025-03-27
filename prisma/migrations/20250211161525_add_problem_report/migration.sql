-- CreateTable
CREATE TABLE "ProblemReport" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "idName" TEXT NOT NULL,
    "pageProblem" TEXT NOT NULL,
    "problemDescription" TEXT NOT NULL,
    "mediaId" INTEGER,
    "telp" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProblemReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProblemReport_uuid_key" ON "ProblemReport"("uuid");

-- AddForeignKey
ALTER TABLE "ProblemReport" ADD CONSTRAINT "ProblemReport_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
