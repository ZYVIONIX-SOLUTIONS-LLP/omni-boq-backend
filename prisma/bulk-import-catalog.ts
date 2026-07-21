// One-time import of the full catalog hierarchy + products + variants captured from the
// frontend's localStorage snapshot (app/lib/catalog/generated/bulkImportData.json, copied here
// as prisma/seed-data/bulkImportData.json). Safe to re-run: everything is upserted by its
// original fixed id, so re-running after edits just reconciles rather than duplicating.
//
// Run standalone:  npx ts-node prisma/bulk-import-catalog.ts
// Or imported from prisma/seed.ts, which runs this first (categories must exist before
// SEED_ACTIVITIES' requirements can reference them).
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

interface RawEntity {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  [key: string]: unknown;
}

interface BulkData {
  manufacturers: RawEntity[];
  divisions: RawEntity[];
  series: RawEntity[];
  categories: RawEntity[];
  subCategories: RawEntity[];
  attributeDefs: RawEntity[];
  units: RawEntity[];
  products: RawEntity[];
  variants: RawEntity[];
}

export async function importCatalogData(): Promise<void> {
  const filePath = path.join(__dirname, 'seed-data', 'bulkImportData.json');
  const data: BulkData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  console.log(
    `Loaded ${data.manufacturers.length} manufacturers, ${data.divisions.length} divisions, ` +
      `${data.series.length} series, ${data.categories.length} categories, ` +
      `${data.subCategories.length} sub-categories, ${data.attributeDefs.length} attribute defs, ` +
      `${data.units.length} units, ${data.products.length} products, ${data.variants.length} variants`,
  );

  for (const m of data.manufacturers) {
    await prisma.manufacturer.upsert({
      where: { id: m.id },
      create: {
        id: m.id,
        name: m.name as string,
        nameNormalized: normalizeName(m.name as string),
        description: (m.description as string | null) ?? null,
        code: (m.code as string | null) ?? null,
        country: (m.country as string | null) ?? null,
        website: (m.website as string | null) ?? null,
        isActive: m.isActive,
      },
      update: {},
    });
  }
  console.log(`✔ manufacturers (${data.manufacturers.length})`);

  for (const d of data.divisions) {
    await prisma.division.upsert({
      where: { id: d.id },
      create: {
        id: d.id,
        manufacturerId: d.manufacturerId as string,
        name: d.name as string,
        nameNormalized: normalizeName(d.name as string),
        description: (d.description as string | null) ?? null,
        isActive: d.isActive,
      },
      update: {},
    });
  }
  console.log(`✔ divisions (${data.divisions.length})`);

  for (const s of data.series) {
    await prisma.productSeries.upsert({
      where: { id: s.id },
      create: {
        id: s.id,
        manufacturerId: s.manufacturerId as string,
        divisionId: (s.divisionId as string | null) ?? null,
        name: s.name as string,
        nameNormalized: normalizeName(s.name as string),
        description: (s.description as string | null) ?? null,
        isActive: s.isActive,
      },
      update: {},
    });
  }
  console.log(`✔ series (${data.series.length})`);

  for (const c of data.categories) {
    await prisma.catalogCategory.upsert({
      where: { id: c.id },
      create: {
        id: c.id,
        name: c.name as string,
        nameNormalized: normalizeName(c.name as string),
        description: (c.description as string | null) ?? null,
        hsnCode: (c.hsnCode as string | null) ?? null,
        defaultGstRate: (c.defaultGstRate as number | null) ?? null,
        isActive: c.isActive,
      },
      update: {},
    });
  }
  console.log(`✔ categories (${data.categories.length})`);

  for (const sc of data.subCategories) {
    await prisma.subCategory.upsert({
      where: { id: sc.id },
      create: {
        id: sc.id,
        categoryId: sc.categoryId as string,
        name: sc.name as string,
        nameNormalized: normalizeName(sc.name as string),
        description: (sc.description as string | null) ?? null,
        isActive: sc.isActive,
      },
      update: {},
    });
  }
  console.log(`✔ sub-categories (${data.subCategories.length})`);

  for (const a of data.attributeDefs) {
    await prisma.attributeDef.upsert({
      where: { id: a.id },
      create: {
        id: a.id,
        categoryId: a.categoryId as string,
        name: a.name as string,
        nameNormalized: normalizeName(a.name as string),
        description: (a.description as string | null) ?? null,
        type: (a.type as string).toUpperCase() as never,
        unit: (a.unit as string | null) ?? null,
        options: (a.options as string[]) ?? [],
        required: Boolean(a.required),
        sortOrder: (a.sortOrder as number) ?? 0,
        isActive: a.isActive,
      },
      update: {},
    });
  }
  console.log(`✔ attribute defs (${data.attributeDefs.length})`);

  for (const u of data.units) {
    await prisma.unitDef.upsert({
      where: { id: u.id },
      create: {
        id: u.id,
        name: u.name as string,
        nameNormalized: normalizeName(u.name as string),
        description: (u.description as string | null) ?? null,
        symbol: (u.symbol as string | null) ?? null,
        isActive: u.isActive,
      },
      update: {},
    });
  }
  console.log(`✔ units (${data.units.length})`);

  let productCount = 0;
  for (const p of data.products) {
    await prisma.productModel.upsert({
      where: { id: p.id },
      create: {
        id: p.id,
        name: p.name as string,
        nameNormalized: normalizeName(p.name as string),
        description: (p.description as string | null) ?? null,
        manufacturerId: p.manufacturerId as string,
        divisionId: (p.divisionId as string | null) ?? null,
        seriesId: (p.seriesId as string | null) ?? null,
        categoryId: p.categoryId as string,
        subCategoryId: (p.subCategoryId as string | null) ?? null,
        attributes: (p.attributes as object) ?? {},
        unitId: (p.unitId as string | null) ?? null,
        hsnCode: (p.hsnCode as string | null) ?? null,
        gstRate: (p.gstRate as number | null) ?? null,
        images: (p.images as object) ?? { gallery: [] },
        status: (p.status as string) as never,
      },
      update: {},
    });
    productCount++;
    if (productCount % 200 === 0) console.log(`  ...${productCount}/${data.products.length} products`);
  }
  console.log(`✔ products (${data.products.length})`);

  let variantCount = 0;
  for (const v of data.variants) {
    const prices = (v.prices as Record<string, number | null>) ?? {};
    await prisma.variant.upsert({
      where: { id: v.id },
      create: {
        id: v.id,
        productId: v.productId as string,
        name: v.name as string,
        modelCode: (v.modelCode as string | null) ?? null,
        manufacturerSku: (v.manufacturerSku as string | null) ?? null,
        internalSku: (v.internalSku as string | null) ?? null,
        barcode: (v.barcode as string | null) ?? null,
        ean: (v.ean as string | null) ?? null,
        attributes: (v.attributes as object) ?? {},
        priceMrp: prices.mrp ?? null,
        priceDealer: prices.dealer ?? null,
        priceDistributor: prices.distributor ?? null,
        priceContractor: prices.contractor ?? null,
        pricePurchase: prices.purchase ?? null,
        priceOffer: prices.offer ?? null,
        gstRate: (v.gstRate as number | null) ?? null,
        discountPercent: (v.discountPercent as number | null) ?? null,
        stockQty: (v.stockQty as number | null) ?? null,
        status: (v.status as string) as never,
        image: (v.image as object | null) ?? undefined,
      },
      update: {},
    });
    variantCount++;
    if (variantCount % 400 === 0) console.log(`  ...${variantCount}/${data.variants.length} variants`);
  }
  console.log(`✔ variants (${data.variants.length})`);
}

if (require.main === module) {
  importCatalogData()
    .then(() => prisma.$disconnect())
    .catch(async (err) => {
      console.error(err);
      await prisma.$disconnect();
      process.exit(1);
    });
}
