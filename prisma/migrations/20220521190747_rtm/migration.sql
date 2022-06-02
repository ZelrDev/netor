-- AlterTable
ALTER TABLE "guild" ADD COLUMN     "rtm_channel_id" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "rtm_enabled" BOOLEAN NOT NULL DEFAULT false;
