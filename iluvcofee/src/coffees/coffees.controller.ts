import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { response } from 'express';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('coffees') // ties /coffees url to this controller
export class CoffeesController {

    constructor(
        private readonly coffeesService: CoffeesService
    ){}

    @Get('flavors') // nested urls
    findAll(@Query() paginationQuery: PaginationQueryDto) {
        // const { limit, offset } = paginationQuery;
        return this.coffeesService.findAll(paginationQuery);
    }

    @Get(':id') // nested urls
    findOne(@Param('id') id: string) {
        return this.coffeesService.findOne(id);
    }

    @Post() // nested urls
    create(@Body() createCoffeeDto: CreateCoffeeDto) {
        console.log(createCoffeeDto instanceof CreateCoffeeDto);
        return this.coffeesService.create(createCoffeeDto);
    }

    @Patch(':id') // nested urls
    update(@Param('id') id: string, @Body() updateCOffeeDto: UpdateCoffeeDto) {
        return this.coffeesService.update(id, updateCOffeeDto);
    }

    @Delete(':id') // nested urls
    remove(@Param('id') id: string) {
        return this.coffeesService.remove(id);
    }
}
