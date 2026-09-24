
import re

path = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\src\catalog\generic\generic-crud.service.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

# Replace the user/tenant logic entirely
old_logic_pattern = r"if \(user\?\.role === \"SUPERADMIN\"\).*?where\.OR = \[\{ tenantId: null \}, \{ tenantId: tId \}\];\n\s*\}\n\s*\}"
new_logic = """if (user && user.role === "SUPERADMIN") {
      // Superadmin has no tenant access in catalog anymore
      where.tenantId = "SUPERADMIN_NO_ACCESS";
    } else if (user && this.scopeFields.includes("tenantId")) {
      where.tenantId = user.adminId || user.id;
    }"""

c = re.sub(old_logic_pattern, new_logic, c, flags=re.DOTALL)

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Fixed generic crud service!")

