import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';
import { DatabaseModule } from './database/database.module';
import appConfig from './config/app.config';
import { APP_PIPE } from '@nestjs/core/constants';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        load: [appConfig]
      }
    ), //load and pass .env files from default location and merge k/v and env variables assigned to process.env
    CoffeesModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres', // type of our database
        host: process.env.DATABASE_HOST, // database host
        port: +process.env.DATABASE_PORT, // database host
        username: process.env.DATABASE_USER, // username
        password: process.env.DATABASE_PASSWORD, // user password
        database: process.env.DATABASE_NAME, // name of our database,
        autoLoadEntities: true, // models will be loaded automatically (you don't have to explicitly specify the entities: [] array)
        synchronize: true, // your entities will be synced with the database (ORM will map entity definitions to corresponding SQL tabled), every time you run the application (recommended: disable in the production)
      })
    }),
    CoffeeRatingModule,
    DatabaseModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // this way we are setting up a pipe from within a module context,
    // lets nest instatiates the ValidationPipe within the context of an
    // AppModule and registers it as a global Pipe
    {
      provide: APP_PIPE, // provider token for ValidationPipe
      useClass: ValidationPipe,
    }
  ],
})
export class AppModule {}
