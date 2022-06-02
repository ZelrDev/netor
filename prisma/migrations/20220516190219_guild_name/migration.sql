-- CreateTable
CREATE TABLE "Guild" (
    "id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Uri" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "guildName" TEXT NOT NULL,
    "avatarURL" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "discrim" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Guild_id_key" ON "Guild"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Uri_id_key" ON "Uri"("id");

-- AddForeignKey
ALTER TABLE "Uri" ADD CONSTRAINT "Uri_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
