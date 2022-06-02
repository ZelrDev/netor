-- AlterTable
ALTER TABLE "guild" ADD COLUMN     "um_leave_raw_msg" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "um_welcome_raw_msg" TEXT NOT NULL DEFAULT E'';
