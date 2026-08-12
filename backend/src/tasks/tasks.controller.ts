import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateSubtaskDto, UpdateSubtaskDto } from './dto/subtask.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
  ) {
    return this.tasksService.findAll({ search, status, priority });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }

  @Post(':id/subtasks')
  addSubtask(
    @Param('id') id: string,
    @Body() createSubtaskDto: CreateSubtaskDto,
  ) {
    return this.tasksService.addSubtask(id, createSubtaskDto);
  }

  @Patch('subtasks/:subtaskId')
  updateSubtask(
    @Param('subtaskId') subtaskId: string,
    @Body() updateSubtaskDto: UpdateSubtaskDto,
  ) {
    return this.tasksService.updateSubtask(subtaskId, updateSubtaskDto);
  }

  @Delete('subtasks/:subtaskId')
  deleteSubtask(@Param('subtaskId') subtaskId: string) {
    return this.tasksService.deleteSubtask(subtaskId);
  }

  @Post(':id/comments')
  addComment(
    @Param('id') id: string,
    @Body('content') content: string,
    @Body('author') author?: string,
  ) {
    return this.tasksService.addComment(id, content, author);
  }
}
