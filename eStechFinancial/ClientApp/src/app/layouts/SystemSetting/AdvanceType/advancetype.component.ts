import { Component, OnInit } from '@angular/core';
import { AdvanceTypeService, AdvanceType, PermissionUtility } from '../../../shared';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';

@Component({
    selector: 'advancetype',
    templateUrl: './advancetype.component.html',
    styleUrls: ['./advancetype.component.scss']
    ,
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class AdvanceTypeComponent implements OnInit {
    public permissionUtility:PermissionUtility=new PermissionUtility();
    public valid:Validation=new Validation();
    cell: any = '';
    p: number = 1;
    ID: any = '';
    category: any[] = [];
    categorycode: any = 0;
    categoryname: any = '';

    grid: any[] = [];
    advancetypecode: any = 0;
    advancetypename: any = '';
    salary: any = '';
    maxinstallment: any = '';
    status: any = false;
    mode: any = false;
    card1display: any = '';
    card2display: any = 'none';
    addbutton: any = '';
    card1style: any = 'card col-sm-12'
    card2style: any = 'card col-sm-5'
    ShowEmp1: any = 'none'
    ShowEmp2: any = 'none'
    isLoading: any = false;
    logedInUserID: any = 1; 

    //End Member Variables
    constructor(private service: AdvanceTypeService) { }

    ngOnInit() {
        this.getGrid();
        this.logedInUserID = this.service.getSession('user_ID');
        this.permissionUtility.setPagePermissions(110006);
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
        //console.log();
        this.service.getGrid()
            .subscribe(response => {
                this.grid = (response.json());
                this.isLoading = false;
                console.log(this.grid);
            });
    }

    //getCategory
    getCategory() {
        this.isLoading = true;
        //console.log();
        this.service.getCategory()
            .subscribe(response => {
                this.category = (response.json());
                this.categorycode = this.category[0].categorycode;
                this.categoryname = this.category[0].categoryname;
                this.isLoading = false;
                //console.log(response.json());
            });
    }

    //saveData
    saveData() {
        var Data = new AdvanceType(0, this.advancetypename, this.salary, this.maxinstallment, this.categorycode, this.status);
        console.log(Data);
        var advancetypename=this.advancetypename.trim(); 
        if (advancetypename != "") {
            if(this.maxinstallment!=""){
                if(this.salary!=""){
                this.service.saveData(Data).then(
                (response) => {
                    this.advancetypecode = 0;
                    this.advancetypename = '';
                    this.salary = '';
                    this.maxinstallment = '';
                    this.categorycode = 0;
                    this.status=true;

                    this.card1style = 'card col-sm-12'
                    this.addbutton='';
                    this.permissionUtility.PermissionAdd = '';
                    this.card2display = 'none'; 1
                    this.ShowEmp1 = 'none'
                    this.ShowEmp2 = 'none'
                    this.getGrid();
                },
                (error) => console.log(error));
            }else{ 
                swal("Advance Salary Is Required");
              } 
             }else{ 
                swal("Max. installment Is Required");
              } 
        }
        else{
            if(advancetypename.replace(/\s/g,"").length<=0)
            this.advancetypename='';
            swal("Advance Type Name Must Be Defined.");
          } 
    }
    //updateData
    updateData() {
        var Data = new AdvanceType(this.advancetypecode, this.advancetypename, this.salary, this.maxinstallment, this.categorycode, this.status);
        console.log(Data);
        var advancetypename=this.advancetypename.trim(); 
          
        if (advancetypename != "") {
            if(this.maxinstallment!=""){
                if(this.salary!=""){
            this.service.updateData(Data).then(
                (response) => {
                    this.advancetypecode = 0;
                    this.advancetypename = '';
                    this.salary = '';
                    this.maxinstallment = '';
                    this.categorycode = 0;
                    this.status=true;
                    this.card1style = 'card col-sm-12'
                    this.addbutton='';
                    this.permissionUtility.PermissionAdd = '';
                    this.card2display = 'none'; 1
                    this.ShowEmp1 = 'none'
                    this.ShowEmp2 = 'none'
                    this.getGrid();
                },
                (error) => console.log(error));
            }else{ 
                swal("Advance Salary Is Required");
              } 
             }else{ 
                swal("Max. installment Is Required");
              } 
        }
        else{
            if(advancetypename.replace(/\s/g,"").length<=0)
            this.advancetypename='';
            swal("Advance Type Name Must Be Defined.");
          } 
    }

    //getDetailsByID
    getDetailsByID(ID) {
        console.log(ID, 'id');
        this.isLoading = true;
        this.service.getDetailsByID(ID)
            .subscribe(response => {
                var list = (response.json());
                console.log(list);
                this.advancetypecode = ID;
                this.advancetypename = list[0].advancetypename;
                this.salary = list[0].salary;
                this.maxinstallment = list[0].maxinstallment;
                this.status = list[0].status; 
                this.ShowEmp1 = 'none';
                this.ShowEmp2 = 'none';
                this.checkValue(this.status);
                this.service.getCategory()
                    .subscribe(response => {
                        this.category = (response.json());
                        this.categorycode = list[0].categorycode;
                      
                        this.isLoading = false;
                    });
                    
                

            //    var timer = setTimeout(() => { this.mandatoryFields() }, 1);
                console.log(response.json());
            });
    }

    Add() {
        this.mode=false;
        this.permissionUtility.PermissionAdd = 'none';
        this.card1style = 'card col-sm-7'
        this.card2display = '';
        this.addbutton = 'none';
        this.ShowEmp2 = 'none';
        if (this.permissionUtility.PermissionAdd)
        this.ShowEmp1 = '';

        this.advancetypecode = 0;
        this.advancetypename = '';
        this.salary = '';
        this.status=true;
        this.maxinstallment = '';
        this.categorycode = 0; 
        this.getCategory();
        this.HandleGrid();
        this.checkValue(this.status);
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
        this.checkValue(this.status);
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
        this.HandleGrid();
    }
    Cancel() {
        this.permissionUtility.PermissionAdd = '';
        if(this.permissionUtility.PermissionView=='')
        this.permissionUtility.PermissionEdit='none';
        this.card1style = 'card col-sm-12'
        this.addbutton = '';
        this.advancetypename = '';
        this.salary = '';
        this.maxinstallment = '';
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










