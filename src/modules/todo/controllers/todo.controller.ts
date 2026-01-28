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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
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
  @ApiOperation({
    summary: `Update todo admin`,
    description: `Update a todo resource by id with new isOpen value and return the updated resource.\n\n[Referenz zu HTTP 200](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/200)`,
  })
  @ApiOkResponse({
    type: ReturnTodoDto,
    description: `Return the updated todo resource\n\n[Referenz zu HTTP 200](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/200)`,
  })
  @ApiUnauthorizedResponse({
    description:
      'Unauthorized, the user must be signed in\n\n[Referenz zu HTTP 401](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/401)',
  })
  @ApiNotFoundResponse({
    description: `The todo resource was not found with the requested id\n\n[Referenz zu HTTP 404](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/404)`,
  })
  @ApiForbiddenResponse({
    description: `The user is not authorized to access this resource\n\n[Referenz zu HTTP 403](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/403)`,
  })
  @ApiBadRequestResponse({
    description:
      'Bad Request, validation failed\n\n[Referenz zu HTTP 400](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/400)',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateTodoAdminDto })
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
  @ApiOperation({
    summary: `Create todo`,
    description: `Create a new user resource`,
  })
  @ApiCreatedResponse({
    description: `Return the created todo resource\n\n[Referenz zu HTTP 201](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/201)`,
    type: ReturnTodoDto,
  })
  @ApiBadRequestResponse({
    description:
      'Bad Request, validation failed\n\n[Referenz zu HTTP 400](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/400)',
  })
  @ApiBody({ type: CreateTodoDto })
  create(
    @CorrId() corrId: number,
    @UserId() userId: number,
    @Body() createTodoDto: CreateTodoDto,
  ): Promise<ReturnTodoDto> {
    return this.todoService.create(corrId, userId, createTodoDto);
  }

  @Get()
  @ApiOperation({
    summary: `Get all todos`,
    description: `Return an array of todo resources\n\n[Referenz zu HTTP 200](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/200)`,
  })
  @ApiOkResponse({
    type: ReturnTodoDto,
    isArray: true,
    description: `Return an array of todo resources\n\n[Referenz zu HTTP 200](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/200)`,
  })
  findAll(
    @CorrId() corrId: number,
    @IsAdmin() isAdmin: boolean,
    @UserId() userId: number,
  ) {
    return this.todoService.findAll(corrId, isAdmin, userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: `Get todo by id`,
    description: `Return a todo resource by it's id\n\n[Referenz zu HTTP 200](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/200)`,
  })
  @ApiOkResponse({
    type: ReturnTodoDto,
    description: `Return the found todo resource\n\n[Referenz zu HTTP 200](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/200)`,
  })
  @ApiNotFoundResponse({
    description: `The todo resource was not found with the requested id\n\n[Referenz zu HTTP 404](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/404)`,
  })
  @ApiForbiddenResponse({
    description: `The user is not authorized to access this resource\n\n[Referenz zu HTTP 403](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/403)`,
  })
  @ApiParam({ name: 'id', type: Number })
  findOne(
    @CorrId() corrId: number,
    @Param('id', ParseIntPipe) id: number,
    @IsAdmin() isAdmin: boolean,
    @UserId() userId: number,
  ) {
    return this.todoService.findOne(corrId, isAdmin, id, userId);
  }

  @Put(':id')
  @ApiOperation({
    summary: `Replace todo`,
    description: `Replace a todo resource by id with new values and return the replaced resource.\n\n[Referenz zu HTTP 200](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/200)`,
  })
  @ApiOkResponse({
    type: ReturnTodoDto,
    description: `Return the replaced todo resource\n\n[Referenz zu HTTP 200](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/200)`,
  })
  @ApiUnauthorizedResponse({
    description:
      'Unauthorized, the user must be signed in\n\n[Referenz zu HTTP 401](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/401)',
  })
  @ApiNotFoundResponse({
    description: `The todo resource was not found with the requested id\n\n[Referenz zu HTTP 404](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/404)`,
  })
  @ApiForbiddenResponse({
    description: `The user is not authorized to access this resource\n\n[Referenz zu HTTP 403](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/403)`,
  })
  @ApiBadRequestResponse({
    description:
      'Bad Request, validation failed\n\n[Referenz zu HTTP 400](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/400)',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: ReplaceTodoDto })
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
  @ApiOperation({
    summary: `Update todo`,
    description: `Update a todo resource by id with new values and return the updated resource.\n\n[Referenz zu HTTP 200](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/200)`,
  })
  @ApiOkResponse({
    type: ReturnTodoDto,
    description: `Return the updated todo resource\n\n[Referenz zu HTTP 200](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/200)`,
  })
  @ApiUnauthorizedResponse({
    description:
      'Unauthorized, the user must be signed in\n\n[Referenz zu HTTP 401](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/401)',
  })
  @ApiNotFoundResponse({
    description: `The todo resource was not found with the requested id\n\n[Referenz zu HTTP 404](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/404)`,
  })
  @ApiForbiddenResponse({
    description: `The user is not authorized to access this resource\n\n[Referenz zu HTTP 403](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/403)`,
  })
  @ApiBadRequestResponse({
    description:
      'Bad Request, validation failed\n\n[Referenz zu HTTP 400](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/400)',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateTodoDto })
  update(
    @CorrId() corrId: number,
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
    @IsAdmin() isAdmin: boolean,
  ) {
    return this.todoService.update(corrId, isAdmin, userId, id, updateTodoDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: `Delete todo`,
    description: `Delete a todo by id and return the deleted object\n\n[Referenz zu HTTP 200](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/200)\`,`,
  })
  @ApiOkResponse({
    type: ReturnTodoDto,
    description: `Return the deleted todo resource\n\n[Referenz zu HTTP 200](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/200)`,
  })
  @ApiUnauthorizedResponse({
    description:
      'Unauthorized, the user must be signed in\n\n[Referenz zu HTTP 401](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/401)',
  })
  @ApiNotFoundResponse({
    description: `The todo resource was not found with the requested id\n\n[Referenz zu HTTP 404](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/404)`,
  })
  @ApiForbiddenResponse({
    description: `The user is not authorized to delete this resource\n\n[Referenz zu HTTP 403](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/403)`,
  })
  @ApiBadRequestResponse({
    description:
      'Bad Request, validation failed\n\n[Referenz zu HTTP 400](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/400)',
  })
  @ApiParam({ name: 'id', type: Number })
  remove(
    @CorrId() corrId: number,
    @Param('id', ParseIntPipe) id: number,
    @IsAdmin() isAdmin: boolean,
    @UserId() userId: number,
  ) {
    return this.todoService.remove(corrId, isAdmin, userId, id);
  }
}
