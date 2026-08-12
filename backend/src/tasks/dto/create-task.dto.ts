import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  dueDate?: string;

  @IsOptional()
  @IsArray()
  labels?: string[];

  @IsOptional()
  @IsArray()
  members?: string[];

  @IsOptional()
  @IsString()
  reporter?: string;
}
