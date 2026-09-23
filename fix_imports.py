
with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\components\layout\app-shell.tsx", "r", encoding="utf-8") as f:
    c = f.read()

# Fix all the messed up imports
c = c.replace("import { Layers, ", "import { ")

# Then add it correctly just for lucide-react
import re
c = re.sub(
    r"import \{([^}]*)\} from \"lucide-react\";",
    r"import { \1, Layers } from \"lucide-react\";",
    c
)

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\components\layout\app-shell.tsx", "w", encoding="utf-8") as f:
    f.write(c)

