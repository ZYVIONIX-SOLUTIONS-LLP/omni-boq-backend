
with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\components\layout\app-shell.tsx", "r", encoding="utf-8") as f:
    content = f.read()

header_html = """
      {/* Top Navbar */}
      {!isFullscreen && (
        <header
          className="fixed top-0 right-0 h-[70px] z-20 flex items-center justify-between px-8 shadow-sm transition-[left] duration-200"
          style={{
            left: sidebarWidth,
            backgroundColor: "#163848",
          }}
        >
          <h1 className="text-xl font-bold text-white tracking-tight">{pathname === "/Dashboard" ? "Dashboard" : visibleNavItems.find(i => pathname.startsWith(i.href))?.label || "Workspace"}</h1>
          <button className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>
        </header>
      )}
"""

content = content.replace("<main", header_html + "      <main")

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\components\layout\app-shell.tsx", "w", encoding="utf-8") as f:
    f.write(content)

