import os

path = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Quotations\page.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

# Replace literal \ " with just "
c = c.replace('className=\\"p-6', 'className="p-6')
c = c.replace('min-h-screen\\">', 'min-h-screen">')

with open(path, "w", encoding="utf-8") as f:
    f.write(c)
