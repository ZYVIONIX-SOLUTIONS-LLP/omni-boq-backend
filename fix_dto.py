import os
import re

path = r"src\quotations\dto.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

# Add Min, Max to imports if not there
if "Min," not in c:
    c = c.replace('IsNumber,', 'IsNumber,\n  Min,\n  Max,')

# Add validation to QuotationItemDto
c = re.sub(r'(@IsOptional\(\)\s*@IsNumber\(\)\s*)discountPct\?: number;', r'\1@Min(0)\n  @Max(100)\n  discountPct?: number;', c)
c = re.sub(r'(@IsOptional\(\)\s*@IsNumber\(\)\s*)profitPct\?: number;', r'\1@Min(0)\n  @Max(100)\n  profitPct?: number;', c)
c = re.sub(r'(@IsOptional\(\)\s*@IsNumber\(\)\s*)taxRate\?: number;', r'\1@IsIn([0, 5, 12, 18, 28, 3, 0.25])\n  taxRate?: number;', c)

with open(path, "w", encoding="utf-8") as f:
    f.write(c)
