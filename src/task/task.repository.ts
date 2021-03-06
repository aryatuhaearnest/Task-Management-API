import { InternalServerErrorException, Logger } from "@nestjs/common";
import { timestamp } from "rxjs";
import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/createTask.dto";
import { GetTasksFilterDto } from "./dto/getTasksFilter.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{
    private logger= new Logger('TaskRepository')

    async getTasks(filterDto:GetTasksFilterDto,user:User):Promise <Task[]>{
        const {status,search} =filterDto
        const query =this.createQueryBuilder('task')
        query.where({ user })

        if(status){
            query.andWhere('task.status =:status',{status})

        }
        if(search){
            query.andWhere(
                '(LOWER(task.title) LIKE LOWER (:search) OR LOWER (task.description) LIKE LOWER (:search))',
                {search: `%${search}%`}
            )

        }

        try{
            const tasks =await query.getMany();
            return tasks;

        }catch(error){
            this.logger.verbose(`failed to get tasks for user "${ user.username}" creating  a  tasks. Filters:${JSON.stringify(filterDto,)}`,error.stack)
            throw new InternalServerErrorException()

        }

        
        
    }

    async createTask(createTaskDto:CreateTaskDto,user:User):Promise<Task>{
        const {title, description} =createTaskDto
        const task =this.create({
            title,
            description,
            status:TaskStatus.OPEN,
            user
        })
        await this.save(task)
        return task
           
    
    
        }
    
}