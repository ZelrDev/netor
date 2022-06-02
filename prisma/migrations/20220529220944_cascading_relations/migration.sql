-- DropForeignKey
ALTER TABLE "embed" DROP CONSTRAINT "embed_guild_id_fkey";

-- DropForeignKey
ALTER TABLE "embed_field" DROP CONSTRAINT "embed_field_embed_id_fkey";

-- DropForeignKey
ALTER TABLE "session_uri" DROP CONSTRAINT "session_uri_guild_id_fkey";

-- DropForeignKey
ALTER TABLE "uri" DROP CONSTRAINT "uri_guild_id_fkey";

-- AddForeignKey
ALTER TABLE "session_uri" ADD CONSTRAINT "session_uri_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uri" ADD CONSTRAINT "uri_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "embed" ADD CONSTRAINT "embed_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "embed_field" ADD CONSTRAINT "embed_field_embed_id_fkey" FOREIGN KEY ("embed_id") REFERENCES "embed"("id") ON DELETE CASCADE ON UPDATE CASCADE;
