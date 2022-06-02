/*
  Warnings:

  - The `id` column on the `embed` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `id` column on the `embed_field` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `embed_id` on the `embed_field` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "embed_field" DROP CONSTRAINT "embed_field_embed_id_fkey";

-- DropIndex
DROP INDEX "embed_field_embed_id_key";

-- AlterTable
ALTER TABLE "embed" DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "embed_field" DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "embed_id",
ADD COLUMN     "embed_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "embed_id_key" ON "embed"("id");

-- CreateIndex
CREATE UNIQUE INDEX "embed_field_id_key" ON "embed_field"("id");

-- AddForeignKey
ALTER TABLE "embed_field" ADD CONSTRAINT "embed_field_embed_id_fkey" FOREIGN KEY ("embed_id") REFERENCES "embed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
