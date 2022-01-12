import { Component, OnInit } from '@angular/core';
import { UserService, Users, PermissionUtility, UserRoleService, UserRoles} from '../../../../shared';
import swal from 'sweetalert';
import {
  NgbModal,
  ModalDismissReasons,
  NgbPanelChangeEvent,
  NgbCarouselConfig,
  NgbModalRef
} from '@ng-bootstrap/ng-bootstrap';
import { LoginService, HeaderService, User } from '../../../../shared/index';


@Component({
  selector: 'user',
  templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
    ,
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class UserComponent implements OnInit {
  ////Member Variables
    p: number = 1;
    id: any='';
  filter: any = '';
  //guid: any;
  public modalReference: NgbModalRef;
  instvalue: any;
  public closeResult: string;
  public newPassword: any;
  public confirmPassword: any;
  public oldPassword: any;
  char5=new RegExp('^[A-Za-z0-9~!@#$%^&*()]+$'); 
 
  users: any[] = [];
  emps: any[] = [];
  roles: any[] = [];
  offices: any[] = [];
  usersdetail: any[] = [];
 isLoading: any = false;
  user_ID: any = 0;
  userid: any = 0;
  UserNo: any = "";
  login: any = "";
  login1: any = "";
  password: any = "";
  confirpassword: any = "";
  empid: any = 0;
  empname: any = "";
  fathername: any = "";
  department: any = "";
  designation: any = "";
  office: any = "";
  officE_CODE: any = 1;
  active: any = false;
  mode: any = false;
  card1display: any = '';
  card2display: any = 'none';
  addbutton: any = '';
  card1style: any = 'card col-sm-12'
  card2style: any = 'card col-sm-5'
  ShowEmp1: any = 'none'
  ShowEmp2: any = 'none'
  public checked: boolean = true;
  public unchecked: boolean = false;
  officeCode:any;
  logedInUserID: any = 1;
  btnmode: any = 0;
  roleid : any = 0;
  rolename : any = "";
  public permissionUtility:PermissionUtility=new PermissionUtility();
  constructor(private service: UserService, private loginService: LoginService, private roleService: UserRoleService, private modalService: NgbModal) { }

  ngOnInit() {
    this.getUsers();
    this.getRole();
    this.getOffices();
    this.logedInUserID = this.service.getSession('user_ID');
    this.permissionUtility.setPagePermissions(10004);
     }
  ////////////////////////
  
     
  checkValue(event: any) {
    if (this.mode == false) {
        if (event == true && this.permissionUtility.PermissionEdit!='none')
            this.ShowEmp1 = '';
    } else {
        if (event == true && this.permissionUtility.PermissionEdit!='none')
            this.ShowEmp2 = '';
    }
}

  //getUsers
  getUsers() {
    this.isLoading =true;
    this.service.getUsers()
      .subscribe(response => {
        this.users = (response.json());
        this.isLoading = false;
        //console.log(response.json());
        this.filter = '';
      });
  }
  //getEmployees
  getEmps(OFFICE_CODE: any) {
    this.isLoading =true;
    this.service.getEmp(OFFICE_CODE)
      .subscribe(response => {
        this.emps = (response.json());
        this.empid = this.emps[0].empid;
        this.empname = this.emps[0].empname;
        this.isLoading = false;
        this.officeCode = OFFICE_CODE;
        this.getRole();
        // console.log(response.json());
      });
  }
  //getRole
  getRole() {
    this.isLoading =true;
    this.roleService.getRole()
      .subscribe(response => {
        this.roles = (response.json());
        this.roleid = this.roles[1].roleid; 
        this.rolename = this.roles[1].rolename;
        if(this.officeCode != "0")
        {
          this.roles.splice(5,1);
        }
        else
        {
          this.roles = (response.json());
          this.roleid = this.roles[0].roleid; 
          this.rolename = this.roles[1].rolename;
        }
        this.isLoading = false;
        //console.log(response.json());
      });
  }
  //getOffices
  getOffices() {
    this.isLoading =true;
    this.service.getOffice()
      .subscribe(response => {
        this.offices = (response.json());
        this.officE_CODE = this.offices[0].officE_CODE;
        this.office = this.offices[0].office;

        //getEmp
        this.service.getEmp(this.officE_CODE)
          .subscribe(response => {
            this.emps = (response.json());
            this.empid = this.emps[0].empid;
            this.empname = this.emps[0].empname;
          });
        this.isLoading = false;
        // console.log(response.json());
      });
  }
  //matchPassword
  matchPassword(confirpassword) {
    if (this.password != confirpassword) {
      alert("! match...");
    }
    else { }
  }
  //getDetailByID
  getDetailsByID(user_ID) {
    this.service.getDetailsByID(user_ID)
      .subscribe((o: Users) => {
        this.user_ID = o.user_ID;
        this.login = o.login;
        this.empname = o.empname;
        this.empid = o.emp_ID;
        this.office = o.office;
        this.active = o.active;
        this.roleService.getUserRolesByID(user_ID)
          .subscribe((r:UserRoles) => {
            this.roleid = r.rolE_ID;
          })
      }); 
      this.ShowEmp1='none';
      this.ShowEmp2='none';
      this.checkValue(this.active);
      this.isLoading = false;
  }
  saveUser(login: any, password: any, roleid: any, active: any, officE_CODE: any) {
    var user = new Users(this.logedInUserID, login, password, this.empid, "", this.officE_CODE, active);
   // console.log(user);
    if (this.login != "") {
      this.service.saveUser(user).then(
        //(response) => { this.getUsers(this.supplier_Name); console.log(response); },
        (error) => console.log(error));
      var userroles = new UserRoles(this.empid, roleid, 1, officE_CODE, false, active,0);
      //console.log(userroles);
        this.roleService.saveUserRoles(userroles).then(
          (error) => console.log(error));
      this.user_ID = '';
      this.empname = '';
      this.login = '';
      this.office = '';
      this.active = true;
      this.password = '';
      this.confirpassword = '';
      this.card1style = 'card col-sm-12'
      this.addbutton = '';
      this.card2display = 'none'; 1
      this.ShowEmp1 = 'none'
      this.ShowEmp2 = 'none'
      this.ngOnInit();
    }
    else
      swal("Login must be define.");
  }
  updateUser(login: any, password: any, roleid: any, active: any, officE_CODE: any) {
    var user = new Users(this.logedInUserID, login, password, this.empid, "", 0,  active);

    if (login != "") {
      this.service.updateUser(user).then(
        //(response) => { this.getUsers(this.supplier_Name); console.log(response); },
        (error) => console.log(error));
      
      var userroles = new UserRoles(this.empid, roleid, 1, officE_CODE, false, active,0);
      console.log(userroles);
      
        this.roleService.updateUserRoles(userroles).then(
          (error) => console.log(error));
      this.user_ID = '';
      this.empname = '';
      this.empid = '';
      this.login = '';
      this.office = '';
      this.active = true;

      this.password = '';
      this.confirpassword = '';
      this.card1style = 'card col-sm-12'
      this.addbutton = '';
      this.card2display = 'none'; 1
      this.ShowEmp1 = 'none'
      this.ShowEmp2 = 'none'
      this.getUsers();
      this.checkValue(this.active);
      this.modalReference.close();
    }
    else
      swal("Login must be define.");


  }


  setActive(uID) {
    this.service.setActive(uID).subscribe((data) => {
      this.getUsers();
    }, error => console.error(error))
  }
    Add() {
    this.mode = false;
    this.permissionUtility.PermissionAdd='none';
    this.user_ID = '';
    this.login = '';
    this.password = '';
    this.confirpassword = '';
    this.active = true;
    this.btnmode = 0;
    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    this.ShowEmp1 = ''
    this.ShowEmp2 = 'none'
    this.checkValue(this.active);
    this.HandleGrid();
  }
    Edit() {
    this.mode = true;
    this.permissionUtility.PermissionAdd='none';
    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    this.ShowEmp1 = 'none';
    if(this.permissionUtility.PermissionEdit)
    this.ShowEmp2 = '';
    this.checkValue(this.active);
    this.HandleGrid();
  }
  View() {
    this.mode = false;
    this.permissionUtility.PermissionAdd='none';
    this.permissionUtility.PermissionEdit='none';
    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    this.ShowEmp1 = 'none';
    this.ShowEmp2 = 'none';
    this.HandleGrid();
  }
  Cancel() {
    this.permissionUtility.PermissionAdd='';
    if(this.permissionUtility.PermissionView=='' )
    this.permissionUtility.PermissionEdit='none';
    this.permissionUtility.PermissionEdit='';
    this.user_ID = '';
    this.empname = '';
    this.login = '';
    this.office = '';
    this.active = 1;
    this.empid = '';
    this.roleid = '';
    this.password = '';
     this.confirpassword = '';
    this.card1style = 'card col-sm-12'
    this.addbutton = '';
    this.card2display = 'none'; 1
      this.ShowEmp1 = 'none';
      this.ShowEmp2 = 'none';

        //handles default visibility 
        $('#PageGrid').show();
    }
    //handles visibility onresize window
    onResize(event) {
        if ($('#frm').is(":visible") && $(document).width() <= 767)
            $('#PageGrid').hide();
        else
            $('#PageGrid').show();
    }
    //handles visibility on button add click
    HandleGrid() {
        if ($(document).width() <= 767) {
            $('#PageGrid').hide();
        } else {
            $('#PageGrid').show();
        }
    }

    open(content, id, login) {
      this.modalReference = this.modalService.open(content, { windowClass: 'customSize'});
      $("#submitSave").prop('disabled',true);
      this.instvalue = "none"
      this.modalReference.result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
      this.login1 = login;
      this.userid = id;
      this.active = this.user_ID;
      this.active = true;
    }
    openToDoList(toDoListContent) {
      this.modalReference = this.modalService.open(toDoListContent, { size: 'custom' ,windowClass: 'size'});
      this.modalReference.result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  
    private getDismissReason(reason: any): string {
      if (reason === ModalDismissReasons.ESC) {
        return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        return 'by clicking on a backdrop';
      } else {
        return `with: ${reason}`;
      }
    }

    changePassword1(login1, password) { 
      
       
            if (this.newPassword != this.confirmPassword) {
              alert("confirm password does not match.");
            }
            else if(this.char5.test(this.newPassword)) {
              this.loginService.changePassword1(this.userid, password)
                .subscribe(response => {
                  console.log('-------------------'+response);
                });
              this.modalReference.close();
            }

}

}




