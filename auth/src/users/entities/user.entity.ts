// Other Dependencies
import { AfterLoad, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ObjectID, ObjectIdColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Exclude } from "class-transformer";


@Entity()
export class User {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Exclude()
  private previousPassword: string;

  @Column({ nullable: true })
  @Exclude()
  currentHashedRefreshToken: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @AfterLoad()
  loadPreviousPassword() {
    this.previousPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.previousPassword !== this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  constructor(user?: Partial<User>) {
    Object.assign(this, user);
  }
}
