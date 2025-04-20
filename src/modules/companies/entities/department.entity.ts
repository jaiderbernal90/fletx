import { Column, Entity, Index, OneToMany } from 'typeorm';
import { City } from './city.entity';

@Entity('departments')
export class Department {
  @Index()
  @Column({ primary: true, type: 'int' })
  id: number;

  @Column({ length: 100 })
  name: string;

  @OneToMany(() => City, city => city.department)
  cities: City[];
}
