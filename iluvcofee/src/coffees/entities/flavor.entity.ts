import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { Coffee } from "../entity/coffee.entity";

@Entity()
export class Flavor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(type => Coffee, coffee => coffee.flavors)
    coffees: Coffee[];
}
