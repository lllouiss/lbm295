import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({
    example: 'Buy groceries',
    description: 'Todo title (8-50 characters)',
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 50)
  title: string;

  @ApiProperty({
    example: 'Milk, Bread, Eggs',
    description: 'Optional todo description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
