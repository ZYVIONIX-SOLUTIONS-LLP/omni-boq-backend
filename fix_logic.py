import os

path = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\components\layout\superadmin-shell.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("if (!currentUser || currentUser.roles.includes(\"SUPERADMIN\")) {", "if (!currentUser || !currentUser.roles.includes(\"SUPERADMIN\")) {")

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Fixed superadmin-shell.tsx logic!")
