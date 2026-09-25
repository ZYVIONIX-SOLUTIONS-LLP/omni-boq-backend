import os
import re

path = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\page.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

# Remove the disabled attributes from the checkbox
c = re.sub(r"\s*disabled=\{!getUser\(\)\?\.roles\.includes\(\"SUPERADMIN\"\) && p\.isGlobal\}", "", c)
c = re.sub(r"\s*disabled=\{isGlobal && !getUser\(\)\?\.roles\.includes\(\"SUPERADMIN\"\)\}", "", c)
# And the isGlobal logic
c = re.sub(r"\s*const isGlobal = !p\.tenantId;\n", "\n", c)
# Remove the edit button disabled check
c = re.sub(r"disabled=\{isGlobal && !getUser\(\)\?\.roles\.includes\(\"SUPERADMIN\"\)\}", "", c)
c = re.sub(r"disabled=\{!getUser\(\)\?\.roles\.includes\(\"SUPERADMIN\"\) && p\.tenantId === null\}", "", c)

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

path2 = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\components\layout\app-shell.tsx"
with open(path2, "r", encoding="utf-8") as f:
    c = f.read()
# Fix app-shell duplicate attributes
c = c.replace('className="text-xs truncate opacity-80 text-slate-300"\n                  className="text-slate-300"', 'className="text-xs truncate opacity-80 text-slate-300"')
c = c.replace('className="text-sm font-bold truncate text-white"\n                  className="text-white"', 'className="text-sm font-bold truncate text-white"')
with open(path2, "w", encoding="utf-8") as f:
    f.write(c)

path3 = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\components\layout\superadmin-shell.tsx"
with open(path3, "r", encoding="utf-8") as f:
    c = f.read()
# Fix superadmin-shell duplicate attributes
c = c.replace('className="text-xs truncate opacity-80 text-slate-300"\n                  className="text-slate-300"', 'className="text-xs truncate opacity-80 text-slate-300"')
c = c.replace('className="text-sm font-bold truncate text-white"\n                  className="text-white"', 'className="text-sm font-bold truncate text-white"')
with open(path3, "w", encoding="utf-8") as f:
    f.write(c)

print("Fixed JSX duplicate attributes!")
