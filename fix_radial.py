import os
import re

path = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Quotations\page.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = re.sub(r"bg-\[radial-gradient\([^\)]+\)\]", "", c)
c = c.replace(" bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(124,58,237,0.12),rgba(255,255,255,0))]", "")
c = c.replace("<div className=\"p-6 space-y-5 bg-slate-50/60 min-h-screen font-sans bg-slate-50/60 min-h-screen\">", "<div className=\"p-6 space-y-5 font-sans bg-slate-50/60 min-h-screen\">")

with open(path, "w", encoding="utf-8") as f:
    f.write(c)
