import os
import re

path = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\src\app.module.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("import { ActivityCategoriesModule } from './catalog/activity-categories/activity-categories.module';", "import { ActivityCategoriesModule } from './catalog/activity-categories/activity-categories.module';\nimport { CompanyDocumentsModule } from './company-documents/company-documents.module';")

# Using regex to insert inside imports array
c = re.sub(r"(imports:\s*\[)", r"\1\n    CompanyDocumentsModule,", c)

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Registered in app.module.ts!")
