
import re

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\superadmin\Materials\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the Trash2 button for individual items
content = re.sub(
    r"<Button[^>]*?onClick=\{\(\) => setDeleting\(p\)\}[^>]*?>\s*<Trash2 className=\"h-3.5 w-3.5\" />\s*</Button>",
    r"{(getUser()?.roles.includes(\"SUPERADMIN\") || !!p.tenantId) && (<Button variant=\"ghost\" size=\"icon\" onClick={() => setDeleting(p)} className=\"h-8 w-8 rounded-lg text-muted-foreground hover:text-red-500\" aria-label={`Delete ${p.name || p.modelCode}`}><Trash2 className=\"h-3.5 w-3.5\" /></Button>)}",
    content
)

# Disable checkbox if global and not superadmin
content = re.sub(
    r"<input\s*type=\"checkbox\"\s*checked=\{selectedIds.has\(p\.id\)\}",
    r"<input type=\"checkbox\" disabled={!getUser()?.roles.includes(\"SUPERADMIN\") && !p.tenantId} checked={selectedIds.has(p.id)}",
    content
)

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\superadmin\Materials\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

