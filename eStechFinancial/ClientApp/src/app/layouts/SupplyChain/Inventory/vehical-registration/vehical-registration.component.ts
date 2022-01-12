import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ProductAssemblyService, ProductAssembly, ProductAssemblyDetails,VehicleRegistration, VehicleRegistrationService, cDate, NgbDateFRParserFormatter, PermissionUtility, LoginService } from '../../../../shared';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';

@Component({
  selector: 'app-vehical-registration',
  templateUrl: './vehical-registration.component.html',
  styleUrls: ['./vehical-registration.component.css'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class VehicalRegistrationComponent implements OnInit {
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissomUtility:PermissionUtility=new PermissionUtility();    
  public valid:Validation=new Validation();

  modalReference: NgbModalRef;
  closeResult: string;
  guid: any;
  ID: any;
  vehicleNo: any  = '';
  vehicleID: any = 0;
  driverid = '';
  drivername: any = '';
  helper: any = '';
  active: any = false;
  mode: any = false;
  isLoading: any = false;
  grid: any[] = [];
  ShowEmp1: any = 'none'
  ShowEmp2: any = 'none'
  addbutton: any = '';
  userOffice: any;
  userCurrentOffice: any;
  userPrivilegedOffice: any;
  userCurrentWarehouse: any;
  warehouse: any=0;
  Office: any=0;
  offices: any[];
  warehouses: any[];

  constructor(private modalService: NgbModal,private service: VehicleRegistrationService,private LoginService:LoginService ) {
    this.userOffice = this.LoginService.getSession('userOffice');
    this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
    this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
    this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
   }

  ngOnInit(): void {
    ////////////////////////Set Name From Session Storage///////////////////////////
    this.permissomUtility.setPagePermissions(140017);  
    this.getGrid();

//////////current office////////////////
this.LoginService.getCurrentOffices(this.userPrivilegedOffice)
      .subscribe(response => {
        this.offices = (response.json());
        console.log('offices',this.offices)
        if (this.offices != null) {  
          this.Office = this.userCurrentOffice; 
          for (let i = 0; i < this.offices.length; i++)
            if (this.offices[i].officE_CODE == this.userCurrentOffice) {
              var timer = setTimeout(() => this.Office = this.offices[i].officE_CODE, 500);
            }
            else { this.Office = this.offices[0].officE_CODE; }
        }
        else { this.Office = this.offices[0].officE_CODE; }
        //------------------------------------------------------------------------------------
        //-------------------Get Current Warehouses
        //------------------------------------------------------------------------------------
        //alert(this.userOffice);
        this.LoginService.getCurrentWareshouse(this.userOffice)
          .subscribe(response => {
            console.log(response.json());
            this.warehouses = (response.json());
            if (this.warehouses != null) {
              this.warehouse = this.warehouses[0].warehouseID;
            }
          });
          //alert(this.userCurrentOffice)
        this.LoginService.getCurrentWareshouse(this.userCurrentOffice)
          .subscribe(response => {
            this.warehouses = (response.json()); 
            this.warehouse = this.warehouses[0].warehouseID; 
            if (this.warehouses != null) { 
              for (let i = 0; i < this.warehouses.length; i++)
                if (this.warehouses[i].warehouseID == this.userCurrentWarehouse) {
                  console.log(this.warehouses[i].warehouseID);
                  this.warehouse = this.warehouses[i].warehouseID;
                  
                }
                else { this.warehouse = this.warehouses[0].warehouseID; }
            }
            else { this.warehouse = this.warehouses[0].warehouseID; }

          });
          

      });


  }

  checkValue(event: any) {
    if (this.mode == false) {
        if (event == true && this.permissomUtility.PermissionEdit!='none')
            this.ShowEmp1 = '';
    } else {
        if (event == true && this.permissomUtility.PermissionEdit!='none')
            this.ShowEmp2 = '';
    }
}
//getGrid
getGrid() {
  this.isLoading =true;
  console.log();
  this.service.getGrid()
      .subscribe(response => {
          this.grid = (response.json());
          this.isLoading = false;
          console.log(response.json());
      });
}
//////getDetailByID
getDetailsByID(vehicleid,content) {
  this.detailOpen(content);
  console.log(vehicleid, 'id');
  this.isLoading =true;
  this.service.getDetailsByID(vehicleid)
      .subscribe(response => {
          var list = (response.json());
          this.vehicleID = vehicleid;
          this.vehicleNo = list[0].vehicleno;
          this.drivername = list[0].driver;
          this.helper = list[0].helper;
          this.active = list[0].active;
          this.ShowEmp1 = 'none';
          this.ShowEmp2 = 'none';
          this.checkValue(this.active);
          this.isLoading = false;
          console.log(response.json());
      });
}

  //saveData
  saveData() {
    var Data = new VehicleRegistration(0,this.vehicleNo, this.drivername,this.helper, this.active, this.logedInUserID,this.Office,this.warehouse);
    //console.log(Data);
    var vehicleNo = this.vehicleNo.trim();  
    if (vehicleNo != "") {
      var drivername = this.drivername.trim(); 
      if (drivername!= ""){
        
      
        this.service.saveData(Data).then(
          (response) => {
            this.modalReference.close();
              this.getGrid();
          },
          (error) => console.log(error));
      }
      else{
        if(this.drivername.replace(/\s/g,"").length<=0)
        this.drivername='';
        swal('Select Driver Name!');
        return;
      }
          
        }
        else{
          if(vehicleNo.replace(/\s/g,"").length<=0)
      this.vehicleNo='';
      swal("Vehicle No Must Be Defined!");
        }
      }
     
         //saveData
  updateData() {
    var Data = new VehicleRegistration(this.vehicleID,this.vehicleNo, this.drivername,this.helper, this.active,this.logedInUserID,this.Office,this.warehouse);
    //console.log(Data);

            this.service.updateData(Data).then(
                (response) => {
                  this.modalReference.close();
                    this.getGrid();
                },
                (error) => console.log(error));
        }
         
     
    


  //clearFields
  clearFields() {
this.active = true;
this.addbutton = '';
    this.vehicleNo = '';
    this.drivername = '';
    this.helper = '';

    $("#AddNewItemRow").show();
    
    this.guid = UUID.UUID();
  
    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);
    
  }
  Edit() {
    this.permissomUtility.PermissionAdd = 'none';
    this.mode = true;

    this.addbutton = 'none';
    this.ShowEmp1 = 'none'
    if (this.permissomUtility.PermissionEdit)
    this.ShowEmp2 = '';
    this.checkValue(this.active);

}
View() {
    this.permissomUtility.PermissionAdd = 'none';
    this.permissomUtility.PermissionEdit='none';
    this.mode = false;
  
    this.addbutton = 'none';
    this.ShowEmp1 = 'none' 
    this.ShowEmp2 = 'none';
 
}
Cancel() {
    this.permissomUtility.PermissionAdd = '';
    if(this.permissomUtility.PermissionView=='')
    this.permissomUtility.PermissionEdit='none';
    this.addbutton = '';
    this.vehicleNo = 0;
    this.drivername = '';
    this.helper = '';
    this.ShowEmp1 = 'none';
    this.ShowEmp2 = 'none';

    //handles default visibility 
    $('#PageGrid').show();
}

  // open modal
  open(content) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    // console.log(ngbModalOptions);
    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    //    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    $("#submitAdd").show();
    $("#submitUpdate").hide();
    $("#cancelBtn").hide();
    $("#submitAdd").prop("disabled", true);
    this.clearFields();
  }
    // detailOpen modal
    detailOpen(content) {
      let ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false
      };
      // console.log(ngbModalOptions);
      this.modalReference = this.modalService.open(content, { size: 'xlg' });
      //    this.modalReference = this.modalService.open(content, { size: 'xlg' });
      this.modalReference.result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
      $("#submitAdd").hide();
      $("#submitUpdate").show();
      $("#cancelBtn").show();
      this.mode = true;
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
    // end of modal
}
