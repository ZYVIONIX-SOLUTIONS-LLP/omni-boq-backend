import os
import re

files = [
    r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\superadmin\Admins\page.tsx",
    r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\superadmin\Admins\pending\page.tsx"
]

for path in files:
    if not os.path.exists(path): continue
    with open(path, "r", encoding="utf-8") as f:
        c = f.read()

    c = c.replace("shadow-primary/25", "shadow-[#163848]/25")
    c = c.replace("text-primary", "text-[#163848]")
    c = c.replace("ring-primary", "ring-[#163848]")

    with open(path, "w", encoding="utf-8") as f:
        f.write(c)

print("Primary colors fixed!")
