import os
import re

path = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Quotations\[id]\page.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(124,58,237,0.12),rgba(255,255,255,0))]", "")
c = c.replace("<div className=\"flex flex-col bg-slate-50/60 min-h-screen w-full relative print:overflow-visible print:h-auto \">", "<div className=\"flex flex-col bg-slate-50/60 min-h-screen w-full relative print:overflow-visible print:h-auto font-sans\">")
c = c.replace("<div className=\"flex flex-col bg-slate-50/60 min-h-screen w-full relative print:overflow-visible print:h-auto \n\">", "<div className=\"flex flex-col bg-slate-50/60 min-h-screen w-full relative print:overflow-visible print:h-auto font-sans\">\n")

with open(path, "w", encoding="utf-8") as f:
    f.write(c)
