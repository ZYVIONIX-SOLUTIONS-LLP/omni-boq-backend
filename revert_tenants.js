
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.catalogCategory.updateMany({
    where: { tenantId: "cmswsz9dq000zw9i8zwp6c833" },
    data: { tenantId: null },
  });
  console.log(`Reverted ${result.count} categories back to global (null)!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

