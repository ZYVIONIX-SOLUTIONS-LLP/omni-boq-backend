
import re

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\categories\page.tsx", "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("const [search, setSearch] = useState(\"\");", "const [search, setSearch] = useState(\"\");\n  const [scope, setScope] = useState<\"local\" | \"global\">(\"local\");")

c = c.replace("categoriesApi.list({ search: search || undefined, limit: 500 });", "categoriesApi.list({ search: search || undefined, limit: 500, scope } as any);")

c = c.replace("}, [search]);", "}, [search, scope]);")

# Add Tabs imports
if "TabsList" not in c:
    c = c.replace("import { Card,", "import { Tabs, TabsList, TabsTrigger, TabsContent } from \"@/components/ui/tabs\";\nimport { Card,")


# Find the return (
#       <div className="px-7 py-6 space-y-5">
#         <div className="flex flex-wrap items-center justify-between gap-3">
old_ui = """  return (
    <div className="px-7 py-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">"""

new_ui = """  return (
    <div className="px-7 py-6 space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Categories & Specifications</h1>
          <p className="text-muted-foreground">Manage your custom catalog categories</p>
        </div>
      </div>
      
      <Tabs value={scope} onValueChange={(val) => setScope(val as any)} className="w-full">
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center mb-4">
          <TabsList className="bg-white/50 border border-slate-200 p-1">
            <TabsTrigger value="local" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900">
              My Categories
            </TabsTrigger>
            <TabsTrigger value="global" className="data-[state=active]:bg-slate-200 data-[state=active]:text-slate-900">
              Global Categories
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value={scope} className="m-0 space-y-5">
      
      <div className="flex flex-wrap items-center justify-between gap-3">"""

# Replace exactly
c = re.sub(r"  return \(\n\s*<div className=\"px-7 py-6 space-y-5\">\n\s*<div className=\"flex flex-wrap items-center justify-between gap-3\">", new_ui, c)

# Close the TabsContent and Tabs
# Search for <ImportCategoriesDialog... />
# </div>
# );

old_end = """        />
      )}
    </div>
  );
}"""

new_end = """        />
      )}
        </TabsContent>
      </Tabs>
    </div>
  );
}"""

c = c.replace(old_end, new_end)

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\categories\page.tsx", "w", encoding="utf-8") as f:
    f.write(c)

