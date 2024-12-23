-- DropForeignKey
ALTER TABLE "HistoryClass" DROP CONSTRAINT "HistoryClass_oldClassId_fkey";

-- AlterTable
ALTER TABLE "HistoryClass" ALTER COLUMN "oldClassId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "HistoryClass" ADD CONSTRAINT "HistoryClass_oldClassId_fkey" FOREIGN KEY ("oldClassId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;
