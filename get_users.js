const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.user.findMany().then(users => {
  users.forEach(u => console.log(u.username, u.role, u.passwordHash));
}).catch(console.error);
