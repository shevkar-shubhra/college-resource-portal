-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "courseId" TEXT,
    "uploaderId" TEXT NOT NULL,
    "currentVerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceVersion" (
    "id" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "uploaderId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResourceVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Resource_courseId_idx" ON "Resource"("courseId");

-- CreateIndex
CREATE INDEX "Resource_uploaderId_idx" ON "Resource"("uploaderId");

-- CreateIndex
CREATE INDEX "ResourceVersion_resourceId_idx" ON "ResourceVersion"("resourceId");

-- CreateIndex
CREATE INDEX "ResourceVersion_uploaderId_idx" ON "ResourceVersion"("uploaderId");

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceVersion" ADD CONSTRAINT "ResourceVersion_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceVersion" ADD CONSTRAINT "ResourceVersion_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
