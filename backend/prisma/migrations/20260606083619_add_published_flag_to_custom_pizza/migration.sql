-- AlterTable
ALTER TABLE "CustomPizza" ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "CustomPizza_isPublished_idx" ON "CustomPizza"("isPublished");
