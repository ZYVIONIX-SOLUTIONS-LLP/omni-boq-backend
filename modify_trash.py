
import re

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\superadmin\Materials\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the Trash2 button for individual items
old_trash = """<Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleting(p)}
                            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-red-500"
                            aria-label={`Delete ${p.name || p.modelCode}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>"""

new_trash = """{(getUser()?.roles.includes("SUPERADMIN") || !!p.tenantId) && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleting(p)}
                            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-red-500"
                            aria-label={`Delete ${p.name || p.modelCode}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                          )}"""

content = content.replace(old_trash, new_trash)

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\superadmin\Materials\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

