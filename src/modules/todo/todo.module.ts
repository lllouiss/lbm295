import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TodoSeedService } from './seed/user-seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './entities/todo.entity';

@Module({
  controllers: [TodoController],
  providers: [TodoService, TodoSeedService],
  imports: [TypeOrmModule.forFeature([TodoEntity])],
})
export class TodoModule {}
