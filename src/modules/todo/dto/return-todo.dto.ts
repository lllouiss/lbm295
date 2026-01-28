import { ApiProperty } from '@nestjs/swagger';

export class ReturnTodoDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Buy groceries' })
  title?: string;

  @ApiProperty({ example: 'Milk, Bread, Eggs', required: false })
  description?: string;

  @ApiProperty({ example: false })
  isClosed?: boolean;

  @ApiProperty({ example: 1 })
  createdById?: number;

  @ApiProperty({ example: 1 })
  updatedById?: number;

  @ApiProperty({ example: '2026-01-14T09:00:00.000Z' })
  createdAt?: string;

  @ApiProperty({ example: '2026-01-14T09:00:00.000Z' })
  updatedAt?: string;

  @ApiProperty({ example: 1 })
  version?: number;
}
