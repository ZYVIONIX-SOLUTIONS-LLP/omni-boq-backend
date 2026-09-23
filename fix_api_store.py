
import re

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\lib\catalog\api.ts", "r", encoding="utf-8") as f:
    c = f.read()

old_query = """        const query = toQueryString({
        page: params.page,
        limit: params.limit,
        search: params.search,
        includeInactive: params.includeInactive,
        ...(params.filter as Record<string, unknown> | undefined),
      });"""

new_query = """        const query = toQueryString({
        page: params.page,
        limit: params.limit,
        search: params.search,
        includeInactive: params.includeInactive,
        scope: (params as any).scope,
        ...(params.filter as Record<string, unknown> | undefined),
      });"""

c = c.replace(old_query, new_query)

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\lib\catalog\api.ts", "w", encoding="utf-8") as f:
    f.write(c)

