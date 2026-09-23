
import re

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\superadmin\Materials\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Disable checkbox if global and not superadmin
old_check = """<input
                        type="checkbox"
                        checked={selectedIds.has(p.id)}
                        onChange={() => toggleSelect(p.id)}
                        aria-label={`Select ${p.name || p.modelCode}`}
                      />"""

new_check = """<input
                        type="checkbox"
                        disabled={!getUser()?.roles.includes("SUPERADMIN") && !p.tenantId}
                        checked={selectedIds.has(p.id)}
                        onChange={() => toggleSelect(p.id)}
                        aria-label={`Select ${p.name || p.modelCode}`}
                      />"""

content = content.replace(old_check, new_check)

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\superadmin\Materials\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

