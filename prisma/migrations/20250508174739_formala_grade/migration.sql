-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "formulaId" INTEGER;

-- AlterTable
ALTER TABLE "ProblemReport" ALTER COLUMN "status" SET DEFAULT 'baru',
ALTER COLUMN "status" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "StudyTracer" ADD COLUMN     "statusApprove" TEXT NOT NULL DEFAULT 'Pending';

-- CreateTable
CREATE TABLE "GradeFormula" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GradeFormula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GradeComponent" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "formulaId" INTEGER NOT NULL,
    "parentId" INTEGER,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GradeComponent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GradeFormula_uuid_key" ON "GradeFormula"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "GradeComponent_uuid_key" ON "GradeComponent"("uuid");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_formulaId_fkey" FOREIGN KEY ("formulaId") REFERENCES "GradeFormula"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeComponent" ADD CONSTRAINT "GradeComponent_formulaId_fkey" FOREIGN KEY ("formulaId") REFERENCES "GradeFormula"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeComponent" ADD CONSTRAINT "GradeComponent_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "GradeComponent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
