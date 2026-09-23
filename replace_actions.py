
import re

def update_file(filepath, is_superadmin=False):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Add imports
    import_dropdown = """import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
"""
    if "DropdownMenu" not in content:
        # insert after Lucide imports
        content = content.replace("import Swal from", import_dropdown + "import Swal from")

    if "MoreHorizontal" not in content:
        content = content.replace("Trash2,", "Trash2, MoreHorizontal,")

    # 2. Replace the Actions div
    # In app/(app)/Materials/page.tsx:
    # <div className="flex items-center justify-center gap-1">
    # ...
    # </div>
    # The block ends before </TableCell>
    
    # We will use regex to find the entire div.
    pattern = r"<div className=\"flex items-center justify-center gap-1\">([\s\S]*?)</TableCell>"
    
    match = re.search(pattern, content)
    if not match:
        return

    inner = match.group(1)
    
    # Check for delete button logic
    has_delete = "Trash2" in inner
    
    new_actions = """<DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 rounded-none hover:bg-purple-100/50">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4 text-slate-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-none border-purple-200">
                            <DropdownMenuItem onClick={() => setViewing(p.id)} className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`"""
    
    if is_superadmin:
        new_actions += r"/superadmin/Materials/new?id=${p.id}`)} className=\"cursor-pointer\">"
    else:
        new_actions += r"/Materials/new?id=${p.id}`)} className=\"cursor-pointer\">"
        
    new_actions += """
                              <Pencil className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
"""

    if has_delete:
        if is_superadmin:
            new_actions += """                            {(getUser()?.roles.includes("SUPERADMIN") || !!p.tenantId) && (
                              <DropdownMenuItem onClick={() => setDeleting(p)} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            )}"""
        else:
            new_actions += """                            {!isGlobal && (
                              <DropdownMenuItem onClick={() => setDeleting(p)} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            )}"""

    new_actions += """
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>"""

    content = content[:match.start()] + new_actions + content[match.end():]
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

update_file(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\page.tsx", False)
update_file(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\superadmin\Materials\page.tsx", True)

