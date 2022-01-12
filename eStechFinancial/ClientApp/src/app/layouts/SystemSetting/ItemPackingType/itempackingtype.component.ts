import { Component, OnInit} from '@angular/core';
import { ItemPackingTypeService } from '../../../shared';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
//import { Response } from '@angular/http/src/static_response';

@Component({
  selector: 'itempackingtype',
  templateUrl: './itempackingtype.component.html',
  styleUrls: ['./itempackingtype.component.scss']
})
export class ItemPackingTypeComponent implements OnInit {
  ////Member Variables
  p: number = 1;
  ProvinceId: any = 0;
  regionId: any = 0;
  cityname: any = "";
  active: any = 1;
  district: any[] = [];
  ID: any = '';
  districT_CODE: any = 0;

  region: any[] = [];
  province: any[] = [];
  packinG_typE_ID: any = 0;
  packinG_typE_NAME: any = "";
  provincE_NAME: any = "";

  card1display: any = '';
  card2display: any = 'none';
  addbutton: any = '';
  card1style: any = 'card col-sm-12'
  card2style: any = 'card col-sm-5'
  ShowEmp1: any = 'none'
  ShowEmp2: any = 'none'
   isLoading: any = false;
  public checked: boolean = true;
  public unchecked: boolean = false;
  logedInUserID: any = 1;


