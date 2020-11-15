import { HttpException, HttpStatus, Injectable, NotFoundException, Inject, Scope } from '@nestjs/common';
import { Coffee } from './entity/coffee.entity';
import { Event } from '../events/entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { COFFEE_BRANDS } from './coffees.constants';
/* Utilize ConfigService */
import { ConfigService, ConfigType } from '@nestjs/config'; // provides get method for reading env variables
import coffeesConfig from './config/coffees.config';

// Scope DEFAULT - This is assumed when NO Scope is entered like so: @Injectable() */ Singleton
@Injectable({ scope: Scope.DEFAULT })
export class CoffeesService {
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,
        @InjectRepository(Flavor)
        private readonly flavorRepository: Repository<Flavor>,
        private readonly connection: Connection,
        @Inject(COFFEE_BRANDS) coffeeBrands: string[],
        private readonly configService: ConfigService,
        @Inject(coffeesConfig.KEY)
        private coffeesConfiguration: ConfigType<typeof coffeesConfig>,
    ){
        console.log(coffeeBrands)
        /* Accessing process.env variables from ConfigService */
        // const databaseHost = this.configService.get<string>('DATABASE_HOST');
        /**
         * Grabbing this nested property within our App 
         * via "dot notation" (a.b)
         */
        const databaseHost = this.configService.get('database.host', 'localhost');
        console.log(databaseHost);

                // ---------
        // ⚠️ sub optimal ways of retrieving Config ⚠️

        /* Grab coffees config within App */
        // const coffeesConfig = this.configService.get('coffees');
        // console.log(coffeesConfig);

        /* Grab nested property within coffees config */
        // const foo = this.configService.get('coffees.foo');
        // console.log(foo);
        // Now strongly typed, and able to access properties via:
        console.log(coffeesConfiguration.foo); 

    }

    // perform eager loading of relations
    findAll(paginationQuery: PaginationQueryDto) {
        const { limit, offset } = paginationQuery;
        return this.coffeeRepository.find({
            relations: ['flavors'],
            skip: offset,
            take: limit,
        });
    }

    async findOne(id: string) {
        const coffee = await this.coffeeRepository.findOne(id, {
            relations: ['flavors']
        });
        if(!coffee) {
           throw new HttpException(`Coffee #${id} not found`, HttpStatus.NOT_FOUND);
        }
        // return this.coffees.find(item => item.id === +id);
        return coffee;
    }

    async create(createCoffeeDto: CreateCoffeeDto) {
        const flavors = await Promise.all(
            createCoffeeDto.flavors.map(name => this.preloadFlavorByName(name)),
        );
        const coffee = this.coffeeRepository.create({
            ...createCoffeeDto,
            flavors,
        });
        return this.coffeeRepository.save(coffee);
    }

    async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
        const flavors =
        updateCoffeeDto.flavors &&
        (await Promise.all(
            updateCoffeeDto.flavors.map(name => this.preloadFlavorByName(name)),
        ));
        // first checks if an entity exists in the database and retrieves it
        // returns undefined if the entity is not in the database
        const coffee = await this.coffeeRepository.preload({
            id: +id,
            ...updateCoffeeDto,
            flavors
          });
          if (!coffee) {
            throw new NotFoundException(`Coffee #${id} not found`);
          }
          return this.coffeeRepository.save(coffee);
    }

    async remove(id: string) {
        const coffee = await this.findOne(id); // findOne automatically throws error if the record is not in the database
        return this.coffeeRepository.remove(coffee);
    }

    /* CoffeesService - recommendCoffee() addition an example of transaction */
async recommendCoffee(coffee: Coffee) {
    const queryRunner = this.connection.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction(); 
    try {
      coffee.recommendations++;
      
      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: coffee.id };
    
      await queryRunner.manager.save(coffee); 
      await queryRunner.manager.save(recommendEvent);
      
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

    private async preloadFlavorByName(name: string): Promise<Flavor> {
        const existingFlavor = await this.flavorRepository.findOne({ name });
        if (existingFlavor) {
          return existingFlavor;
        }
        return this.flavorRepository.create({ name });
    }
}
