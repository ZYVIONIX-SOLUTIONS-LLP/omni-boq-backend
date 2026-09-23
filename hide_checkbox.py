
import re

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# We need to conditionally render the TH and TD for checkboxes
# TableHead checkbox:
th_checkbox = """<TableHead className="w-10 pl-5">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    aria-label="Select all products"
                    className="h-3.5 w-3.5 rounded-none border-purple-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                </TableHead>"""

new_th_checkbox = """{!(scope === "global" && !getUser()?.roles.includes("SUPERADMIN")) && (
                <TableHead className="w-10 pl-5">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    aria-label="Select all products"
                    className="h-3.5 w-3.5 rounded-none border-purple-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                </TableHead>
                )}"""

content = content.replace(th_checkbox, new_th_checkbox)

# TableCell checkbox:
td_checkbox = """<TableCell className="pl-5 border-r border-purple-100/80 py-2.5">
                      <input type="checkbox" checked={selectedIds.has(p.id)}
                        onChange={() => toggleSelect(p.id)}
                        disabled={isGlobal && !getUser()?.roles.includes("SUPERADMIN")}
                        aria-label={`Select ${p.name || p.modelCode}`}
                        className="h-3.5 w-3.5 rounded-none border-purple-300 text-purple-600 focus:ring-purple-500 cursor-pointer disabled:opacity-30"
                      />
                    </TableCell>"""

new_td_checkbox = """{!(scope === "global" && !getUser()?.roles.includes("SUPERADMIN")) && (
                    <TableCell className="pl-5 border-r border-purple-100/80 py-2.5">
                      <input type="checkbox" checked={selectedIds.has(p.id)}
                        onChange={() => toggleSelect(p.id)}
                        disabled={isGlobal && !getUser()?.roles.includes("SUPERADMIN")}
                        aria-label={`Select ${p.name || p.modelCode}`}
                        className="h-3.5 w-3.5 rounded-none border-purple-300 text-purple-600 focus:ring-purple-500 cursor-pointer disabled:opacity-30"
                      />
                    </TableCell>
                    )}"""

content = content.replace(td_checkbox, new_td_checkbox)

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

