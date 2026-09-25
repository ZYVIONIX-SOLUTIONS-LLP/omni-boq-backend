import os
import re

files = [
    r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Quotations\page.tsx",
    r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Quotations\quotation-create-dialog.tsx",
    r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Quotations\[id]\page.tsx",
    r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Quotations\[id]\ai\page.tsx"
]

for path in files:
    if not os.path.exists(path): continue
    with open(path, "r", encoding="utf-8") as f:
        c = f.read()

    c = c.replace("bg-purple-100", "bg-[#163848]/10")
    c = c.replace("hover:text-purple-900", "hover:text-[#112a36]")
    c = c.replace("hover:text-purple-700", "hover:text-[#163848]")
    c = c.replace("text-purple-800", "text-[#163848]")
    
    c = re.sub(r"bg-purple-[0-9]+", "bg-[#163848]", c)
    c = re.sub(r"text-purple-[0-9]+", "text-[#163848]", c)
    c = re.sub(r"border-purple-[0-9]+", "border-slate-300", c)

    c = c.replace("<div className=\"p-6 space-y-6\">", "<div className=\"p-6 space-y-6 font-sans bg-slate-50/60 min-h-screen\">")
    c = c.replace("<div className=\"h-screen flex flex-col bg-slate-50\">", "<div className=\"h-screen flex flex-col bg-slate-50 font-sans\">")

    with open(path, "w", encoding="utf-8") as f:
        f.write(c)

print("Purple removed!")
