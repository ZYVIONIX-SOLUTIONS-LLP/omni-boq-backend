import os
import re

path = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\src\catalog\products\products.service.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

new_logic = """    if (user && user.role === "SUPERADMIN") {
      where.tenantId = "SUPERADMIN_NO_ACCESS";
    } else if (user) {
      where.tenantId = user.adminId || user.id;
    }"""
c = re.sub(r"    if \(user\?\.role === 'SUPERADMIN'\).*?\}\n\s*\}\n", new_logic + "\n", c, flags=re.DOTALL)

c = re.sub(r"    if \(id && user && user\.role !== 'SUPERADMIN'\) \{", "    if (id && user) {", c)
c = c.replace("throw new ConflictException('You cannot edit a global or foreign product');", "throw new ConflictException('You cannot edit a foreign product');")

c = re.sub(r"\s*scope\?: 'global' \| 'local' \| 'all';", "", c)

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Fixed products service!")
