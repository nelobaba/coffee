import { Entity, PrimaryGeneratedColumn, Column, JoinTable, ManyToMany } from "typeorm";
import { Flavor } from "../entities/flavor.entity";

@Entity() // set table coffee
export class Coffee {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    title: string;

    @Column({ nullable: true})
    description: string;
  
    @Column()
    brand: string;

    @Column({ default: 0 })
    recommendations: number
  
    @JoinTable()
    @ManyToMany(
        type => Flavor,
        (flavor) => flavor.coffees,
        {
            cascade: true, //['insert]
        }
    )
    flavors: Flavor[];
}