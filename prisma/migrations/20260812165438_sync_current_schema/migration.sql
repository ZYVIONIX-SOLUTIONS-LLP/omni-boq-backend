/*
  Warnings:

  - You are about to drop the column `created_at` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `labour_cost` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `material_cost` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `sheet_data` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `wiring_type` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `activity_id` on the `activity_requirements` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `activity_requirements` table. All the data in the column will be lost.
  - You are about to drop the column `sort_order` on the `activity_requirements` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `attribute_defs` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `attribute_defs` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `attribute_defs` table. All the data in the column will be lost.
  - You are about to drop the column `name_normalized` on the `attribute_defs` table. All the data in the column will be lost.
  - You are about to drop the column `sort_order` on the `attribute_defs` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `attribute_defs` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `catalog_categories` table. All the data in the column will be lost.
  - You are about to drop the column `default_gst_rate` on the `catalog_categories` table. All the data in the column will be lost.
  - You are about to drop the column `hsn_code` on the `catalog_categories` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `catalog_categories` table. All the data in the column will be lost.
  - You are about to drop the column `name_normalized` on the `catalog_categories` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `catalog_categories` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `manufacturers` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `manufacturers` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `manufacturers` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `manufacturers` table. All the data in the column will be lost.
  - You are about to drop the column `name_normalized` on the `manufacturers` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `manufacturers` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `manufacturers` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `division_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `gst_rate` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `hsn_code` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `manufacturer_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `name_normalized` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `series_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `sub_category_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `unit_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `quotation_id` on the `quotation_customers` table. All the data in the column will be lost.
  - You are about to drop the column `discount_pct` on the `quotation_items` table. All the data in the column will be lost.
  - You are about to drop the column `profit_pct` on the `quotation_items` table. All the data in the column will be lost.
  - You are about to drop the column `quotation_id` on the `quotation_items` table. All the data in the column will be lost.
  - You are about to drop the column `sort_order` on the `quotation_items` table. All the data in the column will be lost.
  - You are about to drop the column `tax_rate` on the `quotation_items` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `quotation_projects` table. All the data in the column will be lost.
  - You are about to drop the column `quotation_id` on the `quotation_projects` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `quotation_projects` table. All the data in the column will be lost.
  - You are about to drop the column `activity_customizations` on the `quotations` table. All the data in the column will be lost.
  - You are about to drop the column `activity_rows` on the `quotations` table. All the data in the column will be lost.
  - You are about to drop the column `brand_preferences` on the `quotations` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `quotations` table. All the data in the column will be lost.
  - You are about to drop the column `grand_total` on the `quotations` table. All the data in the column will be lost.
  - You are about to drop the column `sheet_data` on the `quotations` table. All the data in the column will be lost.
  - You are about to drop the column `sub_total` on the `quotations` table. All the data in the column will be lost.
  - You are about to drop the column `tax_total` on the `quotations` table. All the data in the column will be lost.
  - You are about to drop the column `terms_and_conditions` on the `quotations` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `quotations` table. All the data in the column will be lost.
  - You are about to drop the column `valid_till` on the `quotations` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `refresh_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `refresh_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `revoked_at` on the `refresh_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `token_hash` on the `refresh_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `refresh_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `sub_categories` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `sub_categories` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `sub_categories` table. All the data in the column will be lost.
  - You are about to drop the column `name_normalized` on the `sub_categories` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `sub_categories` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `password_hash` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `activity_requirement_options` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `divisions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hsn_codes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_series` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tax_rates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `unit_defs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `variants` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[categoryId,nameNormalized]` on the table `attribute_defs` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nameNormalized]` on the table `catalog_categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nameNormalized]` on the table `manufacturers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[quotationId]` on the table `quotation_customers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[quotationId]` on the table `quotation_projects` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tokenHash]` on the table `refresh_tokens` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[categoryId,nameNormalized]` on the table `sub_categories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `activities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wiringType` to the `activities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `activityId` to the `activity_requirements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `activity_requirements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `attribute_defs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameNormalized` to the `attribute_defs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `attribute_defs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameNormalized` to the `catalog_categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `catalog_categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameNormalized` to the `manufacturers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `manufacturers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quotationId` to the `quotation_customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quotationId` to the `quotation_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quotationId` to the `quotation_projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `quotations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tokenHash` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `sub_categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameNormalized` to the `sub_categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `sub_categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'APPROVED');

-- CreateEnum
CREATE TYPE "VoltageClass" AS ENUM ('LV', 'MV', 'HV', 'EHV');

-- DropForeignKey
ALTER TABLE "activity_requirement_options" DROP CONSTRAINT "activity_requirement_options_requirement_id_fkey";

-- DropForeignKey
ALTER TABLE "activity_requirement_options" DROP CONSTRAINT "activity_requirement_options_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "activity_requirements" DROP CONSTRAINT "activity_requirements_activity_id_fkey";

-- DropForeignKey
ALTER TABLE "activity_requirements" DROP CONSTRAINT "activity_requirements_category_id_fkey";

-- DropForeignKey
ALTER TABLE "attribute_defs" DROP CONSTRAINT "attribute_defs_category_id_fkey";

-- DropForeignKey
ALTER TABLE "divisions" DROP CONSTRAINT "divisions_manufacturer_id_fkey";

-- DropForeignKey
ALTER TABLE "product_series" DROP CONSTRAINT "product_series_division_id_fkey";

-- DropForeignKey
ALTER TABLE "product_series" DROP CONSTRAINT "product_series_manufacturer_id_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_category_id_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_division_id_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_manufacturer_id_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_series_id_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_sub_category_id_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_unit_id_fkey";

-- DropForeignKey
ALTER TABLE "quotation_customers" DROP CONSTRAINT "quotation_customers_quotation_id_fkey";

-- DropForeignKey
ALTER TABLE "quotation_items" DROP CONSTRAINT "quotation_items_quotation_id_fkey";

-- DropForeignKey
ALTER TABLE "quotation_projects" DROP CONSTRAINT "quotation_projects_quotation_id_fkey";

-- DropForeignKey
ALTER TABLE "refresh_tokens" DROP CONSTRAINT "refresh_tokens_user_id_fkey";

-- DropForeignKey
ALTER TABLE "sub_categories" DROP CONSTRAINT "sub_categories_category_id_fkey";

-- DropForeignKey
ALTER TABLE "variants" DROP CONSTRAINT "variants_product_id_fkey";

-- DropIndex
DROP INDEX "activities_wiring_type_idx";

-- DropIndex
DROP INDEX "activity_requirements_activity_id_idx";

-- DropIndex
DROP INDEX "activity_requirements_category_id_idx";

-- DropIndex
DROP INDEX "attribute_defs_category_id_name_normalized_key";

-- DropIndex
DROP INDEX "catalog_categories_name_normalized_key";

-- DropIndex
DROP INDEX "manufacturers_name_normalized_key";

-- DropIndex
DROP INDEX "products_category_id_idx";

-- DropIndex
DROP INDEX "products_created_at_idx";

-- DropIndex
DROP INDEX "products_manufacturer_id_series_id_name_normalized_idx";

-- DropIndex
DROP INDEX "quotation_customers_quotation_id_key";

-- DropIndex
DROP INDEX "quotation_items_quotation_id_idx";

-- DropIndex
DROP INDEX "quotation_projects_quotation_id_key";

-- DropIndex
DROP INDEX "refresh_tokens_token_hash_key";

-- DropIndex
DROP INDEX "refresh_tokens_user_id_idx";

-- DropIndex
DROP INDEX "sub_categories_category_id_name_normalized_key";

-- AlterTable
ALTER TABLE "activities" DROP COLUMN "created_at",
DROP COLUMN "is_active",
DROP COLUMN "labour_cost",
DROP COLUMN "material_cost",
DROP COLUMN "sheet_data",
DROP COLUMN "updated_at",
DROP COLUMN "wiring_type",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "labourCost" DECIMAL(12,2),
ADD COLUMN     "sheetData" JSONB,
ADD COLUMN     "tenantId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "wiringType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "activity_requirements" DROP COLUMN "activity_id",
DROP COLUMN "category_id",
DROP COLUMN "sort_order",
ADD COLUMN     "activityId" TEXT NOT NULL,
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "requiredAttributes" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "subCategoryId" TEXT;

-- AlterTable
ALTER TABLE "attribute_defs" DROP COLUMN "category_id",
DROP COLUMN "created_at",
DROP COLUMN "is_active",
DROP COLUMN "name_normalized",
DROP COLUMN "sort_order",
DROP COLUMN "updated_at",
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "nameNormalized" TEXT NOT NULL,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "catalog_categories" DROP COLUMN "created_at",
DROP COLUMN "default_gst_rate",
DROP COLUMN "hsn_code",
DROP COLUMN "is_active",
DROP COLUMN "name_normalized",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "defaultGstRate" DECIMAL(5,2),
ADD COLUMN     "hsnCode" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "nameNormalized" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "manufacturers" DROP COLUMN "code",
DROP COLUMN "country",
DROP COLUMN "created_at",
DROP COLUMN "is_active",
DROP COLUMN "name_normalized",
DROP COLUMN "updated_at",
DROP COLUMN "website",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "nameNormalized" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "category_id",
DROP COLUMN "created_at",
DROP COLUMN "description",
DROP COLUMN "division_id",
DROP COLUMN "gst_rate",
DROP COLUMN "hsn_code",
DROP COLUMN "manufacturer_id",
DROP COLUMN "name_normalized",
DROP COLUMN "series_id",
DROP COLUMN "sub_category_id",
DROP COLUMN "unit_id",
DROP COLUMN "updated_at",
ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "categoryName" TEXT,
ADD COLUMN     "color" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "discountPercent" DECIMAL(5,2),
ADD COLUMN     "gstRate" DECIMAL(5,2),
ADD COLUMN     "hsnCode" TEXT,
ADD COLUMN     "manufacturerId" TEXT,
ADD COLUMN     "manufacturerName" TEXT,
ADD COLUMN     "modelCode" TEXT,
ADD COLUMN     "mrp" DECIMAL(12,2),
ADD COLUMN     "series" TEXT,
ADD COLUMN     "subCategoryId" TEXT,
ADD COLUMN     "subCategoryName" TEXT,
ADD COLUMN     "tenantId" TEXT,
ADD COLUMN     "unit" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "voltageClass" "VoltageClass",
ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "quotation_customers" DROP COLUMN "quotation_id",
ADD COLUMN     "quotationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "quotation_items" DROP COLUMN "discount_pct",
DROP COLUMN "profit_pct",
DROP COLUMN "quotation_id",
DROP COLUMN "sort_order",
DROP COLUMN "tax_rate",
ADD COLUMN     "discountPct" DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN     "profitPct" DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN     "quotationId" TEXT NOT NULL,
ADD COLUMN     "snapshotData" JSONB,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "taxRate" DECIMAL(5,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "quotation_projects" DROP COLUMN "end_date",
DROP COLUMN "quotation_id",
DROP COLUMN "start_date",
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "quotationId" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "quotations" DROP COLUMN "activity_customizations",
DROP COLUMN "activity_rows",
DROP COLUMN "brand_preferences",
DROP COLUMN "created_at",
DROP COLUMN "grand_total",
DROP COLUMN "sheet_data",
DROP COLUMN "sub_total",
DROP COLUMN "tax_total",
DROP COLUMN "terms_and_conditions",
DROP COLUMN "updated_at",
DROP COLUMN "valid_till",
ADD COLUMN     "activityCustomizations" JSONB,
ADD COLUMN     "activityRows" JSONB,
ADD COLUMN     "brandPreferences" JSONB,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "grandTotal" DECIMAL(14,2) NOT NULL DEFAULT 0,
ADD COLUMN     "sheetData" JSONB,
ADD COLUMN     "subTotal" DECIMAL(14,2) NOT NULL DEFAULT 0,
ADD COLUMN     "taxTotal" DECIMAL(14,2) NOT NULL DEFAULT 0,
ADD COLUMN     "tenantId" TEXT,
ADD COLUMN     "termsAndConditions" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "validTill" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "refresh_tokens" DROP COLUMN "created_at",
DROP COLUMN "expires_at",
DROP COLUMN "revoked_at",
DROP COLUMN "token_hash",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "revokedAt" TIMESTAMP(3),
ADD COLUMN     "tokenHash" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "sub_categories" DROP COLUMN "category_id",
DROP COLUMN "created_at",
DROP COLUMN "is_active",
DROP COLUMN "name_normalized",
DROP COLUMN "updated_at",
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "nameNormalized" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "created_at",
DROP COLUMN "first_name",
DROP COLUMN "last_name",
DROP COLUMN "password_hash",
ADD COLUMN     "adminId" TEXT,
ADD COLUMN     "companyAddress" TEXT,
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "gst" TEXT,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'APPROVED',
ALTER COLUMN "role" DROP NOT NULL;

-- DropTable
DROP TABLE "activity_requirement_options";

-- DropTable
DROP TABLE "divisions";

-- DropTable
DROP TABLE "hsn_codes";

-- DropTable
DROP TABLE "product_series";

-- DropTable
DROP TABLE "tax_rates";

-- DropTable
DROP TABLE "unit_defs";

-- DropTable
DROP TABLE "variants";

-- DropEnum
DROP TYPE "WiringType";

-- CreateTable
CREATE TABLE "activity_charges" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "activity_charges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_material_configs" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "subCategoryId" TEXT,
    "specHash" TEXT NOT NULL,
    "productModelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_material_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_types" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "name" TEXT NOT NULL,
    "nameNormalized" TEXT NOT NULL,

    CONSTRAINT "activity_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_categories" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "typeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameNormalized" TEXT NOT NULL,

    CONSTRAINT "activity_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "activity_charges_activityId_idx" ON "activity_charges"("activityId");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_material_configs_tenantId_categoryId_subCategoryId_s_key" ON "tenant_material_configs"("tenantId", "categoryId", "subCategoryId", "specHash");

-- CreateIndex
CREATE UNIQUE INDEX "activity_types_tenantId_nameNormalized_key" ON "activity_types"("tenantId", "nameNormalized");

-- CreateIndex
CREATE UNIQUE INDEX "activity_categories_tenantId_typeId_nameNormalized_key" ON "activity_categories"("tenantId", "typeId", "nameNormalized");

-- CreateIndex
CREATE INDEX "activities_wiringType_idx" ON "activities"("wiringType");

-- CreateIndex
CREATE INDEX "activities_tenantId_idx" ON "activities"("tenantId");

-- CreateIndex
CREATE INDEX "activity_requirements_activityId_idx" ON "activity_requirements"("activityId");

-- CreateIndex
CREATE INDEX "activity_requirements_categoryId_idx" ON "activity_requirements"("categoryId");

-- CreateIndex
CREATE INDEX "activity_requirements_subCategoryId_idx" ON "activity_requirements"("subCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "attribute_defs_categoryId_nameNormalized_key" ON "attribute_defs"("categoryId", "nameNormalized");

-- CreateIndex
CREATE UNIQUE INDEX "catalog_categories_nameNormalized_key" ON "catalog_categories"("nameNormalized");

-- CreateIndex
CREATE UNIQUE INDEX "manufacturers_nameNormalized_key" ON "manufacturers"("nameNormalized");

-- CreateIndex
CREATE INDEX "products_manufacturerId_series_modelCode_idx" ON "products"("manufacturerId", "series", "modelCode");

-- CreateIndex
CREATE INDEX "products_categoryId_idx" ON "products"("categoryId");

-- CreateIndex
CREATE INDEX "products_tenantId_idx" ON "products"("tenantId");

-- CreateIndex
CREATE INDEX "products_createdAt_idx" ON "products"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "quotation_customers_quotationId_key" ON "quotation_customers"("quotationId");

-- CreateIndex
CREATE INDEX "quotation_items_quotationId_idx" ON "quotation_items"("quotationId");

-- CreateIndex
CREATE UNIQUE INDEX "quotation_projects_quotationId_key" ON "quotation_projects"("quotationId");

-- CreateIndex
CREATE INDEX "quotations_tenantId_idx" ON "quotations"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_tokenHash_key" ON "refresh_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "sub_categories_categoryId_nameNormalized_key" ON "sub_categories"("categoryId", "nameNormalized");

-- AddForeignKey
ALTER TABLE "sub_categories" ADD CONSTRAINT "sub_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "catalog_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribute_defs" ADD CONSTRAINT "attribute_defs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "catalog_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "catalog_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "manufacturers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "sub_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_requirements" ADD CONSTRAINT "activity_requirements_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_requirements" ADD CONSTRAINT "activity_requirements_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "catalog_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_requirements" ADD CONSTRAINT "activity_requirements_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "sub_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_charges" ADD CONSTRAINT "activity_charges_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation_customers" ADD CONSTRAINT "quotation_customers_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "quotations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation_projects" ADD CONSTRAINT "quotation_projects_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "quotations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation_items" ADD CONSTRAINT "quotation_items_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "quotations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_categories" ADD CONSTRAINT "activity_categories_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "activity_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
