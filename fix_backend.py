
import re

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\src\catalog\products\products.service.ts", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update ListProductsParams
content = content.replace("scope?: 'global' | 'local' | 'all';", "scope?: 'global' | 'local' | 'all';\n  attributes?: string;")

# 2. Add filtering logic before findMany
filtering = """
    if (params.attributes) {
      try {
        const parsedAttrs = JSON.parse(params.attributes);
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
            (where.AND as any[]).push({ OR: orConditions });
          }
        }
      } catch (e) {
      }
    }
"""

content = content.replace("const [products, totalItems] = await Promise.all([", filtering + "\n    const [products, totalItems, allAgg] = await Promise.all([")

# 3. Add allAgg to Promise.all
allAgg = """
      this.prisma.productModel.findMany({
        where,
        select: {
          categoryId: true,
          attributes: true,
          series: true,
          category: { select: { name: true } }
        }
      })
"""
content = content.replace("this.prisma.productModel.count({ where }),\n    ]);", "this.prisma.productModel.count({ where })," + allAgg + "    ]);")

# 4. Add aggregation logic
agg_logic = """
    const categoryAgg: Record<string, { categoryId: string, categoryName: string, attrs: Record<string, Set<string>>, series: Set<string> }> = {};
    const categoryIds = new Set<string>();

    for (const p of allAgg) {
      if (!p.categoryId) continue;
      if (!categoryAgg[p.categoryId as string]) {
        categoryAgg[p.categoryId as string] = {
          categoryId: p.categoryId,
          categoryName: p.category?.name || "",
          attrs: {},
          series: new Set<string>()
        };
        categoryIds.add(p.categoryId);
      }
      
      const attrs = p.attributes as Record<string, any>;
      if (attrs && typeof attrs === "object") {
        for (const [attrId, val] of Object.entries(attrs)) {
          if (val === null || val === undefined || val === "") continue;

          if (!categoryAgg[p.categoryId as string].attrs[attrId]) {
            categoryAgg[p.categoryId as string].attrs[attrId] = new Set<string>();
          }

          if (Array.isArray(val)) {
            val.forEach(v => {
              if (v !== null && v !== undefined && v !== "")
                categoryAgg[p.categoryId as string].attrs[attrId].add(String(v));
            });
          } else {
            categoryAgg[p.categoryId as string].attrs[attrId].add(String(val));
          }
        }
      }
      if (p.series) {
        categoryAgg[p.categoryId as string].series.add(String(p.series));
      }
    }

    const attributeDefs = await this.prisma.attributeDef.findMany({
      where: { categoryId: { in: Array.from(categoryIds) } },
      select: { id: true, name: true, categoryId: true, sortOrder: true }
    });
    const attrNameMap = new Map(attributeDefs.map(a => [a.id, a]));

    const filters = {
      categories: Object.values(categoryAgg).map(cat => {
        const catAttrs: any[] = [];
        for (const [attrId, valueSet] of Object.entries(cat.attrs)) {
          const def = attrNameMap.get(attrId);
          if (def) {
            catAttrs.push({
              id: attrId,
              name: def.name,
              sortOrder: def.sortOrder,
              values: Array.from(valueSet).sort()
            });
          }
        }
        return {
          categoryId: cat.categoryId,
          categoryName: cat.categoryName,
          series: Array.from(cat.series ?? new Set<string>()).sort(),
          attributes: catAttrs.sort((a, b) => a.sortOrder - b.sortOrder).map(a => ({ id: a.id, name: a.name, values: a.values }))
        };
      }).sort((a, b) => a.categoryName.localeCompare(b.categoryName))
    };
"""
content = content.replace("const items = products.map((p) => this.toListRow(p));\n    return { items, meta: buildPageMeta(totalItems, page, limit) };", agg_logic + "\n    const items = products.map((p) => this.toListRow(p));\n    return { items, meta: buildPageMeta(totalItems, page, limit), filters };")

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\src\catalog\products\products.service.ts", "w", encoding="utf-8") as f:
    f.write(content)

