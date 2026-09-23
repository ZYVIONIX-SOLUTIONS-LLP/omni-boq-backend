
import re

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\prisma\schema.prisma", "r", encoding="utf-8") as f:
    c = f.read()

old_schema = """model Manufacturer {
  id             String         @id @default(cuid())
  name           String
  description    String?
  createdAt      DateTime       @default(now())
  isActive       Boolean        @default(true)
  nameNormalized String         @unique
  updatedAt      DateTime       @updatedAt
  products       ProductModel[]

  @@map("manufacturers")
}"""

new_schema = """model Manufacturer {
  id             String         @id @default(cuid())
  name           String
  description    String?
  createdAt      DateTime       @default(now())
  isActive       Boolean        @default(true)
  nameNormalized String
  tenantId       String?
  updatedAt      DateTime       @updatedAt
  products       ProductModel[]

  @@unique([tenantId, nameNormalized])
  @@index([tenantId])
  @@map("manufacturers")
}"""

c = c.replace(old_schema, new_schema)

with open(r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\prisma\schema.prisma", "w", encoding="utf-8") as f:
    f.write(c)

