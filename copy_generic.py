import os
import shutil

backend_src = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\src"
superadmin_src = os.path.join(backend_src, "superadmin")

generic_src = os.path.join(backend_src, "catalog", "generic")
generic_dst = os.path.join(superadmin_src, "catalog", "generic")
if os.path.exists(generic_src):
    shutil.copytree(generic_src, generic_dst, dirs_exist_ok=True)
