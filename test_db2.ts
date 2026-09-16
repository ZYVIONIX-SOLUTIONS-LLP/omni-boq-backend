
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const p = await prisma.productModel.findFirst({
    where: { attributes: { not: {} } }
  });
  console.log('Sample product attributes:', p?.attributes);
}
main().catch(console.error).finally(() => prisma.$disconnect());

