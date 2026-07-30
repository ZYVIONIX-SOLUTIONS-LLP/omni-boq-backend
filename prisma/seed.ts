// Seeds the small hand-authored baseline: demo users + the original 14 seed activities
// (ported from app/lib/local/seed-data.ts). Runs the full catalog bulk-import first, since
// ActivityRequirement.categoryId is a real FK into CatalogCategory. Safe to re-run (upserts).
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { importCatalogData } from './bulk-import-catalog';

const prisma = new PrismaClient();

const SEED_USERS = [
  { id: 'user-super', username: 'superadmin', password: 'Admin@123', firstName: 'Super', lastName: 'Admin', role: 'SUPERADMIN' as const },
  { id: 'user-admin', username: 'admin', password: 'Admin@123', firstName: 'System', lastName: 'Admin', role: 'ADMIN' as const },
  { id: 'user-staff', username: 'staff', password: 'Admin@123', firstName: 'Staff', lastName: 'User', role: 'STAFF' as const },
];

type ReqSeed = { categoryId: string; description: string; unit: string; quantity: number };
const req = (categoryId: string, description: string, unit: string, quantity: number): ReqSeed => ({
  categoryId,
  description,
  unit,
  quantity,
});

interface ActivitySeed {
  id: string;
  code: string;
  name: string;
  wiringType: 'POINT_WIRING' | 'CIRCUIT_WIRING';
  segment: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL';
  requirements: ReqSeed[];
  materialCost: number;
  labourCost: number;
}

const activity = (
  id: string,
  code: string,
  name: string,
  wiringType: ActivitySeed['wiringType'],
  segment: ActivitySeed['segment'],
  requirements: ReqSeed[],
  materialCost: number,
  labourCost: number,
): ActivitySeed => ({ id, code, name, wiringType, segment, requirements, materialCost, labourCost });

