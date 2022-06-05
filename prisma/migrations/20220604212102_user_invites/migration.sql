-- CreateTable
CREATE TABLE "user_invite" (
    "id" TEXT NOT NULL,
    "guild_id" TEXT NOT NULL,
    "inviter_id" TEXT NOT NULL,
    "joined_id" TEXT NOT NULL,
    "invite_id" TEXT NOT NULL,
    "valid" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_invite_id_key" ON "user_invite"("id");

-- AddForeignKey
ALTER TABLE "user_invite" ADD CONSTRAINT "user_invite_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "punishment" ADD CONSTRAINT "punishment_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
