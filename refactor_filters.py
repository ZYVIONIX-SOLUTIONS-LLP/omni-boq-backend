
import re

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add state for the spec modal
state_import = r"const \[isSpecModalOpen, setIsSpecModalOpen\] = useState\(false\);"
if "isSpecModalOpen" not in content:
    content = content.replace("const [deleteBusy, setDeleteBusy] = useState(false);", "const [deleteBusy, setDeleteBusy] = useState(false);\n  const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);")

# 2. Extract the Series and Attribute Selects from the inline flex-wrap div
# The block to replace:
start_pattern = "{selectedCategoryData && selectedCategoryData.series.length > 0 && ("
end_pattern = "<Button onClick={applyFilters}"
import string

idx_start = content.find(start_pattern)
idx_end = content.find(end_pattern)

if idx_start != -1 and idx_end != -1:
    old_inline = content[idx_start:idx_end]
    
    # We will replace old_inline with just a button that opens the modal
    new_inline = """{selectedCategoryData && (selectedCategoryData.series.length > 0 || selectedCategoryData.attributes.length > 0) && (
              <Button onClick={() => setIsSpecModalOpen(true)} variant="outline" className="h-10 rounded-none border-purple-200/80 bg-white/80 shadow-xs text-purple-800 font-semibold">
                Filter by Specs
              </Button>
            )}
            """
    
    content = content[:idx_start] + new_inline + content[idx_end:]

    # 3. Inject the Dialog component containing the old_inline just before the final </div> of the page.
    # Look for `{/* Bulk delete confirmation */}` and inject it before that.
    
    modal_code = f"""
      {{/* Spec Filter Modal */}}
      <Dialog open={{isSpecModalOpen}} onOpenChange={{setIsSpecModalOpen}}>
        <DialogContent className="max-w-md rounded-none border-purple-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Filter by Specifications</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            {old_inline}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="rounded-none border-purple-200"
              onClick={{() => setIsSpecModalOpen(false)}}
            >
              Cancel
            </Button>
            <Button
              className="rounded-none bg-purple-700 hover:bg-purple-800 text-white"
              onClick={{() => {{ applyFilters(); setIsSpecModalOpen(false); }}}}
            >
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
"""
    # Fix the `SelectTrigger` width inside the modal so it's full width
    modal_code = modal_code.replace("w-[160px]", "w-full")
    modal_code = modal_code.replace("w-[140px]", "w-full")

    content = content.replace("{/* Bulk delete confirmation */}", modal_code + "{/* Bulk delete confirmation */}")

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\(app)\Materials\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)


