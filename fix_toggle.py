
import re

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Fix the double disabled attribute
content = content.replace("disabled={!getUser()?.roles.includes(\"SUPERADMIN\") && p.isGlobal}", "")
content = content.replace("disabled={isGlobal}", "disabled={isGlobal && !getUser()?.roles.includes(\"SUPERADMIN\")}")

# 2. Fix toggleSelectAll
old_toggle = """items.forEach((p) => next.add(p.id));"""
new_toggle = """items.forEach((p) => {
          const isGlobal = !p.tenantId;
          const isSuperAdmin = getUser()?.roles.includes("SUPERADMIN");
          if (!isGlobal || isSuperAdmin) next.add(p.id);
        });"""

content = content.replace(old_toggle, new_toggle)

# 3. Ensure the allSelected checkbox isn't checked if we only selected non-global items, 
# but actually it's fine if allSelected is true when items.every(p => selectedIds.has(p.id)).
# If global items exist, items.every(...) will be false because we didn't select them. This is correct!

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

