import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../events/entities/event.entity'
import { Coffee } from './entity/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Module(
    {
        controllers: [CoffeesController],
        providers: [CoffeesService],
        exports: [],
        imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])] // used to register entities for a domaain
    }
)
export class CoffeesModule {}
