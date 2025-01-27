-- CreateTable
CREATE TABLE "StudyTracer" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ttl" TEXT,
    "gender" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "addressNow" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "startYear" TEXT NOT NULL,
    "endYear" TEXT NOT NULL,
    "employmentStatus" TEXT NOT NULL,
    "institutionName" TEXT,
    "institutionAddress" TEXT,
    "academicExperienceSatisfaction" TEXT,
    "isSatisfactionMet" TEXT,
    "disSatisfactionFactors" TEXT,
    "studyIssues" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyTracer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudyTracer_uuid_key" ON "StudyTracer"("uuid");
