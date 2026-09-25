import os
import re

md_path = r"C:\Users\pvish\.gemini\antigravity\brain\501c001c-fe35-4a2e-8675-e63e6a3224f4\company-documents-module.md"

with open(md_path, "r", encoding="utf-8") as f:
    content = f.read()

# Extract code blocks
blocks = re.findall(r"### ([^]+)\n`	ypescript\n(.*?)\n`", content, flags=re.DOTALL)

for file_path, code in blocks:
    full_path = os.path.join(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend", file_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(code.strip())
        print(f"Wrote {full_path}")

print("Done extracting!")
