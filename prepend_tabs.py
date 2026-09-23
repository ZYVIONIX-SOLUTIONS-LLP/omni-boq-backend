
with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\categories\page.tsx", "r", encoding="utf-8") as f:
    c = f.read()

if "TabsList" not in c or "import { Tabs" not in c:
    c = "import { Tabs, TabsList, TabsTrigger, TabsContent } from \"@/components/ui/tabs\";\n" + c

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\categories\page.tsx", "w", encoding="utf-8") as f:
    f.write(c)

