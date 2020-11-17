import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { response } from 'express';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';
import { Protocol } from 'src/common/decorators/protocol.decorator';

// @UsePipes(ValidationPipe) // applied to this controller
@Controller('coffees') // ties /coffees url to this controller
export class CoffeesController {

    constructor(
        private readonly coffeesService: CoffeesService
    ){}

    @Public()
    @Get('flavors') // nested urls
    async findAll(@Protocol('https') protocol: string, @Query() paginationQuery: PaginationQueryDto) {
        console.log(protocol);
        // const { limit, offset } = paginationQuery;
        //await new Promise(resolve => setTimeout(resolve, 5000)); // manually trigger TimeoutInterceptors
        return this.coffeesService.findAll(paginationQuery);
    }

    @Public()
    @Get(':id') // nested urls
    findOne(@Param('id', ParseIntPipe) id: string) {
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
