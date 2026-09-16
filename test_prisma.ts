
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const p = await prisma.productModel.create({
    data: {
      modelCode: 'test-number',
      attributes: { 'test_attr': 400 }
    }
  });
  
  const res = await prisma.productModel.findMany({
    where: {
      OR: [
        { attributes: { path: ['test_attr'], equals: '400' } },
        { attributes: { path: ['test_attr'], array_contains: '400' } }
      ]
    }
  });
  console.log('Matched number with string?', res.map(r => r.modelCode));
  
  await prisma.productModel.delete({ where: { id: p.id } });
}
main().catch(console.error).finally(() => prisma.$disconnect());

