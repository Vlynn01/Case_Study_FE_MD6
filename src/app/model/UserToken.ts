import {Roles} from "./Roles";

export class UserToken{
  findUserByName(username: string) {
      throw new Error('Method not implemented.');
  }
  id: number;
  username: string;
  token:string;
  roles: Roles;
  constructor(id: number, name: string, token: string, roles: Roles){
    this.id = id;
    this.username = name;
    this.token = token;
    this.roles = roles;
  }
}
