const jwt = require('jsonwebtoken');
const token = jwt.sign({ sub: 'cmswsjsug000uw9i8j2x4lqde', role: 'ADMIN', adminId: 'cmswsjsug000uw9i8j2x4lqde' }, 'super-secret', { expiresIn: '1h' });
async function run() {
  const res = await fetch('http://localhost:3001/catalog/categories', { headers: { 'Authorization': 'Bearer ' + token }});
  const data = await res.json();
  console.log(data);
}
run();
