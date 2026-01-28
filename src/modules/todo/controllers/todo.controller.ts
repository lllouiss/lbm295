import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from '../services/todo.service';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { CorrId } from '../../../decorators/corr-id.decorator';
import { IsAdmin, UserId } from '../../auth/decorators';
import {
  CreateTodoDto,
  ReplaceTodoDto,
  ReturnTodoDto,
  UpdateTodoAdminDto,
  UpdateTodoDto,
} from '../dto';

@Controller('todo')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiInternalServerErrorResponse({
  description:
    'Internal Server Error\n\n[Referenz zu HTTP 500](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/500)',
})
@ApiUnauthorizedResponse({
  description:
    'Unauthorized, the user must be signed in\n\n[Referenz zu HTTP 401](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/401)',
})
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Patch(':id/admin')
  updateByAdmin(
    @CorrId() corrId: number,
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoAdminDto: UpdateTodoAdminDto,
    @IsAdmin() isAdmin: boolean,
  ) {
    return this.todoService.updateByAdmin(
      corrId,
      isAdmin,
      userId,
      id,
      updateTodoAdminDto,
    );
  }

  @Post()
  create(
    @CorrId() corrId: number,
    @UserId() userId: number,
    @Body() createTodoDto: CreateTodoDto,
  ): Promise<ReturnTodoDto> {
    return this.todoService.create(corrId, userId, createTodoDto);
  }

  @Get()
  findAll(
    @CorrId() corrId: number,
    @IsAdmin() isAdmin: boolean,
    @UserId() userId: number,
  ) {
    return this.todoService.findAll(corrId, isAdmin, userId);
  }

  @Get(':id')
  findOne(
    @CorrId() corrId: number,
    @Param('id', ParseIntPipe) id: number,
    @IsAdmin() isAdmin: boolean,
    @UserId() userId: number,
  ) {
    return this.todoService.findOne(corrId, isAdmin, id, userId);
  }

  @Put(':id')
  replace(
    @CorrId() corrId: number,
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() replaceTodoDto: ReplaceTodoDto,
    @IsAdmin() isAdmin: boolean,
  ) {
    return this.todoService.replace(
      corrId,
      isAdmin,
      userId,
      id,
      replaceTodoDto,
    );
  }

  @Patch(':id')
  update(
    @CorrId() corrId: number,
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todoService.update(corrId, userId, id, updateTodoDto);
  }

  @Delete(':id')
  remove(
    @CorrId() corrId: number,
    @Param('id', ParseIntPipe) id: number,
    @IsAdmin() isAdmin: boolean,
  ) {
    return this.todoService.remove(corrId, isAdmin, id);
  }
}
