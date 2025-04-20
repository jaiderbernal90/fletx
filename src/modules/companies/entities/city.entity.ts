import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Department } from './department.entity';
import { Company } from './company.entity';

@Entity('cities')
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @ManyToOne(() => Department, department => department.cities)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @OneToMany(() => Company, company => company.city)
  companies: Company[];
}
