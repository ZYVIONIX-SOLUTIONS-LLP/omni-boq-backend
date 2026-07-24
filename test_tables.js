const { PrismaClient } = require('@prisma/client'); 
const p = new PrismaClient(); 
p.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`.then(console.log);
