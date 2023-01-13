import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserToken} from "../../model/UserToken";
import {Field} from "../../model/Field";
import {AppUser} from "../../model/AppUser";
import {Enterprise} from "../../model/Enterprise";
import {FormJob} from "../../model/FormJob";
import {PostEnterprise} from "../../model/PostEnterprise";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
    findAllFormJob1() {
        throw new Error('Method not implemented.');
    }
    findAllFormJob() {
        throw new Error('Method not implemented.');
    }

  constructor(private http:HttpClient) { }
  login(user: any): Observable<UserToken>{
    return this.http.post<UserToken>("http://localhost:8080/login",user);
  }
  setToken(token: string){
    localStorage.setItem("token",token);
  }
  getToken(){
       return localStorage.getItem("token");
  }

  // nguyen sua

  setUsername(username:any){
    return localStorage.setItem("username",username);
  }
  getUsername(){
    return localStorage.getItem("username");
  }
  setEmail(email:any){
    return localStorage.setItem("email",email);
  }
  getEmail(){
  return localStorage.getItem("email");
}

setName(name:string){
    return localStorage.setItem("name",name);
}
 getName(name:string){
    return localStorage.getItem("name");
 }

 setTelephone(telephone:string){
    return localStorage.setItem("telephone",telephone)
 }
 getTelephone(telephone:string){
    return localStorage.getItem("telephone");
 }

  setimgCV(imgCV:string){
    return localStorage.setItem("telephone",imgCV)
  }
  getimgCV(imgCV:string){
    return localStorage.getItem("imgCV");
  }


  // nguyen sua



  setUserToken(userToken: UserToken){
    localStorage.setItem("userToken",JSON.stringify(userToken));
  }
  getUserToken(): UserToken{
    return JSON.parse(<string>localStorage.getItem("userToken"));
  }
  register(enterprise: any): Observable<any>{
    return this.http.post<any>("http://localhost:8080/register/enterprise",enterprise);
  }
  registerUser(user:any){
    return this.http.post<any>("http://localhost:8080/register/user",user);
  }
  findAllField():Observable<Field[]>{
    return this.http.get<any>("http://localhost:8080/register/findAllField");
  }

  findAllFormJob2():Observable<FormJob[]>{
    return this.http.get<any>(`http://localhost:8080/user/findAllFormJob`,);
  }

  findAllAddress():Observable<PostEnterprise[]>{
    return this.http.get<any>(`http://localhost:8080/user/find-all-address`,)
  }
  findAllEnterprise1():Observable<Enterprise[]>{
    return this.http.get<any>(`http://localhost:8080/user/find-all-enterprise`,)
  }

  findUserByName(name:string):Observable<AppUser>{
    return this.http.get<any>(`http://localhost:8080/user/finduser/${name}`)
  }
  findFieldById(id:number):Observable<Field>{
    return this.http.get<any>(`http://localhost:8080/register/find/${id}`);
  }
  logout(){
      localStorage.removeItem("userToken");
      localStorage.removeItem("token");
  }
  findAllUser():Observable<AppUser[]>{
    return this.http.get<any>("http://localhost:8080/register/checkUser");
  }
  findAllEnterprise():Observable<Enterprise[]>{
  return this.http.get<any>("http://localhost:8080/register/checkEnterprise");
}



changePassword(checkPassWord:any):Observable<any>{
    return  this.http.post<any>(`http://localhost:8080/changePassword`,checkPassWord);
}


  findPostByUser(post:any){
    return this.http.post<any>("http://localhost:8080/user/findPostUser",post);
  }
  findPostByUserField(post:any){
    return this.http.post<any>("http://localhost:8080/user/findPostUserField",post);
  }

  findPostByUserFormJob(post:any){
    return this.http.post<any>("http://localhost:8080/user/findByAddressAndFormJob",post);
  }
}
