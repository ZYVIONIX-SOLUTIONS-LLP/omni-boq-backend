
import os
import re

path = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Activities\page.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("const result = await listActivities({ limit: 500, scope });", "const result = await listActivities({ limit: 500 });")
c = c.replace("}, [scope]);", "}, []);")
c = c.replace("rowSelection={scope === \"global\" ? undefined : { mode: \"multiRow\", headerCheckbox: true, enableClickSelection: false }}", "rowSelection={{ mode: \"multiRow\", headerCheckbox: true, enableClickSelection: false }}")

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Fixed Activities Page!")

