import os
import re

path = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\components\layout\superadmin-shell.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = re.sub(r"\s*\{ label: \"Global Materials\".*?\n", "\n", c)
c = re.sub(r"\s*\{ label: \"Global Activities\".*?\n", "\n", c)

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Superadmin shell updated!")
