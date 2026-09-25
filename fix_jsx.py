
import os
import re

path = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\page.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

# Replace {!(scope === "global" && !getUser()?.roles.includes("SUPERADMIN")) && (<TableHead ...>
# With just <TableHead ...>
c = re.sub(r"\{!\(scope === \"global\" && !getUser\(\)\?\.roles\.includes\(\"SUPERADMIN\"\)\) && \(\s*(<TableHead.*?)\s*\)\}", r"\1", c, flags=re.DOTALL)
c = re.sub(r"\{!\(scope === \"global\" && !getUser\(\)\?\.roles\.includes\(\"SUPERADMIN\"\)\) && \(\s*(<TableCell.*?)\s*\)\}", r"\1", c, flags=re.DOTALL)

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Fixed frontend jsx!")

