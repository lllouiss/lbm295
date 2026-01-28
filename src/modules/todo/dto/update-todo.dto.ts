import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateTodoDto {
  @ApiProperty({
    example: 'Buy groceries',
    description: 'Todo title (8-50 characters)',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 50)
  @IsOptional()
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
  @IsOptional()
  isClosed?: boolean;
}
