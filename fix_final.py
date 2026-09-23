
import re

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\page.tsx", "r", encoding="utf-8") as f:
    c = f.read()

# Remove literal backslashes from previous mistakes
c = c.replace("\\\"global\\\"", "\"global\"")
c = c.replace("\\\"SUPERADMIN\\\"", "\"SUPERADMIN\"")

# Fix TableHead
idx_th = c.find("<TableHead className=\"w-10 pl-5")
if idx_th != -1:
    end_th = c.find("</TableHead>", idx_th) + len("</TableHead>")
    th_block = c[idx_th:end_th]
    if "input" in th_block and "type=\"checkbox\"" in th_block and "!(scope ===" not in th_block:
        c = c[:idx_th] + "{!(scope === \"global\" && !getUser()?.roles.includes(\"SUPERADMIN\")) && (" + th_block + ")}" + c[end_th:]

# Fix TableCell
# In the original file we had:
# {!(scope === "global" && !getUser()?.roles.includes("SUPERADMIN")) && (<TableCell className="pl-5 border-r border-purple-100/80 py-2.5">
# But we might have messed it up with backslashes.

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\page.tsx", "w", encoding="utf-8") as f:
    f.write(c)

