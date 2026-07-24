const fs = require('fs'); 
const file = 'C:/Users/pvish/Zyvionix/Omni Projects/omni-boq-backend/prisma/schema.prisma';
let content = fs.readFileSync(file, 'utf8'); 
content = content.replace(/ @map\("[a-z0-9_]+"\)/g, ''); 
fs.writeFileSync(file, content);
console.log('Removed @map directives');
