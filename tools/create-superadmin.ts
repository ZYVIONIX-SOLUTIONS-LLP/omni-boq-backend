import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 4) {
    console.log('--- Omni BOQ Superadmin Creator ---');
    console.error('Usage: npm run create-admin <username> <password> <firstName> <lastName>');
    console.log('Example: npm run create-admin superadmin "Admin@123" Super Admin');
    process.exit(1);
  }

  const [username, password, firstName, lastName] = args;

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    console.error(`Error: User with username '${username}' already exists.`);
    process.exit(1);
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = await prisma.user.create({
    data: {
      username,
      passwordHash,
      firstName,
      lastName,
      role: 'SUPERADMIN',
    },
  });

  console.log(`✅ Successfully created superadmin '${username}' with ID: ${user.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
