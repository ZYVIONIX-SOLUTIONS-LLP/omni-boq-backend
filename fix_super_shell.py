import os
import re

path = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\components\layout\superadmin-shell.tsx"
with open(path, "r", encoding="utf-16") as f:
    c = f.read()

new_nav = """const NAV_ITEMS = [
  { label: "Admins", href: "/superadmin/Admins", icon: <ShieldCheck className="w-[18px] h-[18px]" /> },
];"""
c = re.sub(r"const NAV_ITEMS = \[.*?\];", new_nav, c, flags=re.DOTALL)

new_settings = """const SETTINGS_ITEMS: any[] = [];"""
c = re.sub(r"const SETTINGS_ITEMS = \[.*?\];", new_settings, c, flags=re.DOTALL)

c = c.replace("export default function AppShell(", "export default function SuperAdminShell(")
c = c.replace('"/Login"', '"/SuperAdminLogin"')

with open(path, "w", encoding="utf-8") as f:
    f.write(c)
