/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PunishmentType" AS ENUM ('BAN', 'KICK', 'TIMEOUT');

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_guild_id_fkey";

-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "punishment" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "guild_id" TEXT NOT NULL,
    "type" "PunishmentType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "punisher_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "punishment_id_key" ON "punishment"("id");
