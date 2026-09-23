
import re

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\src\common\dto\list-query.dto.ts", "r", encoding="utf-8") as f:
    c = f.read()

new_field = """
  @IsOptional()
  @IsString()
  scope?: "global" | "local" | "all";
}"""

c = c.replace("}", new_field)

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\src\common\dto\list-query.dto.ts", "w", encoding="utf-8") as f:
    f.write(c)

