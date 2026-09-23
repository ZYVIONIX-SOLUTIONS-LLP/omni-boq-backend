
import re

# 1. app/(app)/Materials/page.tsx
with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\page.tsx", "r", encoding="utf-8") as f:
    c1 = f.read()

# Remove TableHead
c1 = re.sub(
    r"<TableHead[^>]*?>Status</TableHead>\s*",
    "",
    c1
)

# Remove TableCell
# It looks like:
# <TableCell className="border-r border-purple-100/80 py-2.5">
#   <Badge ...>
#     {p.status}
#   </Badge>
# </TableCell>
c1 = re.sub(
    r"<TableCell[^>]*?>\s*<Badge[\s\S]*?\{p\.status\}\s*</Badge>\s*</TableCell>\s*",
    "",
    c1
)

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\page.tsx", "w", encoding="utf-8") as f:
    f.write(c1)

# 2. app/superadmin/Materials/page.tsx
with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\superadmin\Materials\page.tsx", "r", encoding="utf-8") as f:
    c2 = f.read()

c2 = re.sub(
    r"<TableHead[^>]*?>Status</TableHead>\s*",
    "",
    c2
)

c2 = re.sub(
    r"<TableCell[^>]*?>\s*<Badge[\s\S]*?\{p\.status\}\s*</Badge>\s*</TableCell>\s*",
    "",
    c2
)

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\superadmin\Materials\page.tsx", "w", encoding="utf-8") as f:
    f.write(c2)


