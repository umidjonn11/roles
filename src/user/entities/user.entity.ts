import { UserRole } from "src/security/roles.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"users"})
export class UserRepository {
    @PrimaryGeneratedColumn()
    id:string
    @Column()
    name:string
    @Column({nullable:false})
    password:string
    @Column({nullable:false,unique:true})
    email:string
    @Column({nullable:false,unique:true})
    username:string
    @Column({default:UserRole.user})
    role:string
    // @Column({nullable:false,select:false})
    // refreshTken:string
    @Column({default:true})
    isActive:boolean


}
