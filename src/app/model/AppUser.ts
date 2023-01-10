import {Roles} from "./Roles";

export class AppUser{
  public id:number;
  public username:string;
  public email:string;
  public password:string;
  public roles:Roles[];


  constructor(id: number, username: string, email: string, password: string, roles: Roles[]) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.roles = roles;
  }
}
