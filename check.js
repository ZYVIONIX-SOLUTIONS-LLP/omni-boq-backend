const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();
async function check() {
  const defs = await prisma.attributeDef.findMany({ 
    where: { categoryId: 'cmufo6ghg0034w9l4lgi44jif' } // Cover Plate
  });
  console.log(defs);
  await prisma['']();
}
check();
