import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TodoEntity } from '../entities/todo.entity';
import {
  CreateTodoDto,
  ReturnTodoDto,
  UpdateTodoAdminDto,
  UpdateTodoDto,
} from '../dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TodoService {
  private readonly logger = new Logger(TodoService.name);

  constructor(
    @InjectRepository(TodoEntity)
    private readonly repo: Repository<TodoEntity>,
  ) {}

  private entityToDto(corrId: number, entity: TodoEntity): ReturnTodoDto {
    this.logger.verbose(
      `${corrId} ${this.entityToDto.name} entity: ${JSON.stringify(entity, null, 2)}`,
    );
    const dto = {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      isClosed: entity.isClosed,
      version: entity.version,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      updatedById: entity.updatedById,
      createdById: entity.createdById,
    } as ReturnTodoDto;
    this.logger.verbose(
      `${corrId} ${this.entityToDto.name} dto: ${JSON.stringify(dto, null, 2)}`,
    );
    return dto;
  }

  async updateByAdmin(
    corrId: number,
    isAdmin: boolean,
    userId: number,
    id: number,
    updateTodoAdminDto: UpdateTodoAdminDto,
  ) {
    this.logger.verbose(
      `${corrId} ${this.updateByAdmin.name} id: ${id} updateTodoAdminDto: ${JSON.stringify(
        updateTodoAdminDto,
        null,
        2,
      )}`,
    );
    const existingEntity = await this.repo.findOneBy({ id });
    if (!existingEntity) {
      this.logger.debug(
        `${corrId} ${this.updateByAdmin.name} id: ${id} not found`,
      );
      throw new NotFoundException(`Todo ${id} not found`);
    }
    if (!isAdmin) {
      throw new ForbiddenException(
        'The user is not authorized to access this resource',
      );
    }
    const updatedEntity = await this.repo.save({
      ...existingEntity,
      ...updateTodoAdminDto,
      updatedById: userId,
      id,
    });
    return this.entityToDto(corrId, updatedEntity);
  }

  async create(corrId: number, userId: number, createDto: CreateTodoDto) {
    this.logger.debug(
      `${corrId} ${this.create.name} createDto: ${JSON.stringify(createDto, null, 2)}`,
    );
    const createEntity = this.repo.create(createDto);

    createEntity.createdById = userId;
    createEntity.updatedById = userId;
    const savedEntity = await this.repo.save(createEntity);
    return this.entityToDto(corrId, savedEntity);
  }

  async findAll(
    corrId: number,
    isAdmin: boolean,
    userId: number,
  ): Promise<Array<any>> {
    Logger.verbose(`${corrId} ${this.findAll.name}`, TodoService.name);
    let arr: TodoEntity[];
    if (isAdmin) {
      arr = await this.repo.find();
    } else {
      arr = await this.repo.find({
        where: { createdById: userId, isClosed: false },
      });
    }
    return arr.map((e) => this.entityToDto(corrId, e));
  }

  async findOne(corrId: number, isAdmin: boolean, id: number, userId: number) {
    this.logger.verbose(`${corrId} ${this.findOne.name} id: ${id}`);
    const findEntity = await this.repo.findOneBy({ id });
    if (!findEntity) {
      this.logger.debug(`${corrId} ${this.findOne.name} id: ${id} not found`);
      throw new NotFoundException(`Todo ${id} not found`);
    }
    if (!isAdmin && findEntity?.createdById !== userId) {
      throw new ForbiddenException(
        'The user is not authorized to access this resource',
      );
    }
    return this.entityToDto(corrId, findEntity);
  }

  async replace(
    corrId: number,
    isAdmin: boolean,
    userId: number,
    id: number,
    returnDto: ReturnTodoDto,
  ): Promise<ReturnTodoDto> {
    this.logger.verbose(
      `${corrId} ${this.replace.name} id: ${id} returnDto: ${JSON.stringify(
        returnDto,
        null,
        2,
      )}`,
    );
    const existingEntity = await this.repo.findOneBy({ id });
    if (!existingEntity) {
      this.logger.debug(`${corrId} ${this.replace.name} id: ${id} not found`);
      throw new NotFoundException(`Todo ${id} not found`);
    }
    if (!isAdmin) {
      throw new ForbiddenException(
        'The user is not authorized to access this resource',
      );
    }
    if (existingEntity.version !== returnDto.version) {
      this.logger.debug(
        `${corrId} ${this.replace.name} id: ${id} version mismatch. Expected ${existingEntity.version} got ${returnDto.version}`,
      );
      throw new ConflictException(
        `Todo ${id} version mismatch, expected ${existingEntity.version} got ${returnDto.version}`,
      );
    }
    const replacedEntity = await this.repo.save({
      ...existingEntity,
      ...returnDto,
      updatedById: userId,
      id,
    });
    return this.entityToDto(corrId, replacedEntity);
  }

  async update(
    corrId: number,
    isAdmin: boolean,
    userId: number,
    id: number,
    updateTodoDto: UpdateTodoDto,
  ) {
    this.logger.verbose(
      `${corrId} ${this.update.name} id: ${id} updateTodoDto: ${JSON.stringify(
        updateTodoDto,
        null,
        2,
      )}`,
    );
    const existingEntity = await this.repo.findOneBy({ id });
    if (!existingEntity) {
      this.logger.debug(`${corrId} ${this.update.name} id: ${id} not found`);
      throw new NotFoundException(`Todo ${id} not found`);
    }
    if (existingEntity.createdById !== userId && !isAdmin) {
      throw new ForbiddenException(
        'The user is not authorized to access this resource',
      );
    }
    if (updateTodoDto.isClosed === false && !isAdmin) {
      throw new ForbiddenException('Opening todos is not allowed');
    }
    const updatedEntity = await this.repo.save({
      ...existingEntity,
      ...updateTodoDto,
      updatedById: userId,
      id,
    });
    return this.entityToDto(corrId, updatedEntity);
  }

  async remove(corrId: number, isAdmin: boolean, userId: number, id: number) {
    this.logger.verbose(`${corrId} ${this.remove.name} id: ${id}`);
    const existing = await this.repo.findOneBy({ id });
    if (!existing) {
      this.logger.debug(`${corrId} ${this.remove.name} id: ${id} not found`);
      throw new NotFoundException(`Todo ${id} not found`);
    }
    if (!isAdmin) {
      throw new ForbiddenException(
        'The user is not authorized to access this resource',
      );
    }
    const replaced = await this.repo.save({
      ...existing,
      updatedById: userId,
      id,
    });
    const deleted = await this.repo.remove(replaced);
    this.logger.verbose(
      `${corrId} ${this.remove.name} id: ${id} deleted: ${JSON.stringify(deleted, null, 2)}`,
    );
    return this.entityToDto(corrId, replaced);
  }
}
