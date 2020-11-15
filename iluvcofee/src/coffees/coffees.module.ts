import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../events/entities/event.entity'
import { Coffee } from './entity/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { COFFEE_BRANDS } from './coffees.constants';
import { ConfigService, ConfigModule } from '@nestjs/config';
import coffeesConfig from './config/coffees.config';

@Module(
    {
        imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event]), ConfigModule.forFeature(coffeesConfig)], // used to register entities for a domaain
        controllers: [CoffeesController],
        providers: [
            CoffeesService,
            ConfigService,
            { provide: COFFEE_BRANDS, useValue: ['buddy brew', 'nescafe']}
        ],
        exports: [CoffeesService],
    }
)
export class CoffeesModule {}
