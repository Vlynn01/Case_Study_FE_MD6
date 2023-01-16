import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../services/login/login.service";
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginService: LoginService, private router: Router) {
  }

  ngOnInit(): void {
  }

  loginForm = new FormGroup({
    username: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required)
  })


  routerRegisterEnterprise(){
       this.router.navigate(["/registerEnterprise"])
  }
  routerRegisterUser() {
          this.router.navigate(["/registerUser"]);
  }

  routerForgotPass(){
    this.router.navigate(["/forgotPass"]);
  }
  login() {
     if(this.loginForm.valid){
       this.loginService.login(this.loginForm.value).subscribe((data) => {
         this.loginService.setUserToken(data);
         this.loginService.setToken(data.token);


         // nguyen sua
        //  this.loginService.setUsername(data.username);
        // this.loginService.setEmail(data.email);
        // this.loginService.setTelephone(data.telephone);
        // this.loginService.setName(data.name);

       // nguyen sua

         if(data.roles.name==="ROLE_ADMIN"){
           this.router.navigate(["/admin"]);
         }else if(data.roles.name==="ROLE_ENTERPRISE"){
           this.router.navigate(["/enterprise"]);
         }
         else if(data.roles.name==="ROLE_USER"){
           this.router.navigate(["/user"]);
         }
       })
     }
     else {
       alert("Dữ liệu form không hợp lệ !");
     }
  }
}
