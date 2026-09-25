import os

main_ts = "src/main.ts"
with open(main_ts, "r", encoding="utf-8") as f:
    c = f.read()

if "join(__dirname, '..', 'uploads')" not in c:
    c = c.replace("import { NestFactory } from '@nestjs/core';", "import { NestFactory } from '@nestjs/core';\nimport { join } from 'path';\nimport { NestExpressApplication } from '@nestjs/platform-express';")
    c = c.replace("await NestFactory.create(AppModule);", "await NestFactory.create<NestExpressApplication>(AppModule);\n  app.useStaticAssets(join(__dirname, '..', 'uploads'), {\n    prefix: '/uploads/',\n  });")
    
    with open(main_ts, "w", encoding="utf-8") as f:
        f.write(c)
