
import { SuperadminUsersModule } from './superadmin/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CompanyDocumentsModule } from './company-documents/company-documents.module';
import { CatalogModule } from './catalog/catalog.module';
import { ActivitiesModule } from './activities/activities.module';
import { QuotationsModule } from './quotations/quotations.module';

import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    CompanyDocumentsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CatalogModule,
    ActivitiesModule,
    QuotationsModule,
    NotificationsModule,
    SuperadminUsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
