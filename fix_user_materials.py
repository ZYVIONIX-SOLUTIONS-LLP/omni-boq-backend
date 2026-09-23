
import re

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# For the individual checkboxes:
content = re.sub(
    r"<input\s*type=\"checkbox\"\s*checked=\{selectedIds.has\(p\.id\)\}",
    r"<input type=\"checkbox\" disabled={!getUser()?.roles.includes(\"SUPERADMIN\") && p.isGlobal} checked={selectedIds.has(p.id)}",
    content
)

# Wait, in app/(app)/Materials/page.tsx, is it p.isGlobal or !p.tenantId?
# Let's check if p.isGlobal is used.
if "p.isGlobal" not in content and "p.tenantId" in content:
    content = content.replace("!getUser()?.roles.includes(\"SUPERADMIN\") && p.isGlobal", "!getUser()?.roles.includes(\"SUPERADMIN\") && !p.tenantId")

# Wait, what if they click "Select All"?
# toggleSelectAll will select all items on the page.
# If toggleSelectAll selects disabled checkboxes, they can still delete them!
# Let's find toggleSelectAll and modify it to only select items that are deletable!

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Checkboxes disabled. Now looking for toggleSelectAll...")


