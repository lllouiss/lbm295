import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TodoModule } from './modules/todo/todo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
      synchronize: true,
      type: 'sqlite',
      database: process.env.DB_NAME || 'todo/myApp.db',
    }),
    AuthModule,
    TodoModule,
  ],
})
export class AppModule {}
