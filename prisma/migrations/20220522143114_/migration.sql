-- CreateTable
CREATE TABLE "user" (
    "user_id" TEXT NOT NULL,
    "guild_id" TEXT NOT NULL,
    "timeouts" INTEGER NOT NULL,
    "bans" INTEGER NOT NULL,
    "kicks" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_user_id_guild_id_key" ON "user"("user_id", "guild_id");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
