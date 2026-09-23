
import re

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\categories\page.tsx", "r", encoding="utf-8") as f:
    c = f.read()

# Disable buttons when scope is global
c = c.replace("<Button\n              onClick={() => openCatForm(null)}", "<Button\n              disabled={scope === \"global\"}\n              onClick={() => openCatForm(null)}")

c = c.replace("<Button\n              variant=\"outline\"\n              onClick={() => setImportOpen(true)}", "<Button\n              variant=\"outline\"\n              disabled={scope === \"global\"}\n              onClick={() => setImportOpen(true)}")

c = c.replace("<Button\n                  onClick={() => openCatForm(c)}\n                  variant=\"ghost\"", "<Button\n                  disabled={scope === \"global\"}\n                  onClick={() => openCatForm(c)}\n                  variant=\"ghost\"")

c = c.replace("<Button\n                  onClick={(e) => {\n                    e.stopPropagation();\n                    setDeletingCat(c);\n                  }}\n                  variant=\"ghost\"", "<Button\n                  disabled={scope === \"global\"}\n                  onClick={(e) => {\n                    e.stopPropagation();\n                    setDeletingCat(c);\n                  }}\n                  variant=\"ghost\"")

c = c.replace("<Button\n                    variant=\"secondary\"\n                    className=\"h-9 gap-2 shrink-0 rounded-xl\"\n                    onClick={() => addSpec()}", "<Button\n                    disabled={scope === \"global\"}\n                    variant=\"secondary\"\n                    className=\"h-9 gap-2 shrink-0 rounded-xl\"\n                    onClick={() => addSpec()}")

c = c.replace("<Button\n                          variant=\"ghost\"\n                          size=\"icon\"\n                          className=\"h-7 w-7 text-muted-foreground\"\n                          onClick={() => openSpecEdit(s)}", "<Button\n                          disabled={scope === \"global\"}\n                          variant=\"ghost\"\n                          size=\"icon\"\n                          className=\"h-7 w-7 text-muted-foreground\"\n                          onClick={() => openSpecEdit(s)}")

c = c.replace("<Button\n                          variant=\"ghost\"\n                          size=\"icon\"\n                          className=\"h-7 w-7 text-destructive hover:text-destructive\"\n                          onClick={() => setDeletingSpec(s)}", "<Button\n                          disabled={scope === \"global\"}\n                          variant=\"ghost\"\n                          size=\"icon\"\n                          className=\"h-7 w-7 text-destructive hover:text-destructive\"\n                          onClick={() => setDeletingSpec(s)}")

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\categories\page.tsx", "w", encoding="utf-8") as f:
    f.write(c)

