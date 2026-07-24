const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.user.findFirst({ where: { role: 'SUPERADMIN' } }).then(u => {
  if (u) {
    console.log('Username:', u.username);
    console.log('Password (Hash):', u.passwordHash); // Note: it's mapped to password in DB
  } else {
    console.log('No superadmin found');
  }
}).catch(console.error);
