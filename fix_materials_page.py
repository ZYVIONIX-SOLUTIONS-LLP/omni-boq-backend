
import os

path = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\page.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("{!(scope === \"global\" && !getUser()?.roles.includes(\"SUPERADMIN\")) && (<TableHead className=\"w-10 pl-5 border-r border-slate-200\">", "<TableHead className=\"w-10 pl-5 border-r border-slate-200\">")
c = c.replace("</TableHead>)}", "</TableHead>")

c = c.replace("{!(scope === \"global\" && !getUser()?.roles.includes(\"SUPERADMIN\")) && (<TableCell className=\"pl-5 border-r border-slate-200 py-2.5\">", "<TableCell className=\"pl-5 border-r border-slate-200 py-2.5\">")
c = c.replace("</TableCell>)}", "</TableCell>")

# Also remove the scope usage on line 125
# `!(scope === "global" && !getUser()?.roles.includes("SUPERADMIN")) &&` logic in the bulk actions header
c = c.replace("{!(scope === \"global\" && !getUser()?.roles.includes(\"SUPERADMIN\")) && (<div className=\"flex items-center gap-4\">", "<div className=\"flex items-center gap-4\">")
c = c.replace("</div>)}", "</div>") # This might be risky if there are multiple </div>)}, let me check if there are others. Actually, let's just replace the exact string if it exists.

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Fixed!")

