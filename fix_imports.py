import os
import re

superadmin_src = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\src\superadmin"

for root, dirs, files in os.walk(superadmin_src):
    for file in files:
        if file.endswith(".ts"):
            filepath = os.path.join(root, file)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()

            # Fix relative imports by adding one more level of depth '../'
            def fix_relative(match):
                path = match.group(2)
                if path.startswith("."):
                    if not path.startswith("./"): # i.e. ../ or ../../
                        return match.group(1) + "../" + path + match.group(3)
                return match.group(0)

            content = re.sub(r"(from\s+['\"])(.+?)(['\"])", fix_relative, content)

            # Fix class name imports
            content = re.sub(r"([A-Z]\w+Controller)", r"Superadmin\1", content)
            content = re.sub(r"([A-Z]\w+Service)", r"Superadmin\1", content)
            content = re.sub(r"([A-Z]\w+Module)", r"Superadmin\1", content)
            
            # Avoid double prefixing if it already happened
            content = content.replace("SuperadminSuperadmin", "Superadmin")

            # But wait, PrismaService, JwtAuthGuard etc. should NOT be prefixed!
            # Let's revert Superadmin prefix for known external classes
            content = content.replace("SuperadminPrismaService", "PrismaService")
            content = content.replace("SuperadminUsersService", "UsersService") # wait, users is also duplicated! So SuperadminUsersService is correct for the duplicated one!
            
            # But what about the original UsersService if it's imported? 
            # Actually, the python regex ([A-Z]\w+Service) prefixes EVERY service. 
            # JwtService -> SuperadminJwtService (Wrong)
            # ConfigService -> SuperadminConfigService (Wrong)
            content = content.replace("SuperadminJwtService", "JwtService")
            content = content.replace("SuperadminConfigService", "ConfigService")
            content = content.replace("SuperadminAuthService", "AuthService") # We didn't duplicate auth

            with open(filepath, "w", encoding="utf-8") as f:
                f.write(content)

print("Fixed relative imports and class imports!")
