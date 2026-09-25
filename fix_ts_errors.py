import os
import re

path1 = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\page.tsx"
with open(path1, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("disabled={isGlobal}", "disabled={false}")
c = c.replace("isGlobal &&", "false &&")
c = c.replace("isGlobal ", "false ")
with open(path1, "w", encoding="utf-8") as f:
    f.write(c)

path2 = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\components\layout\app-shell.tsx"
with open(path2, "r", encoding="utf-8") as f:
    c = f.read()

c = re.sub(r'className="text-xs truncate opacity-80"\s+className="text-slate-300"', 'className="text-xs truncate opacity-80 text-slate-300"', c)
c = re.sub(r'className="text-sm font-bold truncate"\s+className="text-white"', 'className="text-sm font-bold truncate text-white"', c)

with open(path2, "w", encoding="utf-8") as f:
    f.write(c)

path3 = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\components\layout\superadmin-shell.tsx"
with open(path3, "r", encoding="utf-8") as f:
    c = f.read()

c = re.sub(r'className="text-xs truncate opacity-80"\s+className="text-slate-300"', 'className="text-xs truncate opacity-80 text-slate-300"', c)
c = re.sub(r'className="text-sm font-bold truncate"\s+className="text-white"', 'className="text-sm font-bold truncate text-white"', c)

with open(path3, "w", encoding="utf-8") as f:
    f.write(c)

