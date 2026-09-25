import os

path = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Dashboard\page.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("user?.roles?.includes(\"ADMIN\")", "user?.role === \"ADMIN\"")
c = c.replace("user?.roles?.includes(\"SUPERADMIN\")", "user?.role === \"SUPERADMIN\"")
c = c.replace("user?.roles?.includes(\"STAFF\")", "user?.role === \"STAFF\"")

with open(path, "w", encoding="utf-8") as f:
    f.write(c)
