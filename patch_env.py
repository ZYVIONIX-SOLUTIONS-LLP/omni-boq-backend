
import re

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\.env", "r", encoding="utf-8") as f:
    content = f.read()

# Replace Omni%20BOQ with postgres
content = content.replace("Omni%20BOQ?sslmode=require", "postgres?sslmode=require")

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\.env", "w", encoding="utf-8") as f:
    f.write(content)

