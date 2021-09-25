import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { json } from 'express';
import { title } from 'process';
import { stringify } from 'querystring';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/createTask.dto';
import { GetTasksFilterDto } from './dto/getTasksFilter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskService } from './task.service';

@Controller('task')
@UseGuards(AuthGuard())
export class TaskController {
private logger =new Logger('TaskController')

constructor(private _taskService:TaskService){ }

@Get()
getTasks(@Query()filterDto:GetTasksFilterDto,@GetUser()user:User):Promise <Task[]>{
    this.logger.verbose(`user "${ user.username}" retriving all tasks. Filters:${JSON.stringify(filterDto,)}`,)
    return this._taskService.getTasks(filterDto,user)
   
    }
   

 
@Post()
createTasks(@Body()createTaskDto:CreateTaskDto,@GetUser()user:User):Promise <Task>{
    this.logger.verbose(`user "${ user.username}" creating  a  tasks. Data:${JSON.stringify(createTaskDto,)}`,)

    return this._taskService.createTask(createTaskDto,user)
}

@Get('/:id')
getTaskById(@Param('id')id:string,@GetUser()user:User):Promise <Task>{
    return this._taskService.getTaskByid(id,user)

}


@Delete('/:id')
deleteTask(@Param('id')id:string,@GetUser()user:User):Promise <void>{
    return this._taskService.deleteTask(id,user)

}

@Patch('/:id/status')
updateTaskStatus(@Param('id')id:string,@Body()updateTaskStatusDto:UpdateTaskStatusDto,@GetUser()user:User):Promise <Task>{
    const {status} = updateTaskStatusDto
    return this._taskService.updateTaskStatus(id,status,user)
     
}







}


