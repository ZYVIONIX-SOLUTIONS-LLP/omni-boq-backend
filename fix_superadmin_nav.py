import os

path = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\components\layout\superadmin-shell.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

new_logic = """
    if (role === "SUPERADMIN") {
      return [
        { label: "Admins", href: "/superadmin/Dashboard", icon: <UsersIcon /> },
      ];
    }
    if (role === "ADMIN") {
"""

c = c.replace("if (role === \"ADMIN\") {", new_logic.strip())

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Superadmin nav fixed!")
