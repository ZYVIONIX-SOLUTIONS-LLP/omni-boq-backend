
with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\superadmin\Materials\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("type=\\\"checkbox\\\"", "type=\"checkbox\"")
content = content.replace("includes(\\\"SUPERADMIN\\\")", "includes(\"SUPERADMIN\")")
content = content.replace("variant=\\\"ghost\\\"", "variant=\"ghost\"")
content = content.replace("size=\\\"icon\\\"", "size=\"icon\"")
content = content.replace("className=\\\"h-8", "className=\"h-8")
content = content.replace("hover:text-red-500\\\"", "hover:text-red-500\"")
content = content.replace("className=\\\"h-3.5", "className=\"h-3.5")
content = content.replace("w-3.5\\\"", "w-3.5\"")

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\superadmin\Materials\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

