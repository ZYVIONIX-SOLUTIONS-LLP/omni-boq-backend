import os
import re

files = [
    r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\components\layout\app-shell.tsx",
    r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\components\layout\superadmin-shell.tsx"
]

for path in files:
    with open(path, "r", encoding="utf-8") as f:
        c = f.read()

    # <p className="text-sm font-bold truncate" className="text-white"> -> <p className="text-sm font-bold truncate text-white">
    c = c.replace('className="text-sm font-bold truncate" className="text-white"', 'className="text-sm font-bold truncate text-white"')
    c = c.replace('className="text-[10px] font-semibold truncate" className="text-[#D4B86A]"', 'className="text-[10px] font-semibold truncate text-[#D4B86A]"')
    c = c.replace('className="h-7 w-7 rounded-lg flex-shrink-0"\n            className="text-slate-300"', 'className="h-7 w-7 rounded-lg flex-shrink-0 text-slate-300"')
    c = c.replace('className="w-10 h-10 rounded-full border border-slate-200/50 bg-slate-100 flex items-center justify-center"\n              className="bg-white/10 border-white/20"', 'className="w-10 h-10 rounded-full border border-slate-200/50 bg-slate-100 flex items-center justify-center bg-white/10 border-white/20"')
    c = c.replace('className="text-sm font-bold truncate"\n                  className="text-white"', 'className="text-sm font-bold truncate text-white"')
    c = c.replace('className="text-xs truncate opacity-80"\n                  className="text-slate-300"', 'className="text-xs truncate opacity-80 text-slate-300"')

    with open(path, "w", encoding="utf-8") as f:
        f.write(c)

print("Fixed duplicate classNames!")
