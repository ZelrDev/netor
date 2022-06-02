/*
  Warnings:

  - You are about to drop the column `embed_generator_enabled` on the `guild` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "guild" DROP COLUMN "embed_generator_enabled",
ADD COLUMN     "um_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "um_leave_msg" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "um_welcome_msg" TEXT NOT NULL DEFAULT E'';
