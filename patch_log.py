
import re
with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\src\catalog\products\products.service.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("const parsedAttrs = JSON.parse(params.attributes);", "const parsedAttrs = JSON.parse(params.attributes);\n        console.log(\"Parsed attributes for filtering:\", parsedAttrs);")

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\src\catalog\products\products.service.ts", "w", encoding="utf-8") as f:
    f.write(content)

