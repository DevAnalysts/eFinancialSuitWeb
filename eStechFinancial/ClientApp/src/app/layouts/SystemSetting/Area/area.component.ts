import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { AreaService, Area, ReportService, LoginService, PermissionUtility } from '../../../shared';
import swal from 'sweetalert';

import { log } from 'util';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { Response } from '@angular/http/src/static_response';

@Component({
  selector: 'area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {
  ////Member Variables
  p: number = 1;
  Itemsname: any = "";
  active: any = 0;
  edit: any[] = [];
  ID: any = '';

  city: Array<Select2OptionData>;
  citymodel: any;
  citycode = 0;
  cityname = '';



  office: Array<Select2OptionData>;
  officemodel: any; 
  officeId: any = 0;
  officename = '';

  subject: any[] = [];
  areA_CODE: any = 0;
  name: any = '';
  details: any = '';
  citY_CODE: any = 0;
  statuS: any = 0;

  card1display: any = '';
  card2display: any = 'none';
 
  card1style: any = 'card col-sm-12'
  card2style: any = 'card col-sm-5'
  ShowEmp1: any = 'none'
  ShowEmp2: any = 'none'
   isLoading: any = false;
  public checked: boolean = true;
  public unchecked: boolean = false;
  logedInUserID: any = 1;
  userOffice: any;
  userCurrentOffice: any;
  userPrivilegedOffice: any;
  userCurrentWarehouse: any;
  public PermissionUtility: PermissionUtility;

  //End Member Variables
  constructor(private service: AreaService, private rservice: ReportService, private LoginService: LoginService, ) {
    this.userOffice = this.LoginService.getSession('userOffice');
    this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
    this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
    this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
    this.PermissionUtility = new PermissionUtility();
  }

  ngOnInit() {

    //if (localStorage && !localStorage.getItem('size')) {
    //  var i = 0;
    //  try {
    //    // Test up to 10 MB
    //    for (i = 250; i <= 100000; i += 250) {
    //      localStorage.setItem('test', new Array((i * 1024) + 1).join('abcdefghijklmnopqrstuvwxyz'));
    //    }

    //  } catch (e) {
    //   // localStorage.removeItem('test');
    //    alert(e);
    //    console.log(localStorage.getItem('test'));
    //    localStorage.setItem('size', (i - 250).toString());
    //  }
    //}
    
   
    this.PermissionUtility.setPagePermissions(110625);
    console.log(this.PermissionUtility.PermissionEdit);
    this.getArea();
    this.getCity();
    this.getOffcie();
    this.logedInUserID = this.service.getSession('user_ID');
  }
  getOffcie() {
    this.isLoading = true;
    this.rservice.getOffice(this.userPrivilegedOffice)
      .subscribe(response => {
        this.office = this.getDropdownList(response.json(), 'officE_CODE', 'officE_NAME');
        this.isLoading = false;
        this.officemodel = this.office[0].id;
        this.officename = this.office[0].text;
      });
  }
  //getArea
  getArea() {
    this.isLoading =true;
    console.log();
    this.service.getArea()
      .subscribe(response => {
        this.subject = (response.json());
        this.isLoading = false;
        console.log(response.json());
      });
  }

  //getCity
  getCity() {
    this.service.getCity()
      .subscribe(response => {
        this.city = this.getDropdownList(response.json(), "citycode", "cityname");
        this.citymodel = this.city[0].id;
        this.cityname = this.city[0].text;
      });
  }
  //getPresentCityChange
  getCityChange(e: any) {
    this.citycode = e;
  }

  // convert dropdown lables
  getDropdownList(arr: any[], valuetxt: any, displaytxt: any): any {
    let ar: Array<any> = [];
    if (arr != null) {
      arr.forEach(
        function (obj) {

          ar.push({
            id: obj[valuetxt],
            text: obj[displaytxt]
          });

        });
    }
    return ar;
  }

  //// save the data on db
  saveArea(name, details, statuS, officeId) {
    console.log(0, name, this.citycode, details, statuS, officeId);
    var asset = new Area(0, name, this.citycode, details, statuS, officeId, this.logedInUserID ,0);
    console.log(asset);
    if (name!= "") {
      this.service.saveArea(asset).then(
        (response) => {
          this.name = '';
          this.citY_CODE = '';
          this.details = '';
          this.statuS = 0;
          this.card1style = 'card col-sm-12' 
          this.card2display = 'none'; 1
          this.ShowEmp1 = 'none'
          this.ShowEmp2 = 'none'
          this.ngOnInit();
        },
        (error) => console.log(error));
      
    }
    else
      swal("Subject name must be define.");
  }


  //////  ////getDetailByID
  getDetailsByID(areA_CODE) {
    console.log(areA_CODE, 'id');
    this.isLoading =true;
    this.service.getDetailsByID(areA_CODE)
      .subscribe(response => {
        this.edit = (response.json());
        this.areA_CODE = areA_CODE;
        this.name = this.edit[0].name;
        this.citY_CODE = this.edit[0].citY_CODE;
        this.details = this.edit[0].details;
        this.statuS = this.edit[0].status;
        this.isLoading = false;
        console.log(response.json());
      });
  }
  ////////Update the row
  UpdateArea(name, citymodel, details, statuS, officeId) {
    console.log(name, citymodel, details, statuS, officeId);
    var asset = new Area(this.areA_CODE, name, citymodel, details, statuS, officeId,0,this.logedInUserID);
    console.log(asset);
    if (name != "") {
      this.service.UpdateArea(asset).then(
        (response) => {
          this.name = this.edit[0].name;
          this.citY_CODE = this.edit[0].citY_CODE;
          this.details = this.edit[0].details;
          this.statuS = this.edit[0].statuS;
          this.officeId = this.edit[0].officeID;
          this.card1style = 'card col-sm-12'
        
          this.card2display = 'none'; 1
     
          this.ngOnInit();
        },
        (error) => console.log(error));
      
    }
    else
      swal("Subject must be define.");

  }
   
  Add() {

    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.ShowEmp2 = 'none';
    this.ShowEmp1 = '';
    this.name = '';
  }
  Edit() {
    this.card1style = 'card col-sm-7'
    this.card2display = ''; 
    this.ShowEmp1 = 'none';
    this.ShowEmp2 = ''
  }
  Cancel() {

    this.card1style = 'card col-sm-12'
    this.ShowEmp1 = '';
    this.card2display = 'none'; 1
    this.ShowEmp1 = 'none'
    this.ShowEmp2 = 'none'
  }

}










