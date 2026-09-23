import re

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\src\catalog\manufacturers\manufacturers.service.ts", "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("protected searchFields = ['country', 'code'];", "protected searchFields = ['country', 'code'];\n  protected scopeFields = ['tenantId'];")

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\src\catalog\manufacturers\manufacturers.service.ts", "w", encoding="utf-8") as f:
    f.write(c)
