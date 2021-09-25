import { Injectable, NotFoundException } from '@nestjs/common';
import {  TaskStatus } from './task-status.enum';
import {v4 as uuid} from 'uuid'
import { CreateTaskDto } from './dto/createTask.dto';
import { GetTasksFilterDto } from './dto/getTasksFilter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TaskService {

    constructor(@InjectRepository(TaskRepository) private taskRepository:TaskRepository){}
    


    async getTasks(filterDto:GetTasksFilterDto,user:User):Promise <Task[]>{
        return this.taskRepository.getTasks(filterDto,user)
        
    }

    async getTaskByid(id:string,user:User):Promise<Task>{
        const found= await this.taskRepository.findOne({where: {id ,user}})

        if(!found){
            throw new NotFoundException()
        
        }

                return found


    }

   async createTask(createTaskDto:CreateTaskDto,user:User):Promise<Task>{
       return this.taskRepository.createTask(createTaskDto,user)
   
       


    }


    async deleteTask(id:string,user:User):Promise <void>{
        const result =await this.taskRepository.delete({id,user})
        if(result.affected ===0){
            throw new NotFoundException()

        }
        

    }

    async updateTaskStatus(id:string , status :TaskStatus,user:User):Promise<Task>{
        const task =await this.getTaskByid(id,user)
        task.status =status

        await this.taskRepository.save(task)
        return task
    }

    // getTasksWithFilters(filterDto:GetTasksFilterDto):Task[]{
    //     const {status,search} =filterDto


    //     let tasks= this.getAllTasks()

    //     if(status){
    //         tasks = tasks.filter((task) => task.status === status)
           
    //         }

    //     if(search){
    //         tasks = tasks.filter((task) => {
    //             if(task.title.includes(search) || task.description.includes(search)){
    //                 return true
    //             }

    //             return false;
                
            

    //     })

    // }

    //     return tasks

    // }

}