  public myDatePickerOptions: IAngularMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
  };
  public model: any = { date: { year: 2018, month: 10, day: 9 } };
  ////End Member Variables
  constructor(private service: ItemPackingTypeService) { }

  ngOnInit() {
    this.getItemPacking();
    //this.getdistrict();
    this.logedInUserID = this.service.getSession('user_ID');
    }

    checkValue(event: any) {
        console.log(event);

        if (event == true)
            this.ShowEmp1 = ''
        else
            this.ShowEmp1 = 'none';

    }


  //getUsers
  getItem_Packing() {
    this.isLoading =true;
    this.service.getItemPacking()
      .subscribe(response => {
        this.region = (response.json());
        this.isLoading = false;
        // console.log(response.json());
      });
  }

  ///////getdistrict
  getItemPacking() {
    this.isLoading =true;
    this.service.getItemPacking()
      .subscribe(response => {
        this.district = (response.json());
        this.packinG_typE_ID = this.getItemPacking[0].Packing_Type_ID;
        this.packinG_typE_NAME = this.getItemPacking[0].Packing_Type_Name;
        //this.provincE_CODE = this.district[0].provincE_CODE;
        //this.getprovince(this.districT_CODE);
        this.isLoading = false;
        console.log(response.json());
      })
  }

  ////getprovince
  //getprovince(districT_CODE) {
  //  this.isLoading =true;
  //  this.service.getprovince(districT_CODE)
  //    .subscribe(response => {
  //      this.province = (response.json());
  //      this.provincE_CODE = this.province[0].provincE_CODE;
  //      this.provincE_NAME = this.province[0].provincE_NAME;
  //      this.isLoading = false;
  //       console.log(response.json());
  //    });
  //}

  

  // save the data on db
  //saveCity(cityname, districT_CODE, active) {
  //  var city = new City(0,cityname, districT_CODE, active);
  //  console.log(city);
  //  if (cityname!= "") {
  //    this.service.saveCity(city).then(
    
  //      (error) => console.log(error));

  //    this.districT_CODE = 0;
  //    this.cityname = '';
  //    this.active = 0;


  //    this.card1style = 'card col-sm-12'
  //    this.addbutton = '';
  //    this.card2display = 'none'; 1
  //    this.ShowEmp1 = 'none'
  //    this.ShowEmp2 = 'none'
  //    this.ngOnInit();
  //  }
  //  else
  //    swal("City name must be define.");
  // }
  ////getEmployees
  //getEmps(OFFICE_CODE: any) {
  //  this.isLoading =true;
  //  this.service.getEmp(OFFICE_CODE)
  //    .subscribe(response => {
  //      this.emps = (response.json());
  //      this.empid = this.emps[0].empid;
  //      this.empname = this.emps[0].empname;
  //      this.isLoading = false;
  //      // console.log(response.json());
  //    });
  //}
  ////getOffices
  //getOffices() {
  //  this.isLoading =true;
  //  this.service.getOffice()
  //    .subscribe(response => {
  //      this.offices = (response.json());
  //      this.officE_CODE = this.offices[0].officE_CODE;
  //      this.office = this.offices[0].office;

  //      //getEmp
  //      this.service.getEmp(this.officE_CODE)
  //        .subscribe(response => {
  //          this.emps = (response.json());
  //          this.empid = this.emps[0].empid;
  //          this.empname = this.emps[0].empname;
  //        });
  //      this.isLoading = false;
  //      // console.log(response.json());
  //    });
  //}
  ////matchPassword
  //matchPassword(confirpassword) {
  //  if (this.password != confirpassword) {
  //    alert("! match...");
  //  }
  //  else { }
  //}
  ////getDetailByID
  //getDetailsByID(user_ID) {
  //  this.service.getDetailsByID(user_ID)
  //    .subscribe((o: Users) => {
  //      this.user_ID = o.user_ID;
  //      this.login = o.login;
  //      this.empname = o.empname;
  //      this.empid = o.emp_ID;
  //      this.office = o.office;
  //      this.active = o.active;
  //      //console.log(o.emp_ID);
  //    });
  //}
  //saveUser(login: any, password: any, active: any) {
  //  var user = new Users(this.logedInUserID, login, password, this.empid, "", 0, active);
  //  console.log(user);
  //  if (this.login != "") {
  //    this.service.saveUser(user).then(
  //      //(response) => { this.getUsers(this.supplier_Name); console.log(response); },
  //      (error) => console.log(error));
  //    this.user_ID = '';
  //    this.empname = '';
  //    this.login = '';
  //    this.office = '';
  //    this.active = 0;
  //    this.password = '';
  //    this.confirpassword = '';
  //    this.card1style = 'card col-sm-12'
  //    this.addbutton = '';
  //    this.card2display = 'none'; 1
  //    this.ShowEmp1 = 'none'
  //    this.ShowEmp2 = 'none'
  //    this.ngOnInit();
  //  }
  //  else
  //    swal("Login must be define.");


  //}
  //updateUser(login: any, password: any, active: any) {
  //  var user = new Users(this.logedInUserID, login, password, this.empid, "", 0, active);
  //  console.log(user);
  //  if (this.login != "") {
  //    this.service.updateUser(user).then(
  //      //(response) => { this.getUsers(this.supplier_Name); console.log(response); },
  //      (error) => console.log(error));
  //    this.user_ID = '';
  //    this.empname = '';
  //    this.empid = '';
  //    this.login = '';
  //    this.office = '';
  //    this.active = 0;

  //    this.password = '';
  //    this.confirpassword = '';
  //    this.card1style = 'card col-sm-12'
  //    this.addbutton = '';
  //    this.card2display = 'none'; 1
  //    this.ShowEmp1 = 'none'
  //    this.ShowEmp2 = 'none'
  //    this.getUsers();
  //  }
  //  else
  //    swal("Login must be define.");


  //}


  //setActive(uID) {
  //  this.service.setActive(uID).subscribe((data) => {
  //    this.getUsers();
  //  }, error => console.error(error))
  //}
  Add() {

    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
      this.ShowEmp1 = '';
      this.active = 1;
  }
  Edit() {
    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    this.ShowEmp2 = 'none'
  }
  Cancel() {

    this.card1style = 'card col-sm-12'
    this.addbutton = '';
    this.card2display = 'none'; 1
    this.ShowEmp1 = 'none'
    this.ShowEmp2 = 'none'
  }




}










