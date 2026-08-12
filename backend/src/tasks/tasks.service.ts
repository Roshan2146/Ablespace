import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateSubtaskDto, UpdateSubtaskDto } from './dto/subtask.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  private parseTaskJSON(task: any) {
    if (!task) return null;
    return {
      ...task,
      labels: typeof task.labels === 'string' ? JSON.parse(task.labels || '[]') : task.labels,
      members: typeof task.members === 'string' ? JSON.parse(task.members || '[]') : task.members,
    };
  }

  async findAll(query?: { search?: string; status?: string; priority?: string }) {
    const where: any = {};

    if (query?.status) {
      where.status = query.status;
    }

    if (query?.priority) {
      where.priority = query.priority;
    }

    if (query?.search) {
      where.OR = [
        { title: { contains: query.search } },
        { description: { contains: query.search } },
      ];
    }

    const tasks = await this.prisma.task.findMany({
      where,
      include: {
        subtasks: true,
        activities: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return tasks.map((t) => this.parseTaskJSON(t));
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        subtasks: true,
        activities: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return this.parseTaskJSON(task);
  }

  async create(createTaskDto: CreateTaskDto) {
    const { labels, members, ...rest } = createTaskDto;

    const task = await this.prisma.task.create({
      data: {
        ...rest,
        labels: JSON.stringify(labels || []),
        members: JSON.stringify(members || []),
        activities: {
          create: {
            author: createTaskDto.reporter || 'Dexter',
            content: 'created this task',
            type: 'UPDATE',
          },
        },
      },
      include: {
        subtasks: true,
        activities: true,
      },
    });

    return this.parseTaskJSON(task);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const existing = await this.prisma.task.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const { labels, members, ...rest } = updateTaskDto;
    const dataToUpdate: any = { ...rest };

    if (labels !== undefined) {
      dataToUpdate.labels = JSON.stringify(labels);
    }

    if (members !== undefined) {
      dataToUpdate.members = JSON.stringify(members);
    }

    // Track priority / status activity update if changed
    const activitiesToCreate: any[] = [];
    if (updateTaskDto.priority && updateTaskDto.priority !== existing.priority) {
      activitiesToCreate.push({
        author: 'You',
        content: `changed priority from ${existing.priority} to ${updateTaskDto.priority}`,
        type: 'UPDATE',
      });
    }

    if (updateTaskDto.status && updateTaskDto.status !== existing.status) {
      activitiesToCreate.push({
        author: 'You',
        content: `changed status from ${existing.status} to ${updateTaskDto.status}`,
        type: 'UPDATE',
      });
    }

    if (activitiesToCreate.length > 0) {
      dataToUpdate.activities = {
        create: activitiesToCreate,
      };
    }

    const task = await this.prisma.task.update({
      where: { id },
      data: dataToUpdate,
      include: {
        subtasks: true,
        activities: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return this.parseTaskJSON(task);
  }

  async remove(id: string) {
    const existing = await this.prisma.task.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    await this.prisma.task.delete({ where: { id } });
    return { success: true, message: `Task ${id} deleted` };
  }

  async addSubtask(taskId: string, createSubtaskDto: CreateSubtaskDto) {
    await this.findOne(taskId);
    return this.prisma.subtask.create({
      data: {
        ...createSubtaskDto,
        taskId,
      },
    });
  }

  async updateSubtask(subtaskId: string, updateSubtaskDto: UpdateSubtaskDto) {
    return this.prisma.subtask.update({
      where: { id: subtaskId },
      data: updateSubtaskDto,
    });
  }

  async deleteSubtask(subtaskId: string) {
    await this.prisma.subtask.delete({ where: { id: subtaskId } });
    return { success: true };
  }

  async addComment(taskId: string, content: string, author?: string) {
    await this.findOne(taskId);
    return this.prisma.activity.create({
      data: {
        taskId,
        author: author || 'You',
        content,
        type: 'COMMENT',
      },
    });
  }
}
