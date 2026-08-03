const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function run() {
  const acts = await p.activity.findMany({ include: { charges: true } });
  console.log("Activities:", acts.map(a => ({ id: a.id, name: a.name, labour: a.labourCost, charges: a.charges })));

  const pipes = await p.productModel.findMany({ where: { name: { contains: 'Conduit' } }, select: { name: true, mrp: true } });
  console.log("Pipes:", pipes);

  const wires = await p.productModel.findMany({ where: { name: { contains: 'Wire' } }, select: { name: true, mrp: true } });
  console.log("Wires:", wires);
}
run();
