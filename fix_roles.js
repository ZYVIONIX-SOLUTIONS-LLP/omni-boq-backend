const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.user.update({ where: { username: 'superadmin' }, data: { role: 'SUPERADMIN' } })
  .then(() => p.user.update({ where: { username: 'admin' }, data: { role: 'ADMIN' } }))
  .then(() => p.user.update({ where: { username: 'staff' }, data: { role: 'STAFF' } }))
  .then(() => console.log('Roles updated'))
  .catch(console.error);
