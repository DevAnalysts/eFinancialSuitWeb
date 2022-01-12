import { Component, OnInit } from '@angular/core';
import { OfficeService, Office, PermissionUtility } from '../../../shared';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';

@Component({
    selector: 'office',
    templateUrl: './office.component.html',
    styleUrls: ['./office.component.scss']
    ,
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class OfficeComponent implements OnInit {
    public permissionUtility:PermissionUtility=new PermissionUtility();
    public valid:Validation=new Validation();

    p: number = 1;

    ID: any = '';
    grid: any[] = [];
    officelevel: any[] = [];
    officelevelcode: any = 0;
    officelevelname: any = '';
    disabledOfficeLevel:any=false;
    officecode: any = 0;
    officename: any = '';
    email: any = '';
    phone: any = '';
    fax: any = '';
    active: any = false;


    card1display: any = '';
    card2display: any = 'none';
    addbutton: any = '';
    card1style: any = 'card col-sm-12'
    card2style: any = 'card col-sm-5'
    ShowEmp1: any = 'none'
    ShowEmp2: any = 'none'
    isLoading: any = false;

    logedInUserID: any = 1;
    cell: any='';
    mode: any=false;


    //End Member Variables
    constructor(private service: OfficeService) { }

    ngOnInit() {
        this.getGrid();
        this.logedInUserID = this.service.getSession('user_ID');
        this.permissionUtility.setPagePermissions(110057);
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
     

    //getGrid
    getGrid() {
        this.isLoading = true;
        this.service.getGrid()
            .subscribe(response => {
                // alert();
                this.grid = (response.json());
                this.isLoading = false;
                console.log(response.json());
            });
    }

    //getofficelevel
    getofficelevel() {
        this.service.getofficelevel()
            .subscribe(response => {
                this.officelevel = response.json();
                this.officelevelcode = this.officelevel[0].officelevelcode;
                this.officelevelname = this.officelevel[0].officelevelname;
            });
    }

    //saveData
    saveData() {
        var Data = new Office(0, this.officename, this.email, this.phone, this.fax, this.officelevelcode, this.active);
        console.log(Data);
        var officename = this.officename.trim();  
        if (officename != "") {
            this.service.saveData(Data).then(
                (response) => {

                    this.officecode = 0;
                    this.officename = '';
                    this.email = '';
                    this.phone = '';
                    this.fax = '';
                    this.officelevelcode = 0;
                    this.active = true;

                    this.card1style = 'card col-sm-12'
                    this.addbutton='';
                    this.permissionUtility.PermissionAdd = '';
                    this.card2display = 'none'; 
                    this.ShowEmp1 = 'none'
                    this.ShowEmp2 = 'none'
                    this.getGrid();
                },
                (error) => console.log(error));

        }
        else{
            if(officename.replace(/\s/g,"").length<=0)
            this.officename='';
            swal("Office name must be defined.");
          }
           
    }
    //updateData
    updateData() {
        var Data = new Office(this.officecode, this.officename, this.email, this.phone, this.fax, this.officelevelcode, this.active);
        console.log(Data);
        var officename = this.officename.trim();  
        if (officename != "") {
            this.service.updateData(Data).then(
                (response) => {

                    this.officecode = 0;
                    this.officename = '';
                    this.email = '';
                    this.phone = '';
                    this.fax = '';
                    this.officelevelcode = 0;
                    this.active = true;

                    this.card1style = 'card col-sm-12'
                    this.addbutton='';
                    this.permissionUtility.PermissionAdd = '';
                    this.card2display = 'none'; 
                    this.ShowEmp1 = 'none'
                    this.ShowEmp2 = 'none'
                    this.getGrid();
                },
                (error) => console.log(error));

        }
        else{
            if(officename.replace(/\s/g,"").length<=0)
            this.officename='';
            swal("Office name must be defined.");
          }
    }

    //getDetailsByID
    getDetailsByID(ID) {
        console.log(ID, 'id');
        this.isLoading = true;
        this.service.getDetailsByID(ID)
            .subscribe(response => {
                var list = (response.json()); 
                this.officecode = ID;
                this.officename = list[0].officename;
                this.email = list[0].email;
                this.phone = list[0].phone;
                this.fax = list[0].fax;
                
                this.service.getofficelevel()
                    .subscribe(response => {
                        this.officelevel = response.json(); 
                        this.officelevelcode = list[0].officelevelcode;
                        this.disabledOfficeLevel=false; 
                        if(this.officelevelcode<2){
                            this.disabledOfficeLevel=true;
                        }
                    });

                this.active = list[0].active; 
                
                this.ShowEmp1 = 'none';
                this.ShowEmp2='none';
                this.checkValue(this.active);
               
                this.isLoading = false;


            });
    }




    Add() {
        this.mode = false;
        this.permissionUtility.PermissionAdd = 'none';
        this.card1style = 'card col-sm-7'
        this.card2display = '';
        this.ShowEmp2 = 'none';
        this.addbutton = 'none';
        if (this.permissionUtility.PermissionAdd)
        this.ShowEmp1 = '';
        
        this.officecode = 0;
        this.officename = '';
        this.email = '';
        this.phone = '';
        this.fax = '';
        this.officelevelcode = 0;
        this.disabledOfficeLevel=false;
        this.active = true;
        this.checkValue(this.active);
        this.HandleGrid();
        this.getofficelevel();

    }
    Edit() {
        this.mode = true;
        this.permissionUtility.PermissionAdd = 'none';
        this.card1style = 'card col-sm-7'
        this.card2display = '';
        this.addbutton = 'none';
        this.ShowEmp1 = 'none';
        if (this.permissionUtility.PermissionEdit)
        this.ShowEmp2 = '';
        this.checkValue(this.active);
        this.HandleGrid();
    }
    View() {
        this.mode = false;
        this.permissionUtility.PermissionAdd = 'none';
        this.permissionUtility.PermissionEdit='none';
        this.card1style = 'card col-sm-7'
        this.card2display = '';
        this.addbutton = 'none';
        this.ShowEmp1 = 'none';        
        this.ShowEmp2 = 'none';
        //this.checkValue(this.active);
        this.HandleGrid();
    }
    Cancel() {
        this.permissionUtility.PermissionAdd = '';
        if(this.permissionUtility.PermissionView=='')
        this.permissionUtility.PermissionEdit='none';
        this.card1style = 'card col-sm-12'
        this.addbutton = '';
        this.officename = '';
        this.email = '';
        this.phone = '';
        this.fax = '';
        this.card2display = 'none'; 
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










