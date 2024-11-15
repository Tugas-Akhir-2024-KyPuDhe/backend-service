-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "parentOfStudentId" INTEGER;

-- CreateTable
CREATE TABLE "ParentOfStudent" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "fatherName" TEXT NOT NULL,
    "motherName" TEXT NOT NULL,
    "parentJob" TEXT,
    "parentAddress" TEXT,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParentOfStudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ParentsOfStudent" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ParentsOfStudent_AB_unique" ON "_ParentsOfStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_ParentsOfStudent_B_index" ON "_ParentsOfStudent"("B");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_parentOfStudentId_fkey" FOREIGN KEY ("parentOfStudentId") REFERENCES "ParentOfStudent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParentsOfStudent" ADD CONSTRAINT "_ParentsOfStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "ParentOfStudent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParentsOfStudent" ADD CONSTRAINT "_ParentsOfStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
