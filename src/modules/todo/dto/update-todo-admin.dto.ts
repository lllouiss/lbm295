import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTodoAdminDto {
  @ApiProperty({
    example: true,
    description: 'Set todo as closed (users can only set to true)',
  })
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  isClosed: boolean;
}