const SEED_ACTIVITIES: ActivitySeed[] = [
  activity('act-p1', 'ACT-P-0001', 'One light controlled by one 6A switch', 'POINT_WIRING', 'RESIDENTIAL', [
    req('ccat-wire', 'FR Wire 1.5 Sq.mm', 'MTR', 15),
    req('ccat-conduit', 'PVC Conduit 20mm', 'MTR', 6),
    req('ccat-switch', 'Schneider Livia 6A Switch', 'NOS', 1),
    req('ccat-box', 'Schneider 3M Metal Box', 'NOS', 1),
    req('ccat-coverframe', 'Schneider Livia 3M Cover Plate', 'NOS', 1),
  ], 256.59, 150.0),
  activity('act-p2', 'ACT-P-0002', 'Two lights controlled by two 6A switches', 'POINT_WIRING', 'RESIDENTIAL', [
    req('ccat-wire', 'FR Wire 1.5 Sq.mm', 'MTR', 22),
    req('ccat-conduit', 'PVC Conduit 20mm', 'MTR', 9),
    req('ccat-switch', 'Schneider Livia 6A Switch', 'NOS', 2),
    req('ccat-box', 'Schneider 3M Metal Box', 'NOS', 1),
    req('ccat-coverframe', 'Schneider Livia 3M Cover Plate', 'NOS', 1),
  ], 385.12, 220.0),
  activity('act-p3', 'ACT-P-0003', 'Ceiling fan point with switch & regulator', 'POINT_WIRING', 'RESIDENTIAL', [
    req('ccat-wire', 'FR Wire 1.5 Sq.mm', 'MTR', 16),
    req('ccat-conduit', 'PVC Conduit 20mm', 'MTR', 7),
    req('ccat-switch', 'Schneider Livia 6A Switch', 'NOS', 1),
    req('ccat-box', 'Schneider 4M Metal Box', 'NOS', 1),
    req('ccat-coverframe', 'Schneider Livia 4M Cover Plate', 'NOS', 1),
  ], 290.45, 175.0),
  activity('act-p4', 'ACT-P-0004', '6A socket point with 6A Switch', 'POINT_WIRING', 'RESIDENTIAL', [
    req('ccat-wire', 'FR Wire 1.5 Sq.mm', 'MTR', 12),
    req('ccat-conduit', 'PVC Conduit 20mm', 'MTR', 5),
    req('ccat-switch', 'Schneider Livia 6A Switch', 'NOS', 1),
    req('ccat-socket', 'Schneider Livia 2-in-1 Socket', 'NOS', 1),
    req('ccat-box', 'Schneider 3M Metal Box', 'NOS', 1),
    req('ccat-coverframe', 'Schneider Livia 3M Cover Plate', 'NOS', 1),
  ], 215.8, 120.0),
  activity('act-p5', 'ACT-P-0005', '16A power socket point with 16A Switch', 'POINT_WIRING', 'RESIDENTIAL', [
    req('ccat-wire', 'FR Wire 2.5 Sq.mm', 'MTR', 15),
    req('ccat-conduit', 'PVC Conduit 25mm', 'MTR', 6),
    req('ccat-switch', 'Schneider Livia 16A Switch', 'NOS', 1),
    req('ccat-socket', 'Schneider Livia 3-pin Socket 6/16A', 'NOS', 1),
    req('ccat-box', 'Schneider 3M Metal Box', 'NOS', 1),
    req('ccat-coverframe', 'Schneider Livia 3M Cover Plate', 'NOS', 1),
  ], 410.25, 180.0),
  activity('act-p6', 'ACT-P-0006', 'Calling bell point with Bell Push', 'POINT_WIRING', 'RESIDENTIAL', [
    req('ccat-wire', 'FR Wire 1.5 Sq.mm', 'MTR', 10),
    req('ccat-conduit', 'PVC Conduit 20mm', 'MTR', 5),
    req('ccat-switch', 'Schneider Livia 6A Switch', 'NOS', 1),
    req('ccat-box', 'Schneider 3M Metal Box', 'NOS', 1),
    req('ccat-coverframe', 'Schneider Livia 3M Cover Plate', 'NOS', 1),
  ], 208.5, 110.0),
  activity('act-p7', 'ACT-P-0007', 'Exhaust fan point with 6A Switch', 'POINT_WIRING', 'RESIDENTIAL', [
    req('ccat-wire', 'FR Wire 1.5 Sq.mm', 'MTR', 12),
    req('ccat-conduit', 'PVC Conduit 20mm', 'MTR', 5),
    req('ccat-switch', 'Schneider Livia 6A Switch', 'NOS', 1),
    req('ccat-box', 'Schneider 3M Metal Box', 'NOS', 1),
    req('ccat-coverframe', 'Schneider Livia 3M Cover Plate', 'NOS', 1),
  ], 215.8, 115.0),
  activity('act-p8', 'ACT-P-0008', 'Geyser point with 16A Switch', 'POINT_WIRING', 'RESIDENTIAL', [
    req('ccat-wire', 'FR Wire 2.5 Sq.mm', 'MTR', 14),
    req('ccat-conduit', 'PVC Conduit 20mm', 'MTR', 6),
    req('ccat-switch', 'Schneider Livia 16A Switch', 'NOS', 1),
    req('ccat-socket', 'Schneider Livia 3-pin Socket 6/16A', 'NOS', 1),
    req('ccat-box', 'Schneider 3M Metal Box', 'NOS', 1),
    req('ccat-coverframe', 'Schneider Livia 3M Cover Plate', 'NOS', 1),
  ], 395.4, 170.0),
  activity('act-p9', 'ACT-P-0009', 'TV Coaxial socket point', 'POINT_WIRING', 'RESIDENTIAL', [
    req('ccat-conduit', 'PVC Conduit 20mm', 'MTR', 5),
    req('ccat-socket', 'Schneider Livia 2-in-1 Socket', 'NOS', 1),
    req('ccat-box', 'Schneider 3M Metal Box', 'NOS', 1),
    req('ccat-coverframe', 'Schneider Livia 3M Cover Plate', 'NOS', 1),
  ], 145.2, 95.0),
  activity('act-c1', 'ACT-C-0001', 'Lighting circuit wiring (1.5 sq.mm)', 'CIRCUIT_WIRING', 'RESIDENTIAL', [
    req('ccat-wire', 'FR Wire 1.5 Sq.mm', 'MTR', 30),
    req('ccat-conduit', 'PVC Conduit 20mm', 'MTR', 12),
  ], 120.45, 90.0),
  activity('act-c2', 'ACT-C-0002', 'Power circuit wiring (2.5 sq.mm)', 'CIRCUIT_WIRING', 'RESIDENTIAL', [
    req('ccat-wire', 'FR Wire 2.5 Sq.mm', 'MTR', 35),
    req('ccat-conduit', 'PVC Conduit 25mm', 'MTR', 15),
  ], 225.6, 110.0),
  activity('act-c3', 'ACT-C-0003', 'AC circuit wiring (4.0 sq.mm)', 'CIRCUIT_WIRING', 'RESIDENTIAL', [
    req('ccat-wire', 'FR Wire 4.0 Sq.mm', 'MTR', 36),
    req('ccat-wire', 'FR Wire 2.5 Sq.mm', 'MTR', 18),
    req('ccat-conduit', 'PVC Conduit 25mm', 'MTR', 18),
  ], 480.5, 180.0),
  activity('act-c4', 'ACT-C-0004', 'Geyser circuit wiring (2.5 sq.mm)', 'CIRCUIT_WIRING', 'RESIDENTIAL', [
    req('ccat-wire', 'FR Wire 2.5 Sq.mm', 'MTR', 32),
    req('ccat-conduit', 'PVC Conduit 20mm', 'MTR', 12),
  ], 210.8, 105.0),
  activity('act-d1', 'ACT-D-0001', 'DB Installation (12-Way SPN)', 'CIRCUIT_WIRING', 'RESIDENTIAL', [
    req('ccat-db', 'Schneider 12-Way SPN DB', 'NOS', 1),
    req('ccat-mcb', 'Schneider SP 10A MCB', 'NOS', 4),
    req('ccat-mcb', 'Schneider SP 16A MCB', 'NOS', 4),
    req('ccat-mcb', 'Schneider SP 20A MCB', 'NOS', 2),
    req('ccat-mcb', 'Schneider SP 32A MCB', 'NOS', 1),
  ], 3450.0, 650.0),
];

