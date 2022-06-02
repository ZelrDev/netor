/*
  Warnings:

  - You are about to drop the column `session_uri` on the `guild` table. All the data in the column will be lost.
  - You are about to drop the column `uri` on the `guild` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "guild" DROP COLUMN "session_uri",
DROP COLUMN "uri";

-- CreateTable
CREATE TABLE "session_uri" (
    "token" TEXT NOT NULL,
    "guild_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "uri" (
    "token" TEXT NOT NULL,
    "guild_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "session_uri_token_key" ON "session_uri"("token");

-- CreateIndex
CREATE UNIQUE INDEX "uri_token_key" ON "uri"("token");

-- AddForeignKey
ALTER TABLE "session_uri" ADD CONSTRAINT "session_uri_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uri" ADD CONSTRAINT "uri_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
