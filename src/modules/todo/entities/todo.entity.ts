import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity('todo')
export class TodoEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @VersionColumn({ type: 'int' })
  version?: number;

  @Column({ name: 'created_by_id' })
  createdById!: number;

  @Column({ name: 'update_by_id', nullable: true })
  updatedById?: number;

  @Column({ type: 'varchar', length: 50 })
  title?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @Column({ default: false, name: 'is_closed' })
  isClosed?: boolean;
}
