
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.catalogCategory.updateMany({
    where: { tenantId: null },
    data: { tenantId: "cmswsz9dq000zw9i8zwp6c833" },
  });
  console.log(`Updated ${result.count} categories!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

