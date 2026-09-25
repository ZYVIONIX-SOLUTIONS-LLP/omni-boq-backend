import os

path = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Quotations\page.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("fill-purple-200", "fill-slate-200")

with open(path, "w", encoding="utf-8") as f:
    f.write(c)
