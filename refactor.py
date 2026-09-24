import os
import shutil
import re

backend_src = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\src"
superadmin_src = os.path.join(backend_src, "superadmin")

# 1. Copy folders
folders_to_copy = ["catalog", "activities", "users"]
for f in folders_to_copy:
    src_dir = os.path.join(backend_src, f)
    dst_dir = os.path.join(superadmin_src, f)
    if os.path.exists(src_dir):
        shutil.copytree(src_dir, dst_dir, dirs_exist_ok=True)

# 2. Process superadmin files
for root, dirs, files in os.walk(superadmin_src):
    for file in files:
        if file.endswith(".ts"):
            filepath = os.path.join(root, file)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()

            # Change @Controller routes
            content = re.sub(r"@Controller\(['\"]catalog/(.*?)['\"]\)", r"@Controller('superadmin/catalog/\1')", content)
            content = re.sub(r"@Controller\(['\"]activities['\"]\)", r"@Controller('superadmin/activities')", content)
            content = re.sub(r"@Controller\(['\"]users['\"]\)", r"@Controller('superadmin/users')", content)

            # Rename classes to avoid collision
            content = re.sub(r"class (\w+Controller)", r"class Superadmin\1", content)
            content = re.sub(r"class (\w+Service)", r"class Superadmin\1", content)
            content = re.sub(r"class (\w+Module)", r"class Superadmin\1", content)
            
            # Update generic crud service references
            content = content.replace("GenericCrudService", "SuperadminGenericCrudService")

            with open(filepath, "w", encoding="utf-8") as f:
                f.write(content)

# 3. Register modules in app.module.ts
app_module_path = os.path.join(backend_src, "app.module.ts")
with open(app_module_path, "r", encoding="utf-8") as f:
    app_module = f.read()

superadmin_imports = """
import { SuperadminCategoriesModule } from './superadmin/catalog/categories/categories.module';
import { SuperadminManufacturersModule } from './superadmin/catalog/manufacturers/manufacturers.module';
import { SuperadminProductsModule } from './superadmin/catalog/products/products.module';
import { SuperadminAttributeDefsModule } from './superadmin/catalog/attribute-defs/attribute-defs.module';
import { SuperadminActivitiesModule } from './superadmin/activities/activities.module';
import { SuperadminUsersModule } from './superadmin/users/users.module';
"""

if "SuperadminCategoriesModule" not in app_module:
    app_module = superadmin_imports + app_module
    imports_match = re.search(r"imports:\s*\[([\s\S]*?)\]", app_module)
    if imports_match:
        old_imports = imports_match.group(1)
        new_imports = old_imports + ",\n    SuperadminCategoriesModule,\n    SuperadminManufacturersModule,\n    SuperadminProductsModule,\n    SuperadminAttributeDefsModule,\n    SuperadminActivitiesModule,\n    SuperadminUsersModule"
        app_module = app_module.replace(old_imports, new_imports)

with open(app_module_path, "w", encoding="utf-8") as f:
    f.write(app_module)

print("Backend duplicated and renamed!")
