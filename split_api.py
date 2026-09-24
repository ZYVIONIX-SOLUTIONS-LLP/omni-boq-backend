
import re

path = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\lib\catalog\superadminApi.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("\"/catalog/categories\"", "\"/superadmin/catalog/categories\"")
c = c.replace("\"/catalog/manufacturers\"", "\"/superadmin/catalog/manufacturers\"")
c = c.replace("\"/catalog/products\"", "\"/superadmin/catalog/products\"")
c = c.replace("\"/catalog/attribute-defs\"", "\"/superadmin/catalog/attribute-defs\"")
c = c.replace("\"/catalog/sub-categories\"", "\"/superadmin/catalog/sub-categories\"")

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Split API updated!")

