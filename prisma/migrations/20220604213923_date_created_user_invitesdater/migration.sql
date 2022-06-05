/*
  Warnings:

  - Added the required column `date_created` to the `user_invite` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "punishment" DROP CONSTRAINT "punishment_guild_id_fkey";

-- DropForeignKey
ALTER TABLE "user_invite" DROP CONSTRAINT "user_invite_guild_id_fkey";

-- AlterTable
ALTER TABLE "user_invite" ADD COLUMN     "date_created" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "user_invite" ADD CONSTRAINT "user_invite_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "punishment" ADD CONSTRAINT "punishment_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;
