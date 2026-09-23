
with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Dashboard\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace lg:col-span-2 with lg:col-span-3 for the table
content = content.replace("lg:col-span-2 bg-white rounded-2xl p-6", "lg:col-span-3 bg-white rounded-2xl p-6")

# Remove the promo card block
import re
promo_regex = r"\{/\* Promotional / Action Card \*/\}.*?</Link>\s*</div>"
content = re.sub(promo_regex, "", content, flags=re.DOTALL)

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Dashboard\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

try:
    with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\superadmin\Dashboard\page.tsx", "w", encoding="utf-8") as f:
        f.write(content.replace("/Quotations", "/superadmin/Quotations").replace("/Materials", "/superadmin/Materials").replace("/Staff", "/superadmin/Staff").replace("/Activities", "/superadmin/Activities"))
except:
    pass

