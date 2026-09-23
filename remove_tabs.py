
import re

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\categories\page.tsx", "r", encoding="utf-8") as f:
    c = f.read()

# Force scope to be just a constant or remove it and use scope: "local"
c = c.replace("const [scope, setScope] = useState<\"local\" | \"global\">(\"local\");", "const scope = \"local\";")
c = c.replace("categoriesApi.list({ search: search || undefined, limit: 500, scope } as any)", "categoriesApi.list({ search: search || undefined, limit: 500, scope: \"local\" } as any)")
c = c.replace("}, [search, scope]);", "}, [search]);")

# Remove tabs UI
old_ui = """      <Tabs value={scope} onValueChange={(val) => setScope(val as any)} className="w-full">
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

new_ui = """      <div className="flex flex-wrap items-center justify-between gap-3">"""

c = c.replace(old_ui, new_ui)

old_end = """        />
      )}
        </TabsContent>
      </Tabs>
    </div>
  );"""

new_end = """        />
      )}
    </div>
  );"""

c = c.replace(old_end, new_end)

# Remove all disabled={scope === "global"} since it is always local
c = c.replace("disabled={scope === \"global\"}\n              ", "")
c = c.replace("disabled={scope === \"global\"}\n                  ", "")
c = c.replace("disabled={scope === \"global\"}\n                    ", "")
c = c.replace("disabled={scope === \"global\"}\n                          ", "")

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\categories\page.tsx", "w", encoding="utf-8") as f:
    f.write(c)

