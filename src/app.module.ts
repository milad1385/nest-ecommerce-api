import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AddressModule } from './address/address.module';
import { TicketsModule } from './tickets/tickets.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { SellersModule } from './sellers/sellers.module';
import { SellersRequestsModule } from './sellers-requests/sellers-requests.module';
import { AttributesModule } from './attributes/attributes.module';
import { CommentsModule } from './comments/comments.module';
import { IpTrackerModule } from './ip-tracker/ip-tracker.module';
import { IpTrackerMiddleware } from './ip-tracker/ip-tracker.middleware';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { MenusModule } from './menus/menus.module';
import { BasketsModule } from './baskets/baskets.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT || 3306),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    AddressModule,
    TicketsModule,
    CategoriesModule,
    ProductsModule,
    SellersModule,
    SellersRequestsModule,
    AttributesModule,
    CommentsModule,
    IpTrackerModule,
    BookmarksModule,
    MenusModule,
    BasketsModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IpTrackerMiddleware).forRoutes('*');
  }
}
