import { IsString, Matches, MaxLength, MinLength } from "class-validator"
import { Unique } from "typeorm"

export class AuthCredentialDto{
    @IsString()
    @MinLength(4)
    @MaxLength(8)
    username:string

    @IsString()
    @MinLength(4)
    @MaxLength(8)
    // @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$w/)
    password:string
}