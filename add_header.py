
with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Dashboard\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

header = """      {/* Dashboard Top Navbar */}
      <header className="flex items-center justify-between mb-6">
         <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
         <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-500 hover:text-slate-700">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
         </button>
      </header>
"""

# Insert inside the main container <div className="w-full flex flex-col gap-6">
content = content.replace("<div className=\"w-full flex flex-col gap-6\">", "<div className=\"w-full flex flex-col gap-6\">\n" + header)

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Dashboard\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

