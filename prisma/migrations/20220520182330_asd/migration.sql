/*
  Warnings:

  - You are about to drop the `Uri` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Uri" DROP CONSTRAINT "Uri_guildId_fkey";

-- AlterTable
ALTER TABLE "Guild" ADD COLUMN     "uri" TEXT[];

-- DropTable
DROP TABLE "Uri";
