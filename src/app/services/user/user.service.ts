import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {PostEnterprise} from "../../model/PostEnterprise";
import {FormJob} from "../../model/FormJob";
import {Enterprise} from "../../model/Enterprise";
import {AppUser} from "../../model/AppUser";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  listPostByOderPriority(id:number,page:number):Observable<PostEnterprise[]>{
    return this.http.get<any>(`http://localhost:8080/user/find-everything?user_id=${id}&page=${page}`)
  }
  getAll( page:any):Observable<PostEnterprise[]>{
    return this.http.get<any>(`http://localhost:8080/user/getAll/${page}`,);
  }
  saveCv(cvUser:any):Observable<any>{
    return this.http.post<any>(`http://localhost:8080/user/saveCvUser/`,cvUser);
  }
  postDetail(id:number):Observable<any>{
    return this.http.get<any>(`http://localhost:8080/user/postDetail/${id}`);
  }
  findCvByIdUser(id:number):Observable<any>{
    return this.http.get<any>(`http://localhost:8080/user/findCvByIdUser/${id}`);
  }
  saveApplyJob(userApplyJob:any){
    return this.http.post<any>(`http://localhost:8080/user/saveApplyJob`,userApplyJob);
  }
  findUserApplyByIdAppUserAndIdPost(idAppUser:number,idPost:number){
    return this.http.get<any>(`http://localhost:8080/user/findUserApplyByIdAppUserAndIdPost/${idAppUser}/${idPost}`);
  }
  deletePostExpired():Observable<any>{
    return this.http.get<any>(`http://localhost:8080/user/deletePostExpired`);
  }

  showListApply(id: number,page:number): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/user/listUserApplyByIdAppUser/${id}/${page}`);
  }
  findImgCvApply(idUser:number,idPost:number):Observable<any>{
    return this.http.get<any>(`http://localhost:8080/user/findImgCvApply/${idUser}/${idPost}`)
  }

  findByFieldAndFormJob(FieldAndFormJob:any):Observable<any>{
    return this.http.post<any>(`http://localhost:8080/user/findByFieldAndFormJob`, FieldAndFormJob)
  }

  // http://localhost:8080/user/find-everything?abc=xxx&xyz=xxx
  findEverything(param_str:string, user_id : number):Observable<any>{
    return this.http.get<any>(`http://localhost:8080/user/find-everything?user_id=`+ user_id + param_str)
  }


}
