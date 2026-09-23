
import re

# 1. Fix app/(app)/Materials/page.tsx
with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\page.tsx", "r", encoding="utf-8") as f:
    content1 = f.read()

# I will replace the cell wrapper
content1 = re.sub(
    r"<TableCell className=\"whitespace-nowrap border-r border-purple-100/80 py-2\.5\">\s*<p className=\"text-sm font-semibold text-slate-900\">",
    r"<TableCell className=\"min-w-[300px] max-w-[500px] whitespace-normal break-words border-r border-purple-100/80 py-2.5\">\n                      <p className=\"text-sm font-semibold text-slate-900 leading-snug\">",
    content1
)

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\page.tsx", "w", encoding="utf-8") as f:
    f.write(content1)

# 2. Fix app/superadmin/Materials/page.tsx
with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\superadmin\Materials\page.tsx", "r", encoding="utf-8") as f:
    content2 = f.read()

content2 = re.sub(
    r"<TableCell className=\"whitespace-nowrap\">\s*<p className=\"text-sm font-semibold\">",
    r"<TableCell className=\"min-w-[300px] max-w-[500px] whitespace-normal break-words\">\n                      <p className=\"text-sm font-semibold leading-snug\">",
    content2
)

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\superadmin\Materials\page.tsx", "w", encoding="utf-8") as f:
    f.write(content2)

