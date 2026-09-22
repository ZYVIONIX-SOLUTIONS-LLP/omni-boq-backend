
with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\superadmin\Materials\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    "import { categoriesApi, CatalogCategory } from \"@/app/lib/catalog/api\";",
    "import { categoriesApi } from \"@/app/lib/catalog/api\";\nimport { CatalogCategory } from \"@/app/lib/catalog/types\";"
)

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\superadmin\Materials\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

