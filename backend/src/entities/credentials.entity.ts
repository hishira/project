import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Credentials {
  constructor(login: string, email: string, password: string) {
    this.login = login;
    this.email = email;
    this.password = password;
  }
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  login: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false }) // Don't include password in queries by default
  password: string;
}
