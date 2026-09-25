import os

path = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\components\layout\superadmin-shell.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("{ label: \"Admins\", href: \"/superadmin/Dashboard\", icon: <UsersIcon /> },", "{ label: \"Admins\", href: \"/superadmin/Admins\", icon: <UsersIcon /> },")

with open(path, "w", encoding="utf-8") as f:
    f.write(c)
