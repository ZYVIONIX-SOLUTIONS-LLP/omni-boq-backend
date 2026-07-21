import { Module } from '@nestjs/common';
import { AttributeDefsController } from './attribute-defs.controller';
import { AttributeDefsService } from './attribute-defs.service';

@Module({
  controllers: [AttributeDefsController],
  providers: [AttributeDefsService],
  exports: [AttributeDefsService],
})
export class AttributeDefsModule {}
