
def fix(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    content = content.replace("import { listUsers } from \"@/app/lib/api/users\";", "import { listUsers } from \"@/app/lib/api/auth\";")
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

fix(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\superadmin\Dashboard\page.tsx")
fix(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Dashboard\page.tsx")

