
import os
import shutil
import re

backend_src = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\src"

# 1. Delete superadmin catalog and activities
for folder in ["catalog", "activities"]:
    path = os.path.join(backend_src, "superadmin", folder)
    if os.path.exists(path):
        shutil.rmtree(path)

# 2. Update app.module.ts
app_module_path = os.path.join(backend_src, "app.module.ts")
with open(app_module_path, "r", encoding="utf-8") as f:
    app = f.read()

app = re.sub(r"import \{ SuperadminCatalogModule \}.*?\n", "", app)
app = re.sub(r"import \{ SuperadminActivitiesModule \}.*?\n", "", app)
app = re.sub(r"\s*SuperadminCatalogModule,?", "", app)
app = re.sub(r"\s*SuperadminActivitiesModule,?", "", app)

with open(app_module_path, "w", encoding="utf-8") as f:
    f.write(app)

# 3. Update generic-crud.service.ts
generic_path = os.path.join(backend_src, "catalog", "generic", "generic-crud.service.ts")
with open(generic_path, "r", encoding="utf-8") as f:
    crud = f.read()

# Replace the complicated tenant logic with strict tenant checking
new_tenant_logic = """    if (user && user.role === "SUPERADMIN") {
      // Superadmin has no tenant access in catalog anymore
      where.tenantId = "SUPERADMIN_NO_ACCESS";
    } else if (user && this.scopeFields.includes("tenantId")) {
      where.tenantId = user.adminId || user.id;
    }"""

crud = re.sub(r"    if \(user && user\.role === \"SUPERADMIN\"\).*?    \} else if \(user && this\.scopeFields\.includes\(\"tenantId\"\)\) \{.*?\n    \}", new_tenant_logic, crud, flags=re.DOTALL)

with open(generic_path, "w", encoding="utf-8") as f:
    f.write(crud)

# 4. Update activities.service.ts (if it has custom tenant logic)
act_path = os.path.join(backend_src, "activities", "activities.service.ts")
with open(act_path, "r", encoding="utf-8") as f:
    act = f.read()

new_act_logic = """    if (user && user.role === "SUPERADMIN") {
      where.tenantId = "SUPERADMIN_NO_ACCESS";
    } else if (user) {
      where.tenantId = user.adminId || user.id;
    }"""
act = re.sub(r"    if \(user && user\.role === \"SUPERADMIN\"\).*?    \} else if \(user\) \{.*?\n    \}", new_act_logic, act, flags=re.DOTALL)

with open(act_path, "w", encoding="utf-8") as f:
    f.write(act)

# 5. Remove scope from ListQueryDto
dto_path = os.path.join(backend_src, "common", "dto", "list-query.dto.ts")
with open(dto_path, "r", encoding="utf-8") as f:
    dto = f.read()

dto = re.sub(r"\s*@IsOptional\(\)\s*@IsString\(\)\s*scope\?:.*?;\n", "\n", dto)

with open(dto_path, "w", encoding="utf-8") as f:
    f.write(dto)

print("Backend cleanup complete!")

