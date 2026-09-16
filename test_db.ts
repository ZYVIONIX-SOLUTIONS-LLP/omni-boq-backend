
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const count = await prisma.activity.count();
  console.log('Total Activities:', count);
}
main().catch(console.error).finally(() => prisma.$disconnect());

