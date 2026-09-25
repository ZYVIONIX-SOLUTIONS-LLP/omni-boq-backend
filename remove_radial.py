import os
import re

files = [
    r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Quotations\page.tsx",
    r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Quotations\quotation-create-dialog.tsx",
    r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Quotations\[id]\page.tsx",
    r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Quotations\[id]\ai\page.tsx"
]

for path in files:
    if not os.path.exists(path): continue
    with open(path, "r", encoding="utf-8") as f:
        c = f.read()

    c = re.sub(r"\s*bg-\[radial-gradient\([^\)]+\)\]", "", c)

    with open(path, "w", encoding="utf-8") as f:
        f.write(c)

print("Radial gradient completely removed!")
