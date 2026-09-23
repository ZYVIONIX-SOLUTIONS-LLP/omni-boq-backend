
import re

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\components\layout\app-shell.tsx", "r", encoding="utf-8") as f:
    c = f.read()

# Add Layers to lucide-react imports if not there
if "import { " in c and "lucide-react" in c:
    if "Layers" not in c:
        c = c.replace("import { ", "import { Layers, ")
else:
    # insert at top
    c = "import { Layers } from \"lucide-react\";\n" + c


# Add Categories to WORKSPACE_NAV_ITEMS
workspace_old = """const WORKSPACE_NAV_ITEMS = [
  { label: "Quotations", href: "/Quotations", icon: <QuotationsIcon /> },
  { label: "Materials", href: "/Materials", icon: <MaterialsIcon /> },
  { label: "Activities", href: "/Activities", icon: <ActivitiesIcon /> },
];"""

workspace_new = """const WORKSPACE_NAV_ITEMS = [
  { label: "Quotations", href: "/Quotations", icon: <QuotationsIcon /> },
  { label: "Materials", href: "/Materials", icon: <MaterialsIcon /> },
  { label: "Activities", href: "/Activities", icon: <ActivitiesIcon /> },
  { label: "Categories", href: "/Materials/categories", icon: <Layers size={16} /> },
];"""

c = c.replace(workspace_old, workspace_new)

# Update regex
c = c.replace(r"/^\/(Quotations|Activities|Materials)\/[^/]+$/", r"/^\/(Quotations|Activities|Materials)\/[^/]+$/") # no change needed for editor
c = c.replace(r"/^\/(Quotations|Projects|Materials|Activities)($|\/)/", r"/^\/(Quotations|Projects|Materials|Activities)($|\/)/") # no change needed

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\components\layout\app-shell.tsx", "w", encoding="utf-8") as f:
    f.write(c)

