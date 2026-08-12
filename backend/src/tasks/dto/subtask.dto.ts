import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateSubtaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  dueDate?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}

export class UpdateSubtaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  dueDate?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
