const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const quotations = await prisma.quotation.findMany({ select: { id: true, code: true, tenantId: true, createdAt: true } });
  console.log('Quotations:', JSON.stringify(quotations));
  const users = await prisma.user.findMany({ where: { role: 'ADMIN' }, select: { id: true, username: true, status: true } });
  console.log('Admin users:', JSON.stringify(users));
  await prisma.$disconnect();
})();
