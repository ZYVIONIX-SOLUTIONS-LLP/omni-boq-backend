
import re

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace TableHead
content = re.sub(
    r"<TableHead className=\"w-10 pl-5\">\s*<input\s*type=\"checkbox\"[\s\S]*?/>\s*</TableHead>",
    r"{!(scope === \"global\" && !getUser()?.roles.includes(\"SUPERADMIN\")) && (\g<0>)}",
    content
)

# Replace TableCell
content = re.sub(
    r"<TableCell className=\"pl-5 border-r border-purple-100/80 py-2.5\">\s*<input type=\"checkbox\"[\s\S]*?/>\s*</TableCell>",
    r"{!(scope === \"global\" && !getUser()?.roles.includes(\"SUPERADMIN\")) && (\g<0>)}",
    content
)

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

