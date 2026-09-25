import os
import re

path = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\src\catalog\products\products.controller.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = re.sub(r"\s*@Query\('scope'\) scope\?: 'global' \| 'local' \| 'all',", "", c)

with open(path, "w", encoding="utf-8") as f:
    f.write(c)
