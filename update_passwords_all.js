const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const p = new PrismaClient();
bcrypt.hash('Admin@123', 10).then(hash => {
  return Promise.all([
    p.user.update({ where: { username: 'admin' }, data: { passwordHash: hash } }),
    p.user.update({ where: { username: 'staff' }, data: { passwordHash: hash } })
  ]);
}).then(() => console.log('All passwords updated to Admin@123'))
  .catch(console.error);
