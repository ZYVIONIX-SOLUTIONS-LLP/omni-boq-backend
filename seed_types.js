const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const types = [
    { name: 'POINT WIRING' },
    { name: 'CIRCUIT WIRING' },
  ];

  for (const t of types) {
    const nameNormalized = t.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    let type = await prisma.activityType.findFirst({
      where: {
        tenantId: null,
        nameNormalized: nameNormalized
      }
    });

    if (!type) {
      type = await prisma.activityType.create({
        data: {
          name: t.name,
          nameNormalized,
          tenantId: null
        }
      });
      console.log('Created type:', t.name);
    }
  }

  // Update existing activities to use POINT WIRING and CIRCUIT WIRING instead of POINT_WIRING
  await prisma.activity.updateMany({
    where: { wiringType: 'POINT_WIRING' },
    data: { wiringType: 'POINT WIRING' }
  });
  await prisma.activity.updateMany({
    where: { wiringType: 'CIRCUIT_WIRING' },
    data: { wiringType: 'CIRCUIT WIRING' }
  });

  console.log('Done seeding types and updating old activities.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
