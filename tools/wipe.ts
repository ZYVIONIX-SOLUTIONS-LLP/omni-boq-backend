import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.activityRequirementOption.deleteMany({});
  await prisma.activityRequirement.deleteMany({});
  await prisma.activity.deleteMany({});
  await prisma.variant.deleteMany({});
  await prisma.productModel.deleteMany({});
  console.log('Deleted all activities and materials.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
