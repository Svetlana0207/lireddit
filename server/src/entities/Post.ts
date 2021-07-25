import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Field, ObjectType,Int} from "type-graphql";
import { BaseEntity } from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Post extends BaseEntity {

  @Field(()=>Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date 

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt:Date 

  @Field(() => String)
  @Column()
  title!: string;

  @Field(() => String)
  @Column()
  text!: string;

  @Field(() => String)
  @Column({type:'int',default:0})
  points!: number;

  @Field(() => Int)
  @Column()
  creatorId:number


  @ManyToOne(() => User, user => user.posts)
  creator: User;

}