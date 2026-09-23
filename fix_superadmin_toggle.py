
import re

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\superadmin\Materials\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_toggle = """items.forEach((p) => next.add(p.id));"""
new_toggle = """items.forEach((p) => {
          const isGlobal = !p.tenantId;
          const isSuperAdmin = getUser()?.roles.includes("SUPERADMIN");
          if (!isGlobal || isSuperAdmin) next.add(p.id);
        });"""

content = content.replace(old_toggle, new_toggle)

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\superadmin\Materials\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

