
import os

path = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\components\superadmin\import-categories-dialog.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("from \"@/app/lib/catalog/bulkImportCategories\"", "from \"@/app/lib/catalog/superadminBulkImportCategories\"")

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

