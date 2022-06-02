-- CreateTable
CREATE TABLE "embed" (
    "id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "guild_id" TEXT NOT NULL,
    "title" TEXT,
    "url" TEXT,
    "description" TEXT,
    "color" INTEGER,
    "footer_text" TEXT,
    "footer_icon_url" TEXT,
    "image_url" TEXT,
    "thumbnail_url" TEXT,
    "author_name" TEXT,
    "author_url" TEXT,
    "author_icon_url" TEXT
);

-- CreateTable
CREATE TABLE "embed_field" (
    "id" TEXT NOT NULL,
    "embed_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "inline" BOOLEAN
);

-- CreateIndex
CREATE UNIQUE INDEX "embed_id_key" ON "embed"("id");

-- CreateIndex
CREATE UNIQUE INDEX "embed_field_id_key" ON "embed_field"("id");

-- CreateIndex
CREATE UNIQUE INDEX "embed_field_embed_id_key" ON "embed_field"("embed_id");

-- AddForeignKey
ALTER TABLE "embed" ADD CONSTRAINT "embed_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "embed_field" ADD CONSTRAINT "embed_field_embed_id_fkey" FOREIGN KEY ("embed_id") REFERENCES "embed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
