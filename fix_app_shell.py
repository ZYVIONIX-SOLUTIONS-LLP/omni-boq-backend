import os

path = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\components\layout\app-shell.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace(
  "{ label: \"Settings\", href: \"/Settings\", icon: <SettingsIcon /> },",
  "{ label: \"Company\", href: \"/Company/information\", icon: <SettingsIcon /> },"
)

# Add COMPANY_NAV_ITEMS
company_nav = """
const COMPANY_NAV_ITEMS = [
  { label: "Company Information", href: "/Company/information", icon: <SettingsIcon /> },
  { label: "Documents", href: "/Company/documents", icon: <Layers size={16} /> },
];
"""
c = c.replace("const WORKSPACE_NAV_ITEMS", company_nav + "\nconst WORKSPACE_NAV_ITEMS")

# Add isCompanyContext
c = c.replace(
  "const isWorkspaceContext = /^\\/(Quotations|Projects|Materials|Activities)($|\\/)/.test(pathname);",
  "const isWorkspaceContext = /^\\/(Quotations|Projects|Materials|Activities)($|\\/)/.test(pathname);\n  const isCompanyContext = /^\\/(Company)($|\\/)/.test(pathname);"
)

# Update visibleNavItems
visible_nav_logic = """
    if (isWorkspaceContext) {
      return WORKSPACE_NAV_ITEMS;
    }
    if (isCompanyContext) {
      return COMPANY_NAV_ITEMS;
    }
"""
c = c.replace("if (isWorkspaceContext) {\n      return WORKSPACE_NAV_ITEMS;\n    }", visible_nav_logic.strip())

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("app-shell.tsx updated")
