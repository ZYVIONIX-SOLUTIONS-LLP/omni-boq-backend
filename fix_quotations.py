
import os
import re

files = [
    r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Quotations\page.tsx",
    r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Quotations\quotation-create-dialog.tsx",
    r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Quotations\[id]\page.tsx",
    r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Quotations\[id]\ai\page.tsx"
]

for path in files:
    if not os.path.exists(path):
        continue
        
    with open(path, "r", encoding="utf-8") as f:
        c = f.read()

    # Apply font-sans to root container if it exists
    if path.endswith("page.tsx"):
        c = re.sub(r"<div className=\"(p-6.*?)\">", r"<div className=\"\1 font-sans bg-slate-50/60 min-h-screen\">", c)

    # Remove radial gradients and bg-primary
    c = c.replace("bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]", "bg-slate-50")
    c = c.replace("from-purple-50 via-white to-purple-50/20", "")
    
    # Replace purple buttons with #163848
    c = c.replace("bg-primary", "bg-[#163848]")
    c = c.replace("hover:bg-primary/90", "hover:bg-[#112a36]")
    
    c = c.replace("bg-purple-600", "bg-[#163848]")
    c = c.replace("hover:bg-purple-700", "hover:bg-[#112a36]")
    
    c = c.replace("bg-purple-50", "bg-slate-50")
    c = c.replace("text-purple-700", "text-[#163848]")
    c = c.replace("text-purple-600", "text-[#163848]")
    c = c.replace("border-purple-200", "border-slate-200")
    c = c.replace("border-purple-300", "border-slate-300")
    
    c = c.replace("ring-purple-500", "ring-[#163848]")
    c = c.replace("focus:ring-purple-500", "focus:ring-[#163848]")
    
    # Border radius updates
    c = c.replace("rounded-2xl", "rounded-md")
    c = c.replace("rounded-xl", "rounded-md")
    c = c.replace("rounded-lg", "rounded-sm")

    # In case there are more specific gradients
    c = re.sub(r"bg-gradient-to-[a-z]+\s+from-[a-z]+-[0-9]+\s+to-[a-z]+-[0-9]+", "bg-[#163848]", c)

    with open(path, "w", encoding="utf-8") as f:
        f.write(c)

print("Quotations styling fixed!")

