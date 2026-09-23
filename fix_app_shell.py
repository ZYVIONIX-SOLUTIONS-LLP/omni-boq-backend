
import re

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\components\layout\app-shell.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix borderTop of user profile area
content = content.replace("style={{ borderTop: `1px solid ${THEME.hairline}` }}", "style={{ borderTop: `1px solid rgba(255,255,255,0.1)` }}")

# Fix user profile text colors
content = content.replace("style={{ color: THEME.muted }}", "className=\"text-slate-300\"").replace("style={{ color: THEME.ink }}", "className=\"text-white\"")

# Fix logout button styling
content = content.replace("style={{ borderColor: THEME.hairline, color: THEME.muted }}", "style={{ borderColor: \"rgba(255,255,255,0.2)\", color: \"#ffffff\" }}")

# Fix button ghost (the toggle sidebar icon)
content = content.replace("style={{ color: THEME.muted }}", "className=\"text-slate-300\"")

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\components\layout\app-shell.tsx", "w", encoding="utf-8") as f:
    f.write(content)

