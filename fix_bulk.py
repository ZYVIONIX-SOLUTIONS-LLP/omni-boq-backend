
import os

path = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\lib\catalog\superadminBulkImportCategories.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("from \"./api\"", "from \"./superadminApi\"")

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

