
with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\src\quotations\quotations.service.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("quotationCode = ${baseCode}-R${nextRev};", "quotationCode = `${baseCode}-R${nextRev}`;")
content = content.replace("quotationCode = ${baseCode}-R;", "quotationCode = `${baseCode}-R${nextRev}`;")

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\src\quotations\quotations.service.ts", "w", encoding="utf-8") as f:
    f.write(content)

