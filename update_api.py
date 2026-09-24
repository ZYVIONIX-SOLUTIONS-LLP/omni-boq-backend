import os
import re

path = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\lib\catalog\api.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = re.sub(r"\s*scope:\s*\(params as any\)\.scope,", "", c)
c = re.sub(r"\s*scope:\s*params\.scope,", "", c)

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("API updated!")
