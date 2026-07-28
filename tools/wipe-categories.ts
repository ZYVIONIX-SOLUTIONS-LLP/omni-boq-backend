import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.attributeDef.deleteMany({});
  await prisma.subCategory.deleteMany({});
  await prisma.catalogCategory.deleteMany({});
  console.log('Deleted all categories, subcategories, and attributes.');
}
main().catch(console.error).finally(() => prisma.$disconnect());
