
import re
with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\src\catalog\products\products.service.ts", "r", encoding="utf-8") as f:
    content = f.read()

replacement = """
        for (const [attrId, value] of Object.entries(parsedAttrs)) {
          if (value) {
            let typedValue: any = value;
            if (value === "true") typedValue = true;
            else if (value === "false") typedValue = false;
            else if (!isNaN(Number(value)) && String(value).trim() !== "") typedValue = Number(value);

            const orConditions: any[] = [
              { attributes: { path: [attrId], equals: value } },
              { attributes: { path: [attrId], array_contains: value } }
            ];

            if (typedValue !== value) {
              orConditions.push({ attributes: { path: [attrId], equals: typedValue } });
              orConditions.push({ attributes: { path: [attrId], array_contains: typedValue } });
            }

            if (!where.AND) where.AND = [];
            (where.AND as any[]).push({
              OR: orConditions
            });
          }
        }
"""

# We need to replace the old for loop.
old_for_loop = re.search(r"(for \(const \[attrId, value\] of Object.entries\(parsedAttrs\)\) \{[\s\S]*?\}\s*\n\s*\})", content)
if old_for_loop:
    content = content.replace(old_for_loop.group(1), replacement.strip())
else:
    print("Could not find the for loop!")

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\src\catalog\products\products.service.ts", "w", encoding="utf-8") as f:
    f.write(content)

