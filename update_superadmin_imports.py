
import os

superadmin_dir = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\superadmin"
components_dir = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\components" # Might need some updates there too, e.g. import-categories-dialog.tsx uses api.ts!

for root, dirs, files in os.walk(superadmin_dir):
    for file in files:
        if file.endswith((".ts", ".tsx")):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                c = f.read()
            
            c = c.replace("from \"@/app/lib/catalog/api\"", "from \"@/app/lib/catalog/superadminApi\"")
            
            with open(path, "w", encoding="utf-8") as f:
                f.write(c)

print("Superadmin imports updated!")

