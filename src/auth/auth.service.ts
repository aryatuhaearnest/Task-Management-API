import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { UserRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayLoad } from './jwt-payload.interface';


@Injectable()
export class AuthService {
    constructor(@InjectRepository(UserRepository) private userRepository:UserRepository, private jwtService:JwtService){}

    async signUp(authCredentialDto:AuthCredentialDto):Promise<void>{
       return this.userRepository.createUser(authCredentialDto)

    }

    async signIn(authCredentialDto:AuthCredentialDto):Promise<{ accessToken:string }>{

        const {username,password} =authCredentialDto
        const user = await this.userRepository.findOne({username})

        if(user && (await bcrypt.compare(password,user.password))){

            const payload:JwtPayLoad ={username}
            const accessToken :string =await this.jwtService.sign(payload)
            return {accessToken}

        }else{
            throw new UnauthorizedException('Please check your login credentials')

        }

    }
}
