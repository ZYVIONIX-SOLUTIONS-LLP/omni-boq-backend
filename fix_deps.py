import os

path = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\components\layout\app-shell.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("}, [user, isWorkspaceContext]);", "}, [user, isWorkspaceContext, isCompanyContext]);")

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Dependencies fixed!")
