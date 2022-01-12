import { Component, OnInit } from '@angular/core';
import { PermissionUtility } from '@shared/common/PermissionUtility';
import { Roles } from '@shared/models/SecurityLicensing/Security/roles';
import { RolesPermissions } from '@shared/models/SecurityLicensing/Security/rolespermissions';
import { RoleService } from '@shared/services/SecurityLicensing/Security/role.service';
import swal from 'sweetalert';

@Component({
  selector: 'pageregistration',
  templateUrl: './pageregistration.component.html',
  styleUrls: ['./pageregistration.component.scss']

})
export class PageRegistrationComponent implements OnInit {
  ////Member Variables
  p: number = 1;
  id: any;
  id2: any;
  isLoading: any = false;

  modules: any[] = [];
  modulePages: any[] = [];
  moduleid: any = 1;
  module: any = '';
  submodules: any[] = [];
  submodulePages: any [] = [];
  submoduleid : any = 1;
  submodule: any = '';
  
  card1display: any = '';

  card1style: any = 'card col-sm-12'
  ShowEmp1: any = ''

  selectallSt: boolean = false; 
  selectallSM: boolean = false; 
  logedInUserID: any = 1;
  btnmode: any = 0;

  public permissionUtility: PermissionUtility = new PermissionUtility();
  constructor(private service: RoleService) {
     
  }

  ngOnInit() {   
    
    this.getModule();

    this.logedInUserID = this.service.getSession('user_ID');
    this.permissionUtility.setPagePermissions(10002);
  }
  ////////////////////////
  //getModule
  getModule() {
     
    this.isLoading = true;

    this.service.getModule()
      .subscribe(response => {

        this.modules = (response.json());
        this.moduleid = this.modules[0].moduleid;
        this.module = this.modules[0].module;
        this.getSubModule(this.moduleid);         
      });

  }
  getSubModule(moduleid: any){
    this.service.getSubModule(moduleid)
    .subscribe(response => {
      this.submodules = (response.json());
     console.log(this.submodules);
      this.submoduleid = this.submodules[0].submoduleid;
      this.submodule = this.submodules[0].submodule;
      this.getSubModulePages(this.submoduleid);
    })
  }

  getModulePages(moduleid: any) {
    this.isLoading = true;
    this.selectallSt=false;
    this.selectallSM=false;
    this.modulePages = []; 
    this.submodulePages = [];
    this.service.getModulePages(moduleid)
      .subscribe(response => {
        this.modulePages = (response.json());
        // console.log(this.modulePages);
        
        this.isLoading = false;

      });

  }

  getSubModulePages(submoduleid: any){
    this.isLoading =true;
    this.selectallSt=false;
    this.selectallSM=false;
    this.modulePages = []; 
    this.submodulePages = [];
    this.service.getSubModulePages(submoduleid)
      .subscribe(response => {
        this.submodulePages = (response.json());
        console.log(this.submodulePages);
        
        this.isLoading = false;

      });
  }
 
  //saveModulePages
  saveSubModulePages(submodulePages) {
    this.isLoading = true;
     
    if (submodulePages.length > 0) {
       console.clear();
      console.log(submodulePages);
      this.service.saveSubModulePages(submodulePages).then(
        (response) => { 
          swal("Module page status changed");
           this. getSubModulePages(this.submoduleid);
          
        },
        (error) => console.log(error))
       
    }
    else {
      swal("No data to save.");
    }

  } 



  selectAllActiveSt(selectallSt: any) {
    this.submodulePages.map(function (a) {
      a.status = selectallSt;
    })
  }
  selectAllActiveSM(selectallSM: any){
    
    this.submodulePages.map(function (p) {
      p.showinMenue = selectallSM;
    })
  }

}











