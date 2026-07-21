import { Module } from '@nestjs/common';
import { HsnCodesController } from './hsn-codes.controller';
import { HsnCodesService } from './hsn-codes.service';

@Module({
  controllers: [HsnCodesController],
  providers: [HsnCodesService],
  exports: [HsnCodesService],
})
export class HsnCodesModule {}