async function seedUsers() {
  for (const u of SEED_USERS) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({
      where: { id: u.id },
      create: {
        id: u.id,
        username: u.username,
        passwordHash,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role,
      },
      update: {},
    });
  }
  console.log(`✔ users (${SEED_USERS.length})`);
}

async function seedActivities() {
  for (const a of SEED_ACTIVITIES) {
    await prisma.activity.upsert({
      where: { id: a.id },
      create: {
        id: a.id,
        code: a.code,
        name: a.name,
        wiringType: a.wiringType,
        segment: a.segment,
        unit: a.wiringType === 'POINT_WIRING' ? 'POINT' : 'CIRCUIT',
        labourCost: a.labourCost,
      },
      update: {},
    });

    await prisma.activityRequirement.deleteMany({ where: { activityId: a.id } });
    await prisma.activityRequirement.createMany({
      data: a.requirements.map((r, i) => ({
        id: `${a.id}-r${i}`,
        activityId: a.id,
        categoryId: r.categoryId,
        description: r.description,
        unit: r.unit as never,
        quantity: r.quantity,
        sortOrder: i,
      })),
    });
  }
  console.log(`✔ activities (${SEED_ACTIVITIES.length})`);
}

async function main() {
  await importCatalogData();
  await seedUsers();
  await seedActivities();
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
