
import os

base_dir = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\src\company-documents"

with open(os.path.join(base_dir, "company-documents.controller.ts"), "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("const filename = `${file.fieldname}-`;", "const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;")

with open(os.path.join(base_dir, "company-documents.controller.ts"), "w", encoding="utf-8") as f:
    f.write(c)

