import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReplaceTodoDto {
  id: number;
  version: number;
  @ApiProperty({
    example: 'Buy groceries',
    description: 'Todo title (8-50 characters)',
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 50)
  title?: string;

  @ApiProperty({
    example: 'Milk, Bread, Eggs',
    description: 'Optional todo description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: true,
    description: 'Set todo as closed (users can only set to true)',
  })
  @IsBoolean()
  @IsNotEmpty()
  isClosed?: boolean;
}
