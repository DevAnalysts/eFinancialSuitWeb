import { Component, OnInit } from '@angular/core';
import { RoleService, Roles, RolesPermissions, PermissionUtility } from '../../../../shared';
import swal from 'sweetalert';
 
@Component({
  selector: 'roles',
  templateUrl: './roles.component.html',
    styleUrls: ['./roles.component.scss']
    ,
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class RolesComponent implements OnInit {
  ////Member Variables
    p: number = 1;
    id: any;
    id2: any;
 isLoading: any = false;

  roles: any[] = [];
  designations: any[] = [];
  modules: any[] = [];
  rolespermission: any[] = [];

  modulerolespermission: any[] = [];
  cacherolespermission: any[] = [];

  RolesPermissions: any[];
  rpbyid: any[] = []

  rolesid: any = -1;
  rolesname: any = ''
  designationid: any = 1;
  designation: any = '';
  moduleid: any = 1;
  module: any = '';
  active: any = false;
  mode: any = false;
  pageid: any = 1;
  pagetype: any = 1;
  cb1: any = false;
  cb2: any = false;
  cb3: any = false;
  cb4: any = false;
  savecounter: any = 0;
  updatecounter: any = 0;
  readonly: any = false;

  card1display: any = '';
  card2display: any = 'none';
  addbutton: any = '';
  card1style: any = 'card col-sm-12'
  ShowEmp1: any = 'none'
  ShowEmp2: any = 'none'

  public checked: boolean = true;
  public unchecked: boolean = false;

  view: any = false;
  add: any = false;
  edit: any = false;
  delete: any = false;

  listcount: any = 0
  viewcount: any = 0;
  addcount: any = 0;
  editcount: any = 0;
  deletecount: any = 0;

  logedInUserID: any = 1;
  btnmode: any = 0;
  
  public permissionUtility:PermissionUtility=new PermissionUtility();
  constructor(private service: RoleService) {
    this.RolesPermissions = new Array<RolesPermissions>();
  }

  ngOnInit() {
   
    this.getRoles();
    this.getDesignation();
  
    this.getModule();

    this.logedInUserID = this.service.getSession('user_ID');
    this.permissionUtility.setPagePermissions(10002);
    }
 ////////////////////////
 
    checkValue(event: any) {
        if (this.mode == false) {
            if (event == true && this.permissionUtility.PermissionEdit!='none')
                this.ShowEmp1 = '';
        } else {
            if (event == true && this.permissionUtility.PermissionEdit!='none')
                this.ShowEmp1 = '';
        }
    }

  //getRoles
  getRoles() {
    this.isLoading =true;
    this.service.getRoles()
      .subscribe(response => {
        this.roles = (response.json());
        this.isLoading = false;
        
      });
  }
  //getDesignation
  getDesignation() {
    this.isLoading =true;
    this.service.getDesignation()
      .subscribe(response => {
        this.designations = (response.json());
        this.designationid = this.designations[0].designationid;
        this.designation = this.designations[0].designation;
        this.isLoading = false;
      
      });
  }
  //getModule
  getModule() {
    // console.log('getmodule');
    this.isLoading =true;

    this.service.getModule()
      .subscribe(response => {
       
        this.modules = (response.json());
        this.moduleid = this.modules[0].moduleid;
        this.module = this.modules[0].module;
        this.getRolePermissionByID(this.rolesid);
       
        this.isLoading = false;
        
      });

  }

  getRolePermissionByID(roleid:any){

    this.service.getRolePermissionByID(roleid)
    .subscribe(response => {
      this.rolespermission = [];
      this.modulerolespermission=[];
      this.rolespermission = (response.json());
      this.modulerolespermission=this.rolespermission.filter(s=>s.moduleId==this.moduleid);
    
      this.isLoading = false; 

    });

  }

  filterPermissions(moduleid:any){
    this.modulerolespermission=[];
    this.modulerolespermission=this.rolespermission.filter(s=>s.moduleId==moduleid);
  }
  //saveRole
  saveRole(rolesname: any, designationid: any, active: any, pageid:any) {
      
   
      if (rolesname != "") {
          this.isLoading = true;
          this.active = true; 
           
         
        if (this.modulerolespermission.length > 0) {
          var roles = new Roles(this.rolesid,  rolesname,  designationid,  active,this.modulerolespermission);
         
          console.log(roles);
          this.service.saveRole(roles).then(
            (response) => {
            
              
              this.isLoading = false;
              this.getRoles();
              swal("Role Saved.");
          

              },
              
            (error) => console.log(error))
          this.readonly = true;

           
            
        }
        else {
          swal("RolePermissions must be defined.");
        }

      }
      else {

        swal("Roles must be defined.");

      } 

  }
  //getRoleByID
  getRoleByID(roleid) {
   
    this.service.getRoleByID(roleid)
      .subscribe((o: Roles) => {
        this.rolesid = o.rolE_ID;
        this.rolesname = o.rolE_NAME;
        this.designationid = o.designatioN_CODE;
          this.active = o.active;
       
        this.getRolePermissionByID(this.rolesid);
          this.ShowEmp1 = 'none';
          
          this.checkValue(this.active);
          this.isLoading = false;

      });
  }
   


  onChange(page: any) {
    // console.log(page);
    for (let i = 0; i < this.rolespermission.length; i++) {
      if (page == this.rolespermission[i].pageid) {
        this.rolespermission[i].cb1 = true;
      }
    }



  }
    Add() {       
    this.mode = false;
    this.permissionUtility.PermissionAdd='none';
    //Show Role Details + Empty RoleName And CheckBoxes
    this.savecounter = 0;
    this.rolesname = '';
    this.active = true;
    this.cb1 = false;
    this.cb2 = false;
    this.cb3 = false;
    this.cb4 = false;
    this.view = false;
    this.add = false;
    this.edit = false;
    this.delete = false;

    this.card1style = 'card col-sm-6'
    this.card2display = '';
    this.addbutton = 'none';
    this.ShowEmp2='none';
    this.ShowEmp1 = '';
 
    this.checkValue(this.active);
    
  

    this.HandleGrid();
  }
  Edit() {
    this.mode = true;
    this.permissionUtility.PermissionAdd='none'; 
    this.card1style = 'card col-sm-6'
    this.card2display = '';
    this.addbutton = 'none';
    this.ShowEmp1 = 'none';
    if(this.permissionUtility.PermissionEdit)
    this.ShowEmp2='';
    this.checkValue(this.active);
    
    this.HandleGrid();
  }
  View() {
    this.mode = false;
    this.permissionUtility.PermissionAdd='none';
    this.permissionUtility.PermissionEdit='none';
    this.card1style = 'card col-sm-6'
    this.card2display = '';
    this.addbutton = 'none';
    this.ShowEmp1 = 'none';
    this.ShowEmp2='none';
    
    this.HandleGrid();
  }
  Cancel() {
    //Hide Role Details + Empty RoleName And CheckBoxes
    this.permissionUtility.PermissionAdd='';        
    if(this.permissionUtility.PermissionView)
    this.permissionUtility.PermissionEdit='none';
    this.permissionUtility.PermissionEdit=''; 
    this.savecounter = 0;
    this.updatecounter = 0;
    this.readonly = false;
    this.rolesname = '';
    this.getDesignation();
    this.getModule();
    this.active = '';
    this.cb1 = false;
    this.cb2 = false;
    this.cb3 = false;
    this.cb4 = false;
    this.view = false;
    this.add = false;
    this.edit = false;
    this.delete = false;

    this.card1style = 'card col-sm-12';
    this.addbutton = '';
    this.card2display = 'none';
    this.ShowEmp1 = 'none';
    this.ShowEmp2='none'; 

      //handles default visibility 
      $('#PageGrid').show();
  }

 
  selectAllView(view:any) {
  this.modulerolespermission.map(function(a) {
    a.cb1 =view;//  (view==true?1:0);
   }) 
  }
  selectAllAdd(add:any) {
    this.modulerolespermission.map(function(a) {
      a.cb2 =add;
     })
   
  }
  selectAllEdit(edit:any) {
    this.modulerolespermission.map(function(a) {
      a.cb3 =edit;
     })
  }

  selectAllDelete(del:any) {
    this.modulerolespermission.map(function(a) {
      a.cb4 =del;
     })
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











