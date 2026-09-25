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

    c = c.replace("<div className=\"px-7 py-6 space-y-5\">", "<div className=\"px-7 py-6 space-y-5 font-sans bg-slate-50/60 min-h-screen\">")
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(c)

print("Admins root container fixed!")
