import {Roles} from "./Roles";

export class UserToken{
  id: number;
  username: string;
  token:string;
  roles: Roles;

  name: string;

  imgcv:string;

  telephone:string;

  email: string;


  constructor(id: number, username: string, token: string, roles: Roles, name: string, imgcv: string, telephone: string, email: string) {
    this.id = id;
    this.username = username;
    this.token = token;
    this.roles = roles;
    this.name = name;
    this.imgcv = imgcv;
    this.telephone = telephone;
    this.email = email;
  }
}
