
import re

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\src\catalog\categories\categories.controller.ts", "r", encoding="utf-8") as f:
    c = f.read()

# Add Request to imports
c = c.replace("import { Body, Controller,", "import { Body, Controller, Request,")

# Update list
old_list = """  @Get()
  list(@Query() query: ListQueryDto) {
    return this.service.list(query);
  }"""
new_list = """  @Get()
  @UseGuards(JwtAuthGuard)
  list(@Query() query: ListQueryDto, @Request() req: any) {
    return this.service.list(query, req.user);
  }"""
c = c.replace(old_list, new_list)

# Update create
old_create = """  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateCategoryDto) {
    return this.service.create(dto);
  }"""
new_create = """  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateCategoryDto, @Request() req: any) {
    const data = { ...dto } as any;
    if (req.user.role !== "SUPERADMIN") {
        data.tenantId = req.user.adminId || req.user.id;
    }
    return this.service.create(data);
  }"""
c = c.replace(old_create, new_create)

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\src\catalog\categories\categories.controller.ts", "w", encoding="utf-8") as f:
    f.write(c)

