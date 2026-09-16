
import re

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\src\catalog\products\products.controller.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("@Query(\"scope\") scope?: \"global\" | \"local\" | \"all\",", "@Query(\"scope\") scope?: \"global\" | \"local\" | \"all\",\n    @Query(\"attributes\") attributes?: string,")
content = content.replace("scope,\n    }, req.user);", "scope,\n      attributes,\n    }, req.user);")

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\src\catalog\products\products.controller.ts", "w", encoding="utf-8") as f:
    f.write(content)

