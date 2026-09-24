import os
import re

files = [
    r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\page.tsx",
    r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\categories\page.tsx",
    r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\manufacturers\page.tsx",
    r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Activities\page.tsx"
]

for path in files:
    if not os.path.exists(path): continue
    with open(path, "r", encoding="utf-8") as f:
        c = f.read()

    # Remove scope state
    c = re.sub(r"const \[scope, setScope\] = useState<\"local\" \| \"global\">.*?;", "", c)
    c = re.sub(r"const \[scope, setScope\] = useState<any>\(.*?;", "", c)
    
    # Remove scope from API calls
    c = re.sub(r"scope: \"local\",?", "", c)
    c = re.sub(r"scope: scope,", "", c)
    c = re.sub(r"scope,", "", c)
    
    # Remove Tabs from UI
    # In some pages, Tabs are wrapping the whole thing.
    # Actually, in Materials page:
    # <Tabs value={scope} onValueChange={(val) => { setScope(val as any); setPage(1); }}>
    #   <TabsList ...> ... </TabsList>
    # </Tabs>
    # Let's just remove the entire Tabs block
    c = re.sub(r"<Tabs value=\{scope\}.*?</Tabs>", "", c, flags=re.DOTALL)
    
    # Wait, in Materials/page.tsx, it might just be the TabsList and we should keep the title.
    # I'll just use a regex to match the Tabs component.
    c = re.sub(r"<Tabs value=\{scope\}.*?<TabsList.*?</TabsList>\s*</Tabs>", "", c, flags=re.DOTALL)

    with open(path, "w", encoding="utf-8") as f:
        f.write(c)

print("Pages updated!")
