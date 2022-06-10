-- AlterTable
ALTER TABLE "guild" ADD COLUMN     "rr_enabled" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "reaction" (
    "id" TEXT NOT NULL,
    "template_id" TEXT NOT NULL,
    "reaction" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "button" (
    "id" TEXT NOT NULL,
    "template_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "reaction_role_template" (
    "id" TEXT NOT NULL,
    "guild_id" TEXT NOT NULL,
    "content" TEXT,
    "embed_id" INTEGER
);

-- CreateTable
CREATE TABLE "reaction_role_msg" (
    "guild_id" TEXT NOT NULL,
    "msg_id" TEXT NOT NULL,
    "template_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "reaction_id_key" ON "reaction"("id");

-- CreateIndex
CREATE UNIQUE INDEX "button_id_key" ON "button"("id");

-- CreateIndex
CREATE UNIQUE INDEX "reaction_role_template_id_key" ON "reaction_role_template"("id");

-- CreateIndex
CREATE UNIQUE INDEX "reaction_role_msg_msg_id_key" ON "reaction_role_msg"("msg_id");

-- AddForeignKey
ALTER TABLE "reaction" ADD CONSTRAINT "reaction_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "reaction_role_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "button" ADD CONSTRAINT "button_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "reaction_role_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reaction_role_template" ADD CONSTRAINT "reaction_role_template_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reaction_role_template" ADD CONSTRAINT "reaction_role_template_embed_id_fkey" FOREIGN KEY ("embed_id") REFERENCES "embed"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reaction_role_msg" ADD CONSTRAINT "reaction_role_msg_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reaction_role_msg" ADD CONSTRAINT "reaction_role_msg_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "reaction_role_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;
