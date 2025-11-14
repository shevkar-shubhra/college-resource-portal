-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "downloads" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Download" (
    "id" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "userId" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Download_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Download_resourceId_idx" ON "Download"("resourceId");

-- CreateIndex
CREATE INDEX "Download_userId_idx" ON "Download"("userId");

-- AddForeignKey
ALTER TABLE "Download" ADD CONSTRAINT "Download_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Download" ADD CONSTRAINT "Download_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
