import { Component, OnInit } from '@angular/core';
import { UserRoleService, UserRoles, PermissionUtility } from '../../../../shared';
import swal from 'sweetalert';


@Component({
  selector: 'user-role',
  templateUrl: './user-role.component.html',
    styleUrls: ['./user-role.component.scss']
    ,
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class UserRoleComponent implements OnInit {
  ////Member Variables
  p: number = 1;
  //guid: any;
  userroles: any[] = [];
  offices: any[] = [];
  emps: any[] = [];
  roles: any[] = [];
  useroffices: any[] = [];
  userid: any = 0;
  userroleno: any = "";
  officecode: any = 1
  officename: any = "";
    empid: any = 0;
    id: any;
  empname: any = "";
  roleid: any = 1;
  rolename: any = "";
  username: any = "";
  suboffice: any = false;
  active: any = false;
  mode: any = false;
  userofficecode: any = 1;
  userofficename: any = "";

  readonly: any = false;
 isLoading: any = false;
  card1display: any = '';
  card2display: any = 'none';
  addbutton: any = '';
  card1style: any = 'card col-sm-12'
  card2style: any = 'card col-sm-5'
  ShowEmp1: any = 'none'
  ShowEmp2: any = 'none'
  public checked: boolean = true;
  public unchecked: boolean = false;
  logedInUserID: any = 1;
  updatemode: any = 0;
  officeCode: any;
  rid : any;
  public permissionUtility:PermissionUtility=new PermissionUtility();
  constructor(private service: UserRoleService) { }

  ngOnInit() {
    this.getUserRoles();
    this.getOffices();
    this.getRole();
    this.getUserOffice();
    this.logedInUserID = this.service.getSession('user_ID');
    this.permissionUtility.setPagePermissions(10006);
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
  getUserRoles() {
    this.isLoading =true;
    this.service.getUserRoles()
      .subscribe(response => {
        this.userroles = (response.json());
        this.isLoading = false;
         console.log(response.json());
      });
  }
  //getOffices
  getOffices() {
    this.isLoading =true;
    this.service.getOffice()
      .subscribe(response => {
        this.offices = (response.json());
        this.officecode = this.offices[0].officecode;
        this.officename = this.offices[0].officename;

        //getEmp
        this.service.getUsers(this.officecode)
          .subscribe(response => {
            this.emps = (response.json());
            this.empid = this.emps[0].empid;
            this.empname = this.emps[0].empname;
            
          });
        this.isLoading = false;
        
        // console.log(response.json());
      });
  }
  //getUsers
  getUsers(OFFICE_CODE: any) {
    this.isLoading =true;
    this.service.getUsers(OFFICE_CODE)
      .subscribe(response => {
        this.emps = (response.json());
        this.userid = this.emps[0].userid;
        this.empid = this.emps[0].empid;
        this.empname = this.emps[0].empname;
        this.isLoading = false;
        this.officeCode= this.officecode;
        this.getRole();
        // console.log(response.json());
      });
  }
  //getRole
  getRole() {
    this.isLoading =true;
    this.service.getRole()
      .subscribe(response => {
        this.roles = (response.json());
        if(this.officeCode != "0")
        {
          this.roles.splice(5,1);
        }
        else
        {
          this.roles = (response.json());
        }
        this.isLoading = false;
        //console.log(response.json());
      });
  }
  //getUserOffice
  getUserOffice() {
    this.isLoading =true;
    this.service.getUserOffice()
      .subscribe(response => {
        this.useroffices = (response.json());
        this.userofficecode = this.useroffices[0].userofficecode;
        this.userofficename = this.useroffices[0].userofficename;
        this.isLoading = false;
        // console.log(response.json());
      });
  }
  //saveUserRole
  saveUserRole(empid: any, roleid: any, userofficecode: any, suboffice: any, active: any) {

    if (this.updatemode == 0) {
      var userroles = new UserRoles(empid, roleid, 1, userofficecode, suboffice, active,0);
      //console.log(userroles);
      if (empid != 0) {
        this.service.saveUserRoles(userroles).then(
          (error) => console.log(error));
        this.suboffice = true;
        this.active = true;
        this.readonly = false;
        this.card1style = 'card col-sm-12'
        this.addbutton = '';
        this.card2display = 'none'; 1
        this.ShowEmp1 = 'none'
        this.ShowEmp2 = 'none'
        this.ngOnInit();
      }
      else
        swal("UserName must be defined.");

    }
    else {
      var userroles = new UserRoles(empid, roleid, 1, userofficecode, suboffice, active,0);
      //console.log(userroles);
      if (empid != 0) {
        this.service.updateUserRoles(userroles).then(
          (error) => console.log(error));
        this.suboffice = 0;
        this.active = 0;
        this.readonly = false;
        this.card1style = 'card col-sm-12'
        this.addbutton = '';
        this.card2display = 'none'; 1
        this.ShowEmp1 = 'none'
        this.ShowEmp2 = 'none'
        this.ngOnInit();
        this.updatemode = 0;
      }
      else
        swal("UserName must be defined.");
    }
    }

    //saveUserRole
    updateUserRole(empid: any, roleid: any, userofficecode: any, suboffice: any, active: any) {
        if (this.updatemode == 1) {
            var userroles = new UserRoles(empid, roleid, 1, userofficecode, suboffice, active,this.rid);
            //console.log(userroles);
            if (empid != 0) {
                this.service.updateUserRoles(userroles).then(
                    (error) => console.log(error));
                this.suboffice = true;
                this.active = true;
                this.readonly = false;
                this.card1style = 'card col-sm-12'
                this.addbutton = '';
                this.card2display = 'none'; 1
                this.ShowEmp1 = 'none'
                this.ShowEmp2 = 'none'
                this.ngOnInit();
            }
            else
                swal("UserName must be defined.");

        }
        else {
            var userroles = new UserRoles(empid, roleid, 1, userofficecode, suboffice, active, this.rid);
            //console.log(userroles);
            if (empid != 0) {
                this.service.updateUserRoles(userroles).then(
                    (error) => console.log(error));
                this.suboffice = 0;
                this.active = 0;
                this.readonly = false;
                this.card1style = 'card col-sm-12'
                this.addbutton = '';
                this.card2display = 'none'; 1
                this.ShowEmp1 = 'none'
                this.ShowEmp2 = 'none'
                this.ngOnInit();
                this.updatemode = 1;
            }
            else
                swal("UserName must be defined.");
        }
    }

  //getUserRolesByID
  getUserRolesByID(id) {
    this.readonly = true;
    this.service.getUserRolesByID(id)
      .subscribe((o: UserRoles) => {
        this.officecode = o.office;
        this.service.getUsers(this.officecode)
          .subscribe(response => {
              this.emps = (response.json());
              this.ShowEmp1 = 'none';
              this.ShowEmp2 = 'none';
              this.checkValue(this.active);
            this.isLoading = false;
          });
        this.roleid = o.rolE_ID;
        this.userofficecode = o.officE_CODE;
        this.suboffice = o.incL_SUBOFFICE;
        this.active = o.active;
        this.empid = o.useR_ID; 
        this.rid = o.id;
       // console.log(this.empid, this.roleid, this.officecode, this.userofficecode, this.suboffice, this.active);
      });
    this.updatemode = 1;
  }
    Add() {
        //alert(1);
    this.mode = false;
    this.permissionUtility.PermissionAdd='';
    this.suboffice = true;
    this.active = true;
    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    this.ShowEmp1 = '';
    this.ShowEmp2 = 'none';
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
    if(this.permissionUtility.PermissionView=='')
    this.permissionUtility.PermissionEdit='none';
    this.permissionUtility.PermissionEdit='';
    this.getOffices();
    this.getRole();
    this.getUserOffice();
    this.active = 0;
    this.suboffice = 0;
    this.readonly = false;
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

}










