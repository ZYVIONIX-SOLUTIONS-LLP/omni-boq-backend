-- CreateTable
CREATE TABLE "activity_requirement_options" (
    "id" TEXT NOT NULL,
    "requirement_id" TEXT NOT NULL,
    "variant_id" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "activity_requirement_options_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "activity_requirement_options_requirement_id_idx" ON "activity_requirement_options"("requirement_id");

-- CreateIndex
CREATE INDEX "activity_requirement_options_variant_id_idx" ON "activity_requirement_options"("variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "activity_requirement_options_requirement_id_variant_id_key" ON "activity_requirement_options"("requirement_id", "variant_id");

-- AddForeignKey
ALTER TABLE "activity_requirement_options" ADD CONSTRAINT "activity_requirement_options_requirement_id_fkey" FOREIGN KEY ("requirement_id") REFERENCES "activity_requirements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_requirement_options" ADD CONSTRAINT "activity_requirement_options_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
