/*
  Warnings:

  - You are about to drop the `Guild` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Guild";

-- CreateTable
CREATE TABLE "guild" (
    "id" TEXT NOT NULL,
    "uri" TEXT[]
);

-- CreateIndex
CREATE UNIQUE INDEX "guild_id_key" ON "guild"("id");
