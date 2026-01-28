import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

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
  ],
})
export class AppModule {}
