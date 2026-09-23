
with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\src\catalog\generic\generic-crud.service.ts", "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("\"tenantId\" in this.delegate.fields", "this.scopeFields.includes(\"tenantId\")")

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\src\catalog\generic\generic-crud.service.ts", "w", encoding="utf-8") as f:
    f.write(c)

