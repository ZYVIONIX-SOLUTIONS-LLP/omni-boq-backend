
with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\prisma\schema.prisma", "r", encoding="utf-8") as f:
    c = f.read()

old_cat = """model CatalogCategory {
  id             String                @id @default(cuid())
  name           String
  description    String?
  createdAt      DateTime              @default(now())
  defaultGstRate Decimal?              @db.Decimal(5, 2)
  hsnCode        String?
  isActive       Boolean               @default(true)
  nameNormalized String                @unique
  updatedAt      DateTime              @updatedAt
  requirements   ActivityRequirement[]
  attributeDefs  AttributeDef[]
  products       ProductModel[]
  subCategories  SubCategory[]

  @@map("catalog_categories")
}"""

new_cat = """model CatalogCategory {
  id             String                @id @default(cuid())
  name           String
  description    String?
  createdAt      DateTime              @default(now())
  defaultGstRate Decimal?              @db.Decimal(5, 2)
  hsnCode        String?
  isActive       Boolean               @default(true)
  nameNormalized String
  tenantId       String?
  updatedAt      DateTime              @updatedAt
  requirements   ActivityRequirement[]
  attributeDefs  AttributeDef[]
  products       ProductModel[]
  subCategories  SubCategory[]

  @@unique([tenantId, nameNormalized])
  @@index([tenantId])
  @@map("catalog_categories")
}"""

c = c.replace(old_cat, new_cat)

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\prisma\schema.prisma", "w", encoding="utf-8") as f:
    f.write(c)

