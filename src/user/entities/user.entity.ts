import { UserRole } from 'src/security/roles.enum';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {hash} from "bcrypt"
@Entity({ name: 'users' })
export class UserRepository {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  name: string;
  @Column({ nullable: false, select: false })
  password: string;
  @Column({ nullable: false, unique: true })
  email: string;
  @Column({ nullable: false, unique: true })
  username: string;
  @Column({ default: UserRole.user })
  role: string;
  @Column({nullable:true,select:false})
  refreshToken:string
  @Column({ default: true })
  isActive: boolean;


  @BeforeInsert()
  async hash(){
    this.password=await hash(this.password,12)  
  }
}
