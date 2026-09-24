
import os

path = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\superadmin\Materials\categories\page.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("from \"@/components/materials/import-categories-dialog\"", "from \"@/components/superadmin/import-categories-dialog\"")

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

