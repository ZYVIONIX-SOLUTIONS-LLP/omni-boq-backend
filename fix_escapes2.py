
with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace("TableCell className=\\\"min-w", "TableCell className=\"min-w")
content = content.replace("py-2.5\\\"", "py-2.5\"")
content = content.replace("p className=\\\"text-sm", "p className=\"text-sm")
content = content.replace("leading-snug\\\"", "leading-snug\"")
with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\superadmin\Materials\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace("TableCell className=\\\"min-w", "TableCell className=\"min-w")
content = content.replace("break-words\\\"", "break-words\"")
content = content.replace("p className=\\\"text-sm", "p className=\"text-sm")
content = content.replace("leading-snug\\\"", "leading-snug\"")
with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\superadmin\Materials\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

