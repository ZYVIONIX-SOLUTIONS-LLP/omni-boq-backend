const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const p = new PrismaClient();
bcrypt.hash('Admin@123', 10).then(hash => {
  return p.user.update({ where: { username: 'superadmin' }, data: { passwordHash: hash } });
}).then(() => console.log('Password updated to Admin@123'))
  .catch(console.error);
