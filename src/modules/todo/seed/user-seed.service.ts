import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TodoEntity } from '../entities/todo.entity';

@Injectable()
export class TodoSeedService implements OnApplicationBootstrap {
  /**
   * Logger instance used for logging messages related to the TodoSeedService.
   *
   * Initialized with the name of the service to provide context-specific logging
   * for debugging and monitoring purposes.
   *
   * @type {Logger}
   */

  private readonly logger: Logger = new Logger(TodoSeedService.name);
  /**
   * Initializes a new instance of the class with the specified data source and password service.
   *
   * @param {DataSource} dataSource The data source to be used for operations.
   */
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Handles logic that should be executed when the application finishes bootstrapping.
   * Typically used for initializing resources or seeding the database.
   *
   * @return {Promise<void>} A promise that resolves once the bootstrap logic is complete.
   */
  async onApplicationBootstrap(): Promise<void> {
    await this.seed();
  }

  /**
   * Seeds the database with initial todo data.
   *
   * This method populates the database with predefined todo records:
   * The method uses the provided repository to insert or update these records.
   *
   * @return {Promise<void>} A promise that resolves when the seeding process is complete.
   */
  async seed(): Promise<void> {
    const todoRepo = this.dataSource.getRepository(TodoEntity);
    this.logger.debug(`${this.seed.name}: start`);

    await this.upsertById(
      todoRepo,
      1,
      'OpenAdmin',
      'Example of an open admin todo',
      false,
      1,
      1,
    );
    await this.upsertById(
      todoRepo,
      2,
      'ClosedAdmin',
      'Example of an closed admin todo',
      true,
      1,
      1,
    );
    await this.upsertById(
      todoRepo,
      3,
      'OpenUser',
      'Example of an open user todo',
      false,
      2,
      2,
    );
    await this.upsertById(
      todoRepo,
      4,
      'ClosedUser',
      'Example of an closed user todo',
      true,
      2,
      2,
    );
  }

  /**
   * Inserts or updates a todo record by its ID. If the record already exists, no action is performed.
   *
   * @param {Repository<TodoEntity>} todoRepo - The todo repository instance for performing database operations.
   * @param {number} id - The unique identifier of the todo.
   * @param {string} title - The title of the todo item.
   * @param {string} description - The description of the todo item.
   * @param {boolean} isClosed - A flag indicating whether the todo item is closed.
   * @param {number} createdById - The ID of the user who created the todo item.
   * @param {number} updatedById - The ID of the user who last updated the todo item.
   * @return {Promise<void>} A promise that resolves when the insert or update operation is complete.
   */
  private async upsertById(
    todoRepo: Repository<TodoEntity>,
    id: number,
    title: string,
    description: string,
    isClosed: boolean,
    createdById: number,
    updatedById: number,
  ): Promise<void> {
    this.logger.verbose(
      `${this.upsertById.name}: id=${id}, title=${title}, description=${description}, isClosed=${isClosed} createdById=${createdById}, updatedById=${updatedById}`,
    );
    const existing = await todoRepo.findOneBy({ id });
    if (existing) return;

    await todoRepo.upsert(
      {
        id,
        title,
        description,
        isClosed,
        createdById,
        updatedById,
      },
      ['id'],
    );
  }
}
