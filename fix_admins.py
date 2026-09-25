import os
import re

files = [
    r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\superadmin\Admins\page.tsx",
    r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\superadmin\Admins\pending\page.tsx"
]

for path in files:
    if not os.path.exists(path): continue
    with open(path, "r", encoding="utf-8") as f:
        c = f.read()

    # Add font-sans to root container and fix background
    c = c.replace("<div className=\"p-6 space-y-6\">", "<div className=\"p-6 space-y-6 font-sans bg-slate-50/60 min-h-screen\">")
    
    # Remove radial gradients
    c = re.sub(r"bg-\[radial-gradient\([^\)]+\)\]", "", c)

    # Replace purple buttons with #163848
    c = c.replace("bg-primary", "bg-[#163848]")
    c = c.replace("hover:bg-primary/90", "hover:bg-[#112a36]")
    
    c = c.replace("bg-purple-600", "bg-[#163848]")
    c = c.replace("hover:bg-purple-700", "hover:bg-[#112a36]")
    
    # Replace light purple backgrounds and text
    c = c.replace("bg-purple-100", "bg-[#163848]/10")
    c = c.replace("bg-purple-50", "bg-slate-50")
    c = c.replace("text-purple-900", "text-[#163848]")
    c = c.replace("text-purple-800", "text-[#163848]")
    c = c.replace("text-purple-700", "text-[#163848]")
    c = c.replace("text-purple-600", "text-[#163848]")
    c = c.replace("border-purple-200", "border-slate-200")
    c = c.replace("border-purple-300", "border-slate-300")
    
    c = c.replace("ring-purple-500", "ring-[#163848]")
    c = c.replace("focus:ring-purple-500", "focus:ring-[#163848]")
    
    # Border radius updates for cards and inputs
    c = c.replace("rounded-2xl", "rounded-md")
    c = c.replace("rounded-xl", "rounded-md")
    c = c.replace("rounded-lg", "rounded-sm")
    c = c.replace("rounded-full", "rounded-none") # Wait, might break checkboxes/avatars.
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(c)

print("Admins styling fixed!")
