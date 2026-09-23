
import re

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\components\layout\app-shell.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Update sidebar background and border
content = re.sub(
    r"backgroundColor:\s*THEME\.surface,\s*borderRight:\s*`1px solid \$\{THEME\.hairline\}`",
    "backgroundColor: \"#163848\", borderRight: \"none\"",
    content
)

# Update brand text colors to white/yellow
content = content.replace(
    "style={{ color: THEME.ink }}",
    "className=\"text-white\""
).replace(
    "style={{ color: THEME.deepwater }}",
    "className=\"text-[#D4B86A]\""
)

# Update the Link styles to use white for inactive and gold for active
link_regex = r"""style=\{
                  isActive
                    \? \{ backgroundColor: "#faf5ff", color: "#7e22ce" \}
                    : \{ color: THEME.muted \}
                \}
                onMouseEnter=\{\(e\) => \{
                  if \(!isActive\) \{
                    e.currentTarget.style.backgroundColor = THEME.hoverTint;
                    e.currentTarget.style.color = THEME.deepwater;
                  \}
                \}\}
                onMouseLeave=\{\(e\) => \{
                  if \(!isActive\) \{
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = THEME.muted;
                  \}
                \}\}"""

new_link_style = """style={
                  isActive
                    ? { backgroundColor: "transparent", color: "#D4B86A" }
                    : { color: "#FFFFFF" }
                }
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}"""

content = re.sub(link_regex, new_link_style, content, flags=re.DOTALL)

# Remove the border from active link class
content = content.replace("font-bold rounded-md border border-purple-200", "font-bold rounded-md border-transparent")

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\components\layout\app-shell.tsx", "w", encoding="utf-8") as f:
    f.write(content)

