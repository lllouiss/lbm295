import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TodoEntity } from '../entities/todo.entity';

import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateTodoDto,
  ReturnTodoDto,
  UpdateTodoAdminDto,
  UpdateTodoDto,
} from '../dto';

// Mock Data Helpers
const mockDate = new Date();

const mockTodoEntity: TodoEntity = {
  id: 1,
  title: 'Test Todo',
  description: 'Test Description',
  isClosed: false,
  version: 1,
  createdAt: mockDate,
  updatedAt: mockDate,
  createdById: 100,
  updatedById: 100,
};

// FIX 1: Typ-Annotation ': ReturnTodoDto' ENTFERNT.
// Damit ist es ein normales Objekt mit Date-Feldern (wichtig für den Vergleich mit dem Service-Return)
const mockReturnDto = {
  id: 1,
  title: 'Test Todo',
  description: 'Test Description',
  isClosed: false,
  version: 1,
  createdAt: mockDate,
  updatedAt: mockDate,
  createdById: 100,
  updatedById: 100,
};

describe('TodoService', () => {
  let service: TodoService;
  // Mock Repository Factory
  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(TodoEntity),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);

    // Reset mocks vor jedem Test
    jest.clearAllMocks();
  });

  it('sollte definiert sein', () => {
    expect(service).toBeDefined();
  });

  // -------------------------------------------------------------------------
  // CREATE
  // -------------------------------------------------------------------------
  describe('create', () => {
    it('sollte erfolgreich ein Todo erstellen und zurückgeben', async () => {
      const createDto: CreateTodoDto = {
        title: 'New Todo',
        description: 'Desc',
      };
      const userId = 100;
      const corrId = 1;

      // Mock Setup
      mockRepo.create.mockReturnValue(mockTodoEntity);
      mockRepo.save.mockResolvedValue(mockTodoEntity);

      const result = await service.create(corrId, userId, createDto);

      expect(mockRepo.create).toHaveBeenCalledWith(createDto);
      expect(mockRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          createdById: userId,
          updatedById: userId,
        }),
      );
      expect(result).toEqual(mockReturnDto);
    });
  });

  // -------------------------------------------------------------------------
  // FIND ALL
  // -------------------------------------------------------------------------
  describe('findAll', () => {
    it('sollte als Admin alle Todos finden', async () => {
      mockRepo.find.mockResolvedValue([mockTodoEntity]);

      const result = await service.findAll(1, true, 100);

      expect(mockRepo.find).toHaveBeenCalledWith();
      expect(result).toEqual([mockReturnDto]);
    });

    it('sollte als Nicht-Admin nur eigene offene Todos finden', async () => {
      mockRepo.find.mockResolvedValue([mockTodoEntity]);
      const userId = 100;

      const result = await service.findAll(1, false, userId);

      expect(mockRepo.find).toHaveBeenCalledWith({
        where: { createdById: userId, isClosed: false },
      });
      expect(result).toEqual([mockReturnDto]);
    });
  });

  // -------------------------------------------------------------------------
  // FIND ONE
  // -------------------------------------------------------------------------
  describe('findOne', () => {
    it('sollte NotFoundException werfen, wenn ID nicht existiert', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(1, true, 999, 100)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('sollte ForbiddenException werfen, wenn User nicht Owner und kein Admin ist', async () => {
      const otherUserTodo = { ...mockTodoEntity, createdById: 200 };
      mockRepo.findOneBy.mockResolvedValue(otherUserTodo);

      await expect(service.findOne(1, false, 1, 100)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('sollte Todo zurückgeben, wenn User Owner ist', async () => {
      mockRepo.findOneBy.mockResolvedValue(mockTodoEntity);

      const result = await service.findOne(1, false, 1, 100);
      expect(result).toEqual(mockReturnDto);
    });

    it('sollte Todo zurückgeben, wenn User Admin ist (auch fremde)', async () => {
      const otherUserTodo = { ...mockTodoEntity, createdById: 200 };
      mockRepo.findOneBy.mockResolvedValue(otherUserTodo);

      const result = await service.findOne(1, true, 1, 100);
      expect(result.createdById).toBe(200);
    });
  });

  // -------------------------------------------------------------------------
  // UPDATE BY ADMIN
  // -------------------------------------------------------------------------
  describe('updateByAdmin', () => {
    const updateDto: UpdateTodoAdminDto = { isClosed: true };

    it('sollte NotFoundException werfen, wenn Todo fehlt', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      await expect(
        service.updateByAdmin(1, true, 100, 1, updateDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('sollte ForbiddenException werfen, wenn User kein Admin ist', async () => {
      mockRepo.findOneBy.mockResolvedValue(mockTodoEntity);
      await expect(
        service.updateByAdmin(1, false, 100, 1, updateDto),
      ).rejects.toThrow(ForbiddenException);
    });

    it('sollte erfolgreich updaten als Admin', async () => {
      mockRepo.findOneBy.mockResolvedValue(mockTodoEntity);
      const updatedEntity = { ...mockTodoEntity, isClosed: true };
      mockRepo.save.mockResolvedValue(updatedEntity);

      const result = await service.updateByAdmin(1, true, 100, 1, updateDto);

      expect(mockRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          isClosed: true,
          updatedById: 100,
        }),
      );
      expect(result.isClosed).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // REPLACE
  // -------------------------------------------------------------------------
  describe('replace', () => {
    // FIX 2: Nutzung von 'as unknown as ReturnTodoDto'.
    // Das umgeht den Fehler aus deinem Screenshot, da wir TypeScript zwingen,
    // das Objekt als DTO zu akzeptieren, obwohl Dates drin sind.

    it('sollte NotFoundException werfen', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      await expect(
        service.replace(
          1,
          true,
          100,
          1,
          mockReturnDto as unknown as ReturnTodoDto,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('sollte ForbiddenException werfen, wenn kein Admin', async () => {
      mockRepo.findOneBy.mockResolvedValue(mockTodoEntity);
      await expect(
        service.replace(
          1,
          false,
          100,
          1,
          mockReturnDto as unknown as ReturnTodoDto,
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('sollte ConflictException werfen bei Versionskonflikt', async () => {
      mockRepo.findOneBy.mockResolvedValue({ ...mockTodoEntity, version: 2 });
      await expect(
        service.replace(
          1,
          true,
          100,
          1,
          mockReturnDto as unknown as ReturnTodoDto,
        ),
      ).rejects.toThrow(ConflictException);
    });

    it('sollte erfolgreich ersetzen', async () => {
      mockRepo.findOneBy.mockResolvedValue(mockTodoEntity);
      mockRepo.save.mockResolvedValue(mockTodoEntity);

      const result = await service.replace(
        1,
        true,
        100,
        1,
        mockReturnDto as unknown as ReturnTodoDto,
      );

      expect(mockRepo.save).toHaveBeenCalled();
      expect(result).toEqual(mockReturnDto);
    });
  });

  // -------------------------------------------------------------------------
  // UPDATE (User)
  // -------------------------------------------------------------------------
  describe('update', () => {
    const updateDto: UpdateTodoDto = { title: 'User Update' };

    it('sollte NotFoundException werfen', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      await expect(service.update(1, false, 100, 1, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('sollte ForbiddenException werfen, wenn User nicht Owner und kein Admin', async () => {
      const otherTodo = { ...mockTodoEntity, createdById: 200 };
      mockRepo.findOneBy.mockResolvedValue(otherTodo);

      await expect(service.update(1, false, 100, 1, updateDto)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('sollte ForbiddenException werfen, wenn isClosed=false gesetzt wird und User kein Admin ist', async () => {
      mockRepo.findOneBy.mockResolvedValue(mockTodoEntity);
      const openDto: UpdateTodoDto = { isClosed: false };

      await expect(service.update(1, false, 100, 1, openDto)).rejects.toThrow(
        'Opening todos is not allowed',
      );
    });

    it('sollte erfolgreich updaten (Owner)', async () => {
      mockRepo.findOneBy.mockResolvedValue(mockTodoEntity);
      const resultEntity = { ...mockTodoEntity, title: 'User Update' };
      mockRepo.save.mockResolvedValue(resultEntity);

      const result = await service.update(1, false, 100, 1, updateDto);

      expect(mockRepo.save).toHaveBeenCalled();
      expect(result.title).toBe('User Update');
    });

    it('sollte erfolgreich updaten (Admin an fremdem Todo)', async () => {
      const otherTodo = { ...mockTodoEntity, createdById: 200 };
      mockRepo.findOneBy.mockResolvedValue(otherTodo);
      mockRepo.save.mockResolvedValue(otherTodo);

      await service.update(1, true, 100, 1, updateDto);
      expect(mockRepo.save).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // REMOVE
  // -------------------------------------------------------------------------
  describe('remove', () => {
    it('sollte NotFoundException werfen', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      await expect(service.remove(1, true, 100, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('sollte ForbiddenException werfen, wenn kein Admin', async () => {
      mockRepo.findOneBy.mockResolvedValue(mockTodoEntity);
      await expect(service.remove(1, false, 100, 1)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('sollte erfolgreich löschen', async () => {
      mockRepo.findOneBy.mockResolvedValue(mockTodoEntity);
      mockRepo.save.mockResolvedValue(mockTodoEntity);
      mockRepo.remove.mockResolvedValue(mockTodoEntity);

      const result = await service.remove(1, true, 100, 1);

      expect(mockRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ updatedById: 100 }),
      );
      expect(mockRepo.remove).toHaveBeenCalled();
      expect(result).toEqual(mockReturnDto);
    });
  });
});
