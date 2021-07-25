import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Field, ObjectType,Int} from "type-graphql";
import { BaseEntity } from "typeorm";
import { Post } from "./Post";

@ObjectType()
@Entity()
export class User extends BaseEntity{

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
  @Column({unique:true})
  username!: string;

  @Field(() => String)
  @Column({unique:true})
  email!: string;

  //@Field(() => String)
  @Column()
  password!: string;

  @OneToMany(() => Post, post => post.creator)
  posts: Post[];

}