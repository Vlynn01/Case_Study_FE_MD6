import {Component, OnInit} from '@angular/core';
import {EnterpriseService} from "../../services/enterprise/enterprise.service";
import {Enterprise} from "../../model/Enterprise";
import {LoginService} from "../../services/login/login.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {finalize, min, Observable} from "rxjs";
import {FormJob} from "../../model/FormJob";
import {Regime} from "../../model/Regime";
import {Field} from "../../model/Field";
import {PostEnterprise} from "../../model/PostEnterprise";
import {Router} from "@angular/router";
import {NotiEnter} from "../../model/NotiEnter";
import {UserApply} from "../../model/UserApply";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {Time} from "@angular/common";
import {UserService} from "../../services/user/user.service";

@Component({
  selector: 'app-table-enterprise',
  templateUrl: './main-enterprise.component.html',
  styleUrls: ['./main-enterprise.component.css']
})
export class MainEnterpriseComponent implements OnInit {
  p: any;
  postEnterpriseOffer!: PostEnterprise[];
  postEnterpriseDetail!: PostEnterprise;

  enterpriseLogin!: Enterprise;
  listFormJob!: FormJob[];
  listRegime!: Regime[];
  listField!: Field[];
  listPostByIdEnterprise!: PostEnterprise[];
  postEnterpriseKey!: PostEnterprise;
  postEdit!: PostEnterprise;
  imgEdit!: string
  editProfileEnterPrise!: Enterprise;
  profileForm!: any;
  fb: string = "";
  notifiApplyFromUser!: NotiEnter[];
  idConfirmNotifi!: number;
  listUserApplyByIdPost!: UserApply[];
  userApplyById!: UserApply;
  imgCvByIdUserApply!: string;
  title = "cloudsSorage";
  page: number = 1;

  enterprise!:Enterprise[];
  downloadURL: Observable<string> | undefined;

  routerChangePass(){
    this.router.navigate(["/changePass"]);
  }

  constructor(private router: Router, private storage: AngularFireStorage,private userService: UserService, private enterpriseService: EnterpriseService, private loginService: LoginService) {
  }

  userName = localStorage.getItem("username");

  ngOnInit(): void {
    this.enterpriseLoginFunction();
    this.enterpriseService.findAllFormJob().subscribe((data) => {
      this.listFormJob = data;
      console.log("find all form job")
      console.log(data)
    })
    this.enterpriseService.findAllRegime().subscribe((data) => {
      this.listRegime = data;
      console.log("find all regime")
      console.log(data)
    })
    this.loginService.findAllField().subscribe((data) => {
      this.listField = data;
      console.log("fimd all field")
      console.log(data)
    })
    this.deletePostExpired();
    this.listPostByOderPriority();
    let pageChange = document.getElementsByClassName("pageChange");
    // @ts-ignore
    pageChange[this.page-1].style.background="#FF4F57";
  }

  onFileSelected({event}: { event: any }) {
    var n = Date.now();
    const file = event.target.files[0];
    const filePath = `RoomsImages/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`RoomsImages/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.fb = url;
            }
            console.log(this.fb);
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
  }


  createPostForm = new FormGroup({
    namePostEnterprise: new FormControl("", Validators.required),
    addressMainEnterprise: new FormControl("", Validators.required),
    idField: new FormControl(),
    idFormJob: new FormControl(),
    idRegime: new FormControl(),
    salarySmallPostEnterprise: new FormControl(0, [Validators.required, Validators.min(0), Validators.pattern("^[0-9]+")]),
    salaryBigPostEnterprise: new FormControl(0, [Validators.required, Validators.min(0), Validators.pattern("^[0-9]+")]),
    vacanciesPostEnterprise: new FormControl("", Validators.required),
    expirationDatePostEnterprise: new FormControl("", Validators.required),
    describePostEnterprise: new FormControl("", Validators.required),
  })

  setStatusEnterpriseTo1() {
    this.enterpriseService.setStatusEnterpriseTo1(this.enterpriseLogin.idEnterprise).subscribe(() => {
    })
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(["/login"]);
  }

  enterpriseLoginFunction(): void {
    let username = this.loginService.getUserToken().username;
    this.enterpriseService.findEnterpriseByName(username).subscribe((data) => {
      console.log(data);
      this.enterpriseLogin = data;
      console.log(this.enterpriseLogin.statusEnterprise);
      this.getAllPostByEnterprise();
      this.notifiFromUserApply();

    })

  }

  getAllPostByEnterprise() {
    this.enterpriseService.findAllByIdEnterprise(this.enterpriseLogin.idEnterprise).subscribe((data) => {
      this.listPostByIdEnterprise = data;
    })
  }


  createPost() {
    if (this.createPostForm.valid) {
      this.functionAleartCreatePost();
      let createPostForm = this.createPostForm.value;
      let postEnterprise = {
        namePostEnterprise: createPostForm.namePostEnterprise,
        addressMainEnterprise: createPostForm.addressMainEnterprise,
        field: {
          idField: createPostForm.idField
        },
        regime: {
          idRegime: createPostForm.idRegime
        },
        formJobPostEnterprise: {
          idFormJob: createPostForm.idFormJob
        },
        salarySmallPostEnterprise: createPostForm.salarySmallPostEnterprise,
        salaryBigPostEnterprise: createPostForm.salaryBigPostEnterprise,
        vacanciesPostEnterprise: createPostForm.vacanciesPostEnterprise,
        expirationDatePostEnterprise: createPostForm.expirationDatePostEnterprise,
        describePostEnterprise: createPostForm.describePostEnterprise,
        enterprise: {
          idEnterprise: this.enterpriseLogin.idEnterprise,
        }
      }
      this.enterpriseService.savePost(postEnterprise).subscribe(() => {
        this.enterpriseLoginFunction();
        this.createPostForm = new FormGroup({
          namePostEnterprise: new FormControl("", Validators.required),
          addressMainEnterprise: new FormControl("", Validators.required),
          idField: new FormControl(),
          idFormJob: new FormControl(),
          idRegime: new FormControl(),
          salarySmallPostEnterprise: new FormControl(0, [Validators.required, Validators.min(0), Validators.pattern("^[0-9]+")]),
          salaryBigPostEnterprise: new FormControl(0, [Validators.required, Validators.min(0), Validators.pattern("^[0-9]+")]),
          vacanciesPostEnterprise: new FormControl("", Validators.required),
          expirationDatePostEnterprise: new FormControl("", Validators.required),
          describePostEnterprise: new FormControl("", Validators.required),
        })
      })
      location.reload();
    } else {
      alert("Form khong hop le !");
    }
  }

  confirmCreatePost() {
    if (this.validateExpirationDate() && this.validatesalaryBigPostEnterprise()) {
      this.createPost();
    } else {
      alert("Vui l??ng ki???m tra l???i form");
    }
  }


  // Validate c??c forrm

  validatesalaryBigPostEnterprise(): boolean {
    if (Number(this.createPostForm.value.salarySmallPostEnterprise) >= Number(this.createPostForm.value.salaryBigPostEnterprise)) {
      // @ts-ignore
      document.getElementById("validateSalary").style.display = "block";
      return false;
    } else {
      // @ts-ignore
      document.getElementById("validateSalary").style.display = "none";
      return true;
    }
  }

  validateExpirationDate() {
    let dateNow = new Date();
    let date = "'" + this.createPostForm.value.expirationDatePostEnterprise + "'";
    let dateExpirationDate = new Date(date);
    if (dateExpirationDate > dateNow) {
      // @ts-ignore
      document.getElementById("expirationDate").style.display = "none";
      return true;
    } else {
      // @ts-ignore
      document.getElementById("expirationDate").style.display = "block";
      return false;
    }
  }

  editStatus(id: number) {
    this.enterpriseService.findPostById(id).subscribe((data) => {
      this.postEnterpriseKey = data;
      if (!this.postEnterpriseKey.statusPostEnterprise) {
        this.enterpriseService.openKeyPost(id).subscribe(() => {
          alert("M??? kh??a th??nh c??ng !")
          this.getAllPostByEnterprise();
        })
      } else {
        this.enterpriseService.statusPost(id).subscribe(() => {
          alert("Kh??a th??nh c??ng !")
          this.getAllPostByEnterprise();
        })
      }
    })
  }

  //edit b??i post
  editPost(id: number) {
    this.enterpriseService.findPostById(id).subscribe((data) => {
      this.postEdit = data;
      this.editPostForm.get("namePostEnterpriseEdit")?.setValue(this.postEdit.namePostEnterprise);
      this.editPostForm.get("addressMainEnterpriseEdit")?.setValue(this.postEdit.addressMainEnterprise);
      this.editPostForm.get("salarySmallPostEnterpriseEdit")?.setValue(Number(this.postEdit.salarySmallPostEnterprise));
      this.editPostForm.get("salaryBigPostEnterpriseEdit")?.setValue(this.postEdit.salaryBigPostEnterprise);
      this.editPostForm.get("vacanciesPostEnterpriseEdit")?.setValue(this.postEdit.vacanciesPostEnterprise);
      this.editPostForm.get("expirationDatePostEnterpriseEdit")?.setValue(String(this.postEdit.expirationDatePostEnterprise));
      this.editPostForm.get("describePostEnterpriseEdit")?.setValue(this.postEdit.describePostEnterprise);
    })
  }

  editPostForm = new FormGroup({
    namePostEnterpriseEdit: new FormControl("", Validators.required),
    addressMainEnterpriseEdit: new FormControl("", Validators.required),
    idFieldEdit: new FormControl(),
    idFormJobEdit: new FormControl(),
    idRegimeEdit: new FormControl(),
    salarySmallPostEnterpriseEdit: new FormControl(0, [Validators.required, Validators.min(0), Validators.pattern("^[0-9]+")]),
    salaryBigPostEnterpriseEdit: new FormControl(0, [Validators.required, Validators.min(0), Validators.pattern("^[0-9]+")]),
    vacanciesPostEnterpriseEdit: new FormControl("", Validators.required),
    expirationDatePostEnterpriseEdit: new FormControl("", Validators.required),
    describePostEnterpriseEdit: new FormControl("", Validators.required),
  })

  editPostConfim() {
    if (this.editPostForm.valid) {
      let editPostForm = this.editPostForm.value;
      let postEnterprise = {
        idPostEnterprise: this.postEdit.idPostEnterprise,
        namePostEnterprise: editPostForm.namePostEnterpriseEdit,
        addressMainEnterprise: editPostForm.addressMainEnterpriseEdit,
        field: {
          idField: editPostForm.idFieldEdit
        },
        regime: {
          idRegime: editPostForm.idRegimeEdit
        },
        formJobPostEnterprise: {
          idFormJob: editPostForm.idFormJobEdit
        },
        salarySmallPostEnterprise: editPostForm.salarySmallPostEnterpriseEdit,
        salaryBigPostEnterprise: editPostForm.salaryBigPostEnterpriseEdit,
        vacanciesPostEnterprise: editPostForm.vacanciesPostEnterpriseEdit,
        expirationDatePostEnterprise: editPostForm.expirationDatePostEnterpriseEdit,
        describePostEnterprise: editPostForm.describePostEnterpriseEdit,
        enterprise: {
          idEnterprise: this.enterpriseLogin.idEnterprise,
        }
      }
      this.enterpriseService.editPost(postEnterprise).subscribe(() => {
        alert("Ch???nh s???a b??i vi???t  th??nh c??ng!")
        this.getAllPostByEnterprise();
        location.reload();
      })
    } else {
      alert("Xin vui l??ng ki???m tra l???i form !")
    }
  }

//    danh s??ch th??ng b??o khi c?? ng apply
  notifiFromUserApply() {
    let idEnterprise = this.enterpriseLogin.idEnterprise;
    this.enterpriseService.listNorifiFromApplyUser(idEnterprise).subscribe((data) => {
      this.notifiApplyFromUser = data;
    })
  }

  setIdConfirmNotifi(id: number) {
    this.idConfirmNotifi = id;
  }

  confirmNotifi() {
    this.funcitonAleartConfirmUserCv();
    this.enterpriseService.confirmNotifi(this.idConfirmNotifi).subscribe(() => {
      this.notifiFromUserApply();
    })
  }

  userApplyByIdPost(id: number) {
    this.enterpriseService.allUserApplyByIdPost(id).subscribe((data) => {
      this.listUserApplyByIdPost = data;
    })
  }


//  X??A B??I ????NG khi h???t h???n
  deletePostExpired() {
    this.enterpriseService.deletePostExpired().subscribe(() => {
    })
  }

//  t??m d???i t?????ng userApply theo id;

  getUserApplyById(id: number) {
    this.enterpriseService.getUserApplyById(id).subscribe((data) => {
      this.userApplyById = data;
      this.imgCvByIdUserApply = this.userApplyById.imgCV;
      console.log(this.imgCvByIdUserApply);
      console.log(id)
    })
  }

  editProfile() {

    let id = this.enterpriseLogin.idEnterprise;
    this.enterpriseService.findEnterpriseById(id).subscribe((data) => {
      this.editProfileEnterPrise = data;
      this.imgEdit = this.editProfileEnterPrise.imgEnterprise;
      this.formProfile.get("nameEnterprise")?.setValue(this.editProfileEnterPrise.nameEnterprise);
      this.formProfile.get("codeConfirmEnterprise")?.setValue(this.editProfileEnterPrise.codeConfirmEnterprise);
      this.formProfile.get("gmailEnterprise")?.setValue(this.editProfileEnterPrise.gmailEnterprise);
      this.formProfile.get("addressMainEnterprise")?.setValue(this.editProfileEnterPrise.addressMainEnterprise);
      // this.formProfile.get("fieldEnterprise")?.setValue(this.editProfileEnterPrise.fieldEnterprise);
      this.formProfile.get("describeEnterprise")?.setValue(this.editProfileEnterPrise.describeEnterprise);
      // this.formProfile.get("imgEnterprise")?.setValue(this.editProfileEnterPrise.imgEnterprise);
      // this.formProfile.get("mail")?.setValue(this.editProfileEnterPrise);
    })

  }

  formProfile = new FormGroup({
    // idEnterprise: new FormControl(0, Validators.required),
    nameEnterprise: new FormControl("", Validators.required),
    codeConfirmEnterprise: new FormControl("", Validators.required),
    gmailEnterprise: new FormControl("", Validators.required),
    // imgEnterprise: new FormControl("", Validators.required),
    addressMainEnterprise: new FormControl("", Validators.required),
    idField: new FormControl(),
    describeEnterprise: new FormControl("", Validators.required),
  })


  editProfileEnterprise() {
    let filed = this.formProfile.value;
    let filedNew = {
      idEnterprise: this.enterpriseLogin.idEnterprise,
      nameEnterprise: filed.nameEnterprise,
      codeConfirmEnterprise: filed.codeConfirmEnterprise,
      gmailEnterprise: filed.gmailEnterprise,
      // Ch???y h??m upload ???nh v?? l???y ra link ???nh
      imgEnterprise: this.imgEdit,
      addressMainEnterprise: filed.addressMainEnterprise,
      describeEnterprise: filed.describeEnterprise,
      fieldEnterprise: {
        idField: filed.idField
      }
    }

    this.enterpriseService.editProfile(filedNew).subscribe(() => {
      alert("L??u thay ?????i th??nh c??ng");
      location.reload();
    })
  }

  funcitonAleartConfirmUserCv() {
    // @ts-ignore
    document.getElementById("modalConfirmUserCv").style.display = "block";
    setTimeout(function () {
      // @ts-ignore
      document.getElementById("modalConfirmUserCv").style.display = "none";
      // @ts-ignore
      document.getElementById("modalConfirmCvUser").style.display = "block";
      setTimeout(function () {
        // @ts-ignore
        document.getElementById("modalConfirmCvUser").style.display = "none";

      }, 3000);
    }, 3500)
  }


  functionAleartCreatePost() {
    // @ts-ignore
    document.getElementById("modalConfirmCreatePost").style.display = "block";
    setTimeout(function () {
      // @ts-ignore
      document.getElementById("modalConfirmCreatePost").style.display = "none";

    }, 3000);
  }

  pageChange(page: number) {
    this.page = page;
    let pageChange = document.getElementsByClassName("pageChange");
    // @ts-ignore
    pageChange[this.page - 1].style.background = "#FF4F57";
    for (let i = 0; i < pageChange.length; i++) {
      if (i !== this.page - 1) {
        // @ts-ignore
        pageChange[i].style.background = "#fff";
      }
    }
    this.listPostByOderPriority();

  }
  preveAfter(){
    let pageChange = document.getElementsByClassName("pageChange");
    // @ts-ignore
    pageChange[this.page].style.background="#FF4F57";
    for(let i=0;i<pageChange.length;i++){
      if(i!== this.page){
        // @ts-ignore
        pageChange[i].style.background="#fff";
      }
    }
    this.page=this.page+1;
    this.listPostByOderPriority();

    console.log(this.page)
  }
  preveBefore(){
    console.log(this.page)
    let pageChange = document.getElementsByClassName("pageChange");
    // @ts-ignore
    pageChange[this.page-2].style.background="#FF4F57";
    for(let i=0;i<pageChange.length;i++){
      if(i!== this.page-2){
        // @ts-ignore
        pageChange[i].style.background="#fff";
      }
    }
    this.page=this.page-1;
    this.listPostByOderPriority();
  }
  postDetail(id: number) {
    this.userService.postDetail(id).subscribe((data) => {
      this.postEnterpriseDetail = data;
    })
  }
  listPostByOderPriority() {
    return this.userService.listPostByOderPriority(this.loginService.getUserToken().id,this.page).subscribe((data) => {
      this.postEnterpriseOffer = data;
    })
  }
}
