import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BankBranchService, bankBranch, LoginService, PermissionUtility } from '../../../../../shared';
import { Select2OptionData } from 'ng-select2';
import { Validation } from '@shared/common/validation';
import swal from 'sweetalert';

@Component({
    selector: 'bank-branch',
    templateUrl: './bank-branch.component.html',
    styleUrls: ['./bank-branch.component.scss']
})
export class BankBranchComponent implements OnInit {
   public permissionUtility:PermissionUtility=new PermissionUtility();
   public valid:Validation=new Validation();
    logedInUserID: any = 1;
    UserSessionID: any = 0;
     
    p: number = 1;
    modalReference: NgbModalRef;
    bankBranches: any[];
    banks: any[];
    closeResult: string;
    mode: any = 0;
    brancH_CODE: any;
    brancH_NAME: any;
    banK_CODE: any = 1;
    brancH_CODE_NAME: any;
    banK_NAME: any;
    phone: any;
    mobile: any;
    email: any;
    contactPerson: any;
    address: any;
    remarks: any;
    ID: any = "";
    isLoading: any = false;
    city: Array<Select2OptionData>;
    citymodel: any = 1;
    citycode: any = 0;
    cityname: any = '';
    region: any[] = []
    regioncode: any = 1;
    regionname: any = '';
    province: any[] = [];
    provincecode: any = 1;
    provincename: any = '';
    country: any[] = [];
    countrycode: any = 1;
    countryname: any = '';

    branchaddress: any[] = [];
    line1: any = '';
    line2: any = '';
    line3: any = '';
    userOffice: any;
    userPrivilegedOffice: any;
    userCurrentOffice: any;
    userCurrentWarehouse: any;

    constructor(private service: BankBranchService, private LoginService: LoginService, private ngbDateParserFormatter: NgbDateParserFormatter, private modalService: NgbModal) {
        this.logedInUserID = this.LoginService.getSession('user_ID');
        this.userOffice = this.LoginService.getSession('userOffice');
        this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
        this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
        this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
    }

    ngOnInit() {
        this.getBranches(this.ID);
        this.permissionUtility.setPagePermissions(30009);
        this.logedInUserID = this.LoginService.getSession('user_ID');
        
    }
    //getBranches
    getBranches(value: string) {
        this.service.getBranches(value)
            .subscribe(response => {
                this.bankBranches = (response.json());
                console.log(response.json());
            });
    }
    //getBanks
    getBanks() {
        this.service.getBanks()
            .subscribe(response => {
                this.banks = (response.json());
                console.log(response.json());
            });
    }

