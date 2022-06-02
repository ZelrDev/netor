-- AlterTable
ALTER TABLE "guild" ADD COLUMN     "um_leave_channel_id" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "um_welcome_channel_id" TEXT NOT NULL DEFAULT E'';
