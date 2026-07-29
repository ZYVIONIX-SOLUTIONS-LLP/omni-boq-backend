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
  categories: RawEntity[];
  subCategories: RawEntity[];
  attributeDefs: RawEntity[];
  products: RawEntity[];
}

export async function importCatalogData(): Promise<void> {
  const filePath = path.join(__dirname, 'seed-data', 'bulkImportData.json');
  if (!fs.existsSync(filePath)) {
    console.log('No bulkImportData.json found, skipping catalog import.');
    return;
  }
  const data: BulkData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  console.log(
    `Loaded ${data.manufacturers?.length || 0} manufacturers, ` +
      `${data.categories?.length || 0} categories, ` +
      `${data.subCategories?.length || 0} sub-categories, ${data.attributeDefs?.length || 0} attribute defs, ` +
      `${data.products?.length || 0} products`
  );

  for (const m of (data.manufacturers || [])) {
    await prisma.manufacturer.upsert({
      where: { id: m.id },
      create: {
        id: m.id,
        name: m.name as string,
        nameNormalized: normalizeName(m.name as string),
        description: (m.description as string | null) ?? null,
        isActive: m.isActive,
      },
      update: {},
    });
  }
  console.log(`✓ manufacturers (${data.manufacturers?.length || 0})`);

  for (const c of (data.categories || [])) {
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
  console.log(`✓ categories (${data.categories?.length || 0})`);

  for (const sc of (data.subCategories || [])) {
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
  console.log(`✓ sub-categories (${data.subCategories?.length || 0})`);

  for (const a of (data.attributeDefs || [])) {
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
  console.log(`✓ attribute defs (${data.attributeDefs?.length || 0})`);

  let productCount = 0;
  for (const p of (data.products || [])) {
    await prisma.productModel.upsert({
      where: { id: p.id },
      create: {
        id: p.id,
        manufacturerId: p.manufacturerId as string,
        series: (typeof p.series === 'object' && p.series !== null) ? (p.series as any).name : ((p.series as string | null) ?? null),
        categoryId: p.categoryId as string,
        subCategoryId: (p.subCategoryId as string | null) ?? null,
        attributes: (p.attributes as object) ?? {},
        modelCode: (p.modelCode as string | null) ?? null,
        color: (p.color as string | null) ?? null,
        unit: (p.unit as string | null) ?? null,
        hsnCode: (p.hsnCode as string | null) ?? null,
        gstRate: (p.gstRate as number | null) ?? null,
        mrp: (p.mrp as number | null) ?? null,
        discountPercent: (p.discountPercent as number | null) ?? null,
        images: (p.images as object) ?? { gallery: [] },
        status: (p.status as string) as never,
      },
      update: {},
    });
    productCount++;
    if (productCount % 200 === 0) console.log(`  ...${productCount}/${data.products.length} products`);
  }
  console.log(`✓ products (${data.products?.length || 0})`);
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
