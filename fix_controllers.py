
import os
import re

backend_src = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\src"
for root, dirs, files in os.walk(os.path.join(backend_src, "catalog")):
    for file in files:
        if file.endswith(".controller.ts"):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                c = f.read()
            
            # Replace:
            # if (req.user.role !== "SUPERADMIN") {
            #     data.tenantId = req.user.adminId || req.user.id;
            # }
            # With just:
            # data.tenantId = req.user.adminId || req.user.id;
            
            c = re.sub(r"if\s*\(req\.user\.role !== [\"']SUPERADMIN[\"']\)\s*\{\s*(data\.tenantId = req\.user\.adminId \|\| req\.user\.id;)\s*\}", r"\1", c)
            
            with open(path, "w", encoding="utf-8") as f:
                f.write(c)

print("Controllers fixed!")

