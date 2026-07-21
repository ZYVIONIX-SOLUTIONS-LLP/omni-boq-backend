import { Module } from '@nestjs/common';
import { ManufacturersModule } from './manufacturers/manufacturers.module';
import { DivisionsModule } from './divisions/divisions.module';
import { SeriesModule } from './series/series.module';
import { CategoriesModule } from './categories/categories.module';
import { SubCategoriesModule } from './sub-categories/sub-categories.module';
import { AttributeDefsModule } from './attribute-defs/attribute-defs.module';
import { UnitsModule } from './units/units.module';
import { TaxRatesModule } from './tax-rates/tax-rates.module';
import { HsnCodesModule } from './hsn-codes/hsn-codes.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ManufacturersModule,
    DivisionsModule,
    SeriesModule,
    CategoriesModule,
    SubCategoriesModule,
    AttributeDefsModule,
    UnitsModule,
    TaxRatesModule,
    HsnCodesModule,
    ProductsModule,
  ],
})
export class CatalogModule {}
