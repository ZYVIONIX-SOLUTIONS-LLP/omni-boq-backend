const { PrismaClient } = require('@prisma/client'); 
const p = new PrismaClient(); 
p.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'refresh_tokens'`.then(console.log);
