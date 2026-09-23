
import re

def fix(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        c = f.read()

    # Find the block
    old_trigger = """<DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 rounded-none hover:bg-purple-100/50">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4 text-slate-500" />
                            </Button>
                          </DropdownMenuTrigger>"""

    new_trigger = """<DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 p-0 rounded-none hover:bg-purple-100/50 text-slate-500 transition-colors">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                          </DropdownMenuTrigger>"""

    c = c.replace(old_trigger, new_trigger)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(c)

fix(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\page.tsx")
fix(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\superadmin\Materials\page.tsx")

