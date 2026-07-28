import { Module } from '@nestjs/common';
import { ManufacturersModule } from './manufacturers/manufacturers.module';
import { CategoriesModule } from './categories/categories.module';
import { SubCategoriesModule } from './sub-categories/sub-categories.module';
import { AttributeDefsModule } from './attribute-defs/attribute-defs.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ManufacturersModule,
    CategoriesModule,
    SubCategoriesModule,
    AttributeDefsModule,
    ProductsModule,
  ],
})
export class CatalogModule {}
