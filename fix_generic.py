
import re

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\src\catalog\generic\generic-crud.service.ts", "r", encoding="utf-8") as f:
    c = f.read()

# Add scope to GenericListParams
c = c.replace("includeInactive?: boolean;", "includeInactive?: boolean;\n  scope?: \"global\" | \"local\" | \"all\";")

# Add user? to list
c = c.replace("async list(params: GenericListParams): Promise<{ items: T[]; meta: PageMeta }> {", "async list(params: GenericListParams, user?: any): Promise<{ items: T[]; meta: PageMeta }> {")

# Add tenant logic to list
logic = """    if (user?.role === "SUPERADMIN") {
      where.tenantId = null;
    } else if (user && "tenantId" in this.delegate.fields) {
      const tId = user.adminId || user.id;
      if (params.scope === "global") {
        where.tenantId = null;
      } else if (params.scope === "local") {
        where.tenantId = tId;
      } else {
        where.OR = [{ tenantId: null }, { tenantId: tId }];
      }
    }
"""
c = c.replace("if (!params.includeInactive) where.isActive = true;", "if (!params.includeInactive) where.isActive = true;\n" + logic)

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\src\catalog\generic\generic-crud.service.ts", "w", encoding="utf-8") as f:
    f.write(c)

