const jwt = require('jsonwebtoken');
const token = jwt.sign({ sub: 'test-admin-id', username: 'admin', role: 'ADMIN' }, 'change-me-access-secret', { expiresIn: '1h' });
const fs = require('fs');
fs.writeFileSync('token.txt', token);
console.log('Token written');
