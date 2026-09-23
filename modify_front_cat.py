
import re

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\categories\page.tsx", "r", encoding="utf-8") as f:
    c = f.read()

# Add scope state
c = c.replace("const [search, setSearch] = useState(\"\");", "const [search, setSearch] = useState(\"\");\n  const [scope, setScope] = useState<\"local\" | \"global\">(\"local\");")

# Update API call
c = c.replace("await categoriesApi.list({ search: search || undefined, limit: 500 });", "await categoriesApi.list({ search: search || undefined, limit: 500, scope } as any);")

# Update dependency array of loadCategories
c = c.replace("}, [search]);", "}, [search, scope]);")

# Add Tabs to the UI
# We need to find the <Card> and wrap it in Tabs
tabs_import = "import { Tabs, TabsList, TabsTrigger, TabsContent } from \"@/components/ui/tabs\";\n"
if "TabsList" not in c:
    c = c.replace("import { Card, ", tabs_import + "import { Card, ")

old_header = """<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-purple-900">Categories & Specifications</h1>
          <p className="text-muted-foreground">Manage the taxonomy of your material catalog</p>
        </div>"""

new_header = """<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-purple-900">Categories & Specifications</h1>
          <p className="text-muted-foreground">Manage the taxonomy of your material catalog</p>
        </div>
      </div>
      
      <Tabs value={scope} onValueChange={(val) => setScope(val as any)} className="w-full mb-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center mb-4">
          <TabsList className="bg-white/50 border border-purple-100 p-1">
            <TabsTrigger value="local" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900">
              My Categories
            </TabsTrigger>
            <TabsTrigger value="global" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900">
              Global Categories
            </TabsTrigger>
          </TabsList>
"""

c = c.replace(old_header, new_header)

# In the header, there was buttons. The old header had:
# <div className="flex gap-2"> ... </div>
# </div>
# We need to insert the closing Tabs later.

# But wait, it is easier to just find the exact spot and replace it.