    getFills() {
        this.getCity();
    }
    //getCity
    getCity() {
        this.service.getCity()
            .subscribe(response => {
                this.city = this.getDropdownList(response.json(), "citycode", "cityname");
                this.citymodel = this.city[0].id;
                this.citycode = this.city[0].id;
                this.cityname = this.city[0].text;
                //this.getPresentRegion(this.pscitycode);
            });
    }
    //getCityChange
    getCityChange(e: any) {
        this.citycode = e;
        this.getRegion(this.citycode);
        //alert(this.pscitycode);
    }
    //getRegion
    getRegion(citycode) {
        this.service.getRegion(citycode)
            .subscribe(response => {
                this.region = (response.json());
                this.regioncode = this.region[0].regioncode;
                this.regionname = this.region[0].regionname;
                this.provincecode = this.region[0].provincecode;
                this.getProvince(this.provincecode);

            });
    }
    //getProvince
    getProvince(provincecode) {
        this.service.getProvince(provincecode)
            .subscribe(response => {
                this.province = (response.json());
                this.provincecode = this.province[0].provincecode;
                this.provincename = this.province[0].provincename;
                this.countrycode = this.province[0].countrycode;
                this.getCountry(this.countrycode);
            });
    }
    //getCountry
    getCountry(countrycode) {
        this.service.getCountry(countrycode)
            .subscribe(response => {
                this.country = (response.json());
                this.countrycode = this.country[0].countrycode;
                this.countryname = this.country[0].countryname;
            });
    }
    //getDetailsByID
    getDetailsByID(brancH_CODE, content) {
        this.open(content);
        this.mode = true;
        this.service.getDetailsByID(brancH_CODE)
            .subscribe((o: bankBranch) => {
                this.brancH_CODE = o.brancH_CODE;
                this.brancH_NAME = o.brancH_NAME;
                this.brancH_CODE_NAME = o.brancH_CODE_NAME;
                this.banK_CODE = o.banK_CODE;
                this.banK_NAME = o.banK_NAME;
                this.phone = o.phone;
                this.mobile = o.mobile;
                this.email = o.email;
                this.contactPerson = o.contactPerson;
                //this.address = o.address;
                this.remarks = o.remarks;
                this.getAddressDetails(this.brancH_CODE);
            });
    }
    //getAddressDetails
    getAddressDetails(brancH_CODE) {

        this.service.getAddressDetails(brancH_CODE)
            .subscribe(response => {
                var addr = (response.json());
                this.line1 = addr[0].line1;
                this.line2 = addr[0].line2;
                this.line3 = addr[0].line3;
                this.citymodel = addr[0].citycode;
            });
    }
    //clearFields
    clearFields() {
        this.mode = 0;
        this.brancH_CODE = 0;
        this.brancH_NAME = "";
        this.banK_CODE = 1;
        this.brancH_CODE_NAME = 0;
        this.banK_NAME = "";
        this.phone = "";
        this.mobile = "";
        this.email = "";
        this.contactPerson = "";
        this.address = "";
        this.remarks = "";

        this.line1 = "";
        this.line2 = "";
        this.line3 = "";
        this.citycode = 1;
        this.citymodel = 1;

        this.getBanks();
        this.getFills();
        $("#submitAdd").prop("disabled", false);
        //this.guid = UUID.UUID();
    }
    //saveBranches
    saveBranches() {
        var regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/; 
    if(!regex.test(this.email)){
      swal("Invalid Email Format");
      return;
    }
    if(this.phone.toString().length<11){
        swal("Invalid phone number");
        return;
    }
    if(this.mobile.toString().length<11){
        swal("Invalid mobile number");
        return;
    }
        var year = new bankBranch(this.brancH_CODE, this.brancH_NAME, this.brancH_CODE_NAME, this.banK_CODE, this.banK_NAME, this.phone, this.mobile, this.email, this.contactPerson, this.remarks, this.line1, this.line2, this.line3, this.citycode, this.logedInUserID, this.UserSessionID);
        var brancH_NAME=this.brancH_NAME.trim();
        var line1=this.line1.trim();
        if (brancH_NAME != "") {
            if(line1!=""){
            this.service.saveBranches(year).then(
                (response) => {
                    this.getBranches(this.ID);
                    this.modalReference.close();
                },
                (error) => console.log(error))
        }else{
            if(this.line1.replace(/\s/g,"").length<=0)
            this.line1='';
            swal("Address(Line 1) must be defined");
        }
    }
        else{
            if(brancH_NAME.replace(/\s/g,"").length<=0)
            this.brancH_NAME='';
            swal("The Bank Branch should be define.");
          }
            
        
    }
    //updateBranches
    updateBranches() {
        var regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/; 
        if(!regex.test(this.email)){
          swal("Invalid Email Format");
          return;
        }
        if(this.phone.toString().length<11){
            swal("Invalid phone number");
            return;
        }
        if(this.mobile.toString().length<11){
            swal("Invalid mobile number");
            return;
        } 
        var year = new bankBranch(this.brancH_CODE, this.brancH_NAME, this.brancH_CODE_NAME, this.banK_CODE, this.banK_NAME, this.phone, this.mobile, this.email, this.contactPerson, this.remarks, this.line1, this.line2, this.line3, this.citycode, this.logedInUserID, this.UserSessionID);
        var brancH_NAME=this.brancH_NAME.trim();
        var line1=this.line1.trim();
        if (brancH_NAME != "") {
            if(line1!="") {
            this.service.updateBranches(year).then(
                (response) => {
                    this.getBranches(this.ID);
                    this.modalReference.close();
                },
                (error) => console.log(error))
        }
        else{
            if(this.line1.replace(/\s/g,"").length<=0)
            this.line1='';
            swal("Address(Line 1) must be defined");
        }
    }
        else{
            if(brancH_NAME.replace(/\s/g,"").length<=0)
            this.brancH_NAME='';
            swal("The Bank Branch should be define.");
          }
    }
    // open Modal
    open(content) {
        this.modalReference = this.modalService.open(content, { size: 'xlg' });
        this.modalReference.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
        this.clearFields();

    }
    //getDismissReason
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
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
}
