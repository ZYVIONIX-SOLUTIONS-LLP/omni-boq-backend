
import re

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\lib\catalog\api.ts", "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("includeInactive: params.includeInactive,", "includeInactive: params.includeInactive,\n          scope: (params as any).scope,")

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\lib\catalog\api.ts", "w", encoding="utf-8") as f:
    f.write(c)

