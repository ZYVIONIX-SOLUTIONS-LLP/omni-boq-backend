
import re

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\components\layout\app-shell.tsx", "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("\\\"lucide-react\\\"", "\"lucide-react\"")

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\components\layout\app-shell.tsx", "w", encoding="utf-8") as f:
    f.write(c)

