import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeRegistrationService,LoginService, Employee, cDate, NgbDateFRParserFormatter, EmployeeImageService, PermissionUtility } from '../../../../shared';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';
@Component({
  selector: 'employee-registration',
  templateUrl: './employee-registration.component.html',
  styleUrls: ['./employee-registration.component.scss'],

  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]

})
export class EmployeeRegistrationComponent implements OnInit {
   
  logedInUserID: any = 1;
  UserSessionID: any = 0;
   
  id: any;
  p: number = 1;
  modalReference: NgbModalRef;
  isLoading: any = false;
  closeResult: string;
  alerts: Array<any> = [];
  guid: any;
  mode: any = false;
  btnmode: any = false;
  status: any = false;

  public dob = new cDate();
  public joiningdate = new cDate();
  public conenddate = new cDate();
  public confirmdate = new cDate();

  ///Grid & Basic Information
  emplist: any[] = [];
  empcode: any;
  empname: any = '';
  firstname: any = '';
  middlename: any = '';
  lastname: any = '';
  fathername: any = '';

  cnic: any = '';
  gender: any = 1;
  maritalstatus: any = 1;
  eobi: any = '';
  gli: any = '';
  socialsecurity: any = '';
  birthplace: any = '';
  nationality: any[] = [];
  nationalcode: any = 1;
  nationalname: any = '';
  religion: any = '';
  remarks: any = '';
  correspond: any = 1;
  present: any = 1;
  permanent: any = 0;
  ////Address Present
  psline1: any = '';
  psline2: any = '';
  psline3: any = '';
  psaddress: any[] = [];
  pscity: Array<Select2OptionData>;
  pscitymodel: any = 1;
  pscitycode: any = 0;
  pscityname: any = '';
  psregion: any[] = []
  psregioncode: any = 1;
  psregionname: any = '';
  psprovince: any[] = [];
  psprovincecode: any = 1;
  psprovincename: any = '';
  pscountry: any[] = [];
  pscountrycode: any = 1;
  pscountryname: any = '';
  ////AddressPermanent
  pmaddress: any[] = [];
  pmline1: any = '';
  pmline2: any = '';
  pmline3: any = '';
  pmcity: Array<Select2OptionData>;
  pmcitymodel: any = 1;
  pmcitycode: any = 0;
  pmcityname: any = '';
  pmregion: any[] = []
  pmregioncode: any = 1;
  pmregionname: any = '';
  pmprovince: any[] = [];
  pmprovincecode: any = 1;
  pmprovincename: any = '';
  pmcountry: any[] = [];
  pmcountrycode: any = 1;
  pmcountryname: any = '';
  ////Contact Information
  phoneno: any = '';
  cellno: any = '';
  email: any = '';
  submitAdd:any;
  submitUpdate:any;
  ////Employement Information
  office: any[] = [];
  officecode: any = 1;
  officename: any = '';
  department: any[] = [];
  departmentcode: any = 1;
  departmentname: any = '';
  designation: any[] = [];
  designationcode: any = 1;
  designationname: any = '';
  emptype: any[] = [];
  emptypecode: any = 1;
  emptypename: any = '';
  category: any[] = [];
  categorycode: any = 1;
  categoryname: any = '';
  grade: any[] = [];
  gradecode: any = 1;
  gradename: any = '';
  empstatus: any[] = [];
  empstatuscode: any = 1;
  empstatusname: any = '';
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation()
  showcontractdate: any = 'none';
  showconfirmdate: any = '';
  /////////IMAGE///////////
  imageUrl: string = "../../../../assets/images/user-thumbnail.png";
  checkImage: string = "../../../../assets/images/user-thumbnail.png";
  fileToUpload: File = null;
 ////////////////////////
 public mask1 = [/[1-9]/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/,] //CNIC Nos
 
 

  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  priviledged_Offices: any;
  constructor( private LoginService: LoginService,private service: EmployeeRegistrationService, private modalService: NgbModal, private ngbDateParserFormatter: NgbDateParserFormatter, private ImageService: EmployeeImageService) {
  
    this.userOffice = this.LoginService.getSession('userOffice');
    this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
    this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
    this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
    this.priviledged_Offices = this.userPrivilegedOffice;
    this.alerts.push(
      {
        id: 4,
        type: 'danger',
        message: 'Record is not updatable since it is being used...',
      });
  }

  ngOnInit() {
    this.getEmployees("");
    //this.getTaxTypes();
    this.logedInUserID = this.service.getSession('user_ID');
    this.permissionUtility.setPagePermissions(20013);
  }
 
  //getFills
  getFills() {
    this.getNationality();
    this.getOffice();
    this.getDepartment();
    this.getGrade();
    this.getCategory();
    this.getEmploymentType();
    this.getPresentCity();
    this.getPermanentCity();
  }
  //getEmployees
  getEmployees(value:any) {
    this.isLoading = true; 
     
      this.service.getEmployees(value,this.priviledged_Offices)
      .subscribe(response => {
        if(response.json() !== null){
          this.isLoading = false;
          this.emplist = (response.json()); 
        }
        else{
          this.isLoading = false;
          this.emplist = []; 
        }
        
      });
     
  }
  
  //getNationality
  getNationality() {
    this.isLoading = true;
    this.service.getNationality()
      .subscribe(response => {
        this.isLoading = false;
        this.nationality = (response.json());

        //  console.log(response.json());
      });
  }
  //getOffice
  getOffice() {
    this.isLoading = true;
    this.service.getOffice()
      .subscribe(response => {
        this.isLoading = false;
        this.office = (response.json());

        //  console.log(response.json());
      });
  }
  //getDepartment
  getDepartment() {
    this.isLoading = true;
    this.service.getDepartment()
      .subscribe(response => {
        this.isLoading = false;
        this.department = (response.json());
        this.departmentcode = this.department[0].departmentcode;
        this.getDesignation(this.departmentcode);

        //  console.log(response.json());
      });
  }
  //getDesignation
  getDesignation(departmentcode) {
    this.isLoading = true;
    this.service.getDesignation(departmentcode)
      .subscribe(response => {
        this.isLoading = false;
        this.designation = (response.json());

        //  console.log(response.json());
      });
  }
  //getEmploymentType
  getEmploymentType() {
    this.isLoading = true;
    this.service.getEmploymentType()
      .subscribe(response => {
        this.isLoading = false;
        this.emptype = (response.json());

        //  console.log(response.json());
      });
  }
  //getCategory
  getCategory() {
    this.isLoading = true;
    this.service.getCategory()
      .subscribe(response => {
        this.isLoading = false;
        this.category = (response.json());

        //  console.log(response.json());
      });
  }
  //getGrade
  getGrade() {
    this.isLoading = true;
    this.service.getGrade()
      .subscribe(response => {
        this.isLoading = false;
        this.grade = (response.json());

        //  console.log(response.json());
      });
  }
  //getStatus
  getStatus() {
    this.isLoading = true;
    this.service.getStatus()
      .subscribe(response => {
        this.isLoading = false;
        //this.emplist = (response.json());

        //  console.log(response.json());
      });
  }
  //getPresentCity
  getPresentCity() {
    this.isLoading = true;
    this.service.getCity()
      .subscribe(response => {
        this.isLoading = false;
        this.pscity = this.getDropdownList(response.json(), "citycode", "cityname");
        this.pscitymodel = this.pscity[0].id;
        this.pscityname = this.pscity[0].text;

        //this.getPresentRegion(this.pscitycode);
      });
  }
  //getPresentCityChange
  getPresentCityChange(e: any) {
    this.pscitycode = e; 
    this.getPresentRegion(this.pscitycode);
    //alert(this.pscitycode);
  }
  //getPresentRegion
  getPresentRegion(citycode) {
    this.isLoading = true; 
    this.service.getRegion(citycode)
      .subscribe(response => {
        this.isLoading = false;
        console.clear();
        console.log(response);
        this.psregion = (response.json());
        this.psregioncode = this.psregion[0].regioncode;
        this.psregionname = this.psregion[0].regionname;
        this.psprovincecode = this.psregion[0].provincecode;

        this.getPresentProvince(this.psprovincecode);

      });
  }
  //getPresentProvince
  getPresentProvince(provincecode) {
    this.isLoading = true;
    this.service.getProvince(provincecode)
      .subscribe(response => {
        console.log(response.json());
        this.isLoading = false;
        this.psprovince = (response.json()); 
        this.psprovincecode = this.psprovince[0].provincecode;
        this.psprovincename = this.psprovince[0].provincename;
        this.pscountrycode = this.psprovince[0].countrycode;
        this.getPresentCountry(this.pscountrycode);

      });
  }
  //getPresentCountry
  getPresentCountry(countrycode) {
    this.isLoading = true;
    this.service.getCountry(countrycode)
      .subscribe(response => {
        this.isLoading = false;
        this.pscountry = (response.json());
        this.pscountrycode = this.pscountry[0].countrycode;
        this.pscountryname = this.pscountry[0].countryname;

        // console.log(response.json());
      });
  }
  //getPermanentCity
  getPermanentCity() {
    this.isLoading = true;
    this.service.getCity()
      .subscribe(response => {
        this.isLoading = false;
        this.pmcity = this.getDropdownList(response.json(), "citycode", "cityname");
        this.pmcitymodel = this.pmcity[0].id;
        this.pmcityname = this.pmcity[0].text;
        //this.getPermanentRegion(this.pmcitycode);

      });
  }
  //getPermanentCityChange
  getPermanentCityChange(e: any) {
    this.pmcitycode = e;
    this.getPermanentRegion(this.pmcitycode);
    //alert(this.pmcitycode);
  }
  //getPermanentRegion
  getPermanentRegion(citycode) {
    this.isLoading = true;
    this.service.getRegion(citycode)
      .subscribe(response => {
        this.isLoading = false;
        this.pmregion = (response.json());
        this.pmregioncode = this.pmregion[0].regioncode;
        this.pmregionname = this.pmregion[0].regionname;
        this.pmprovincecode = this.pmregion[0].provincecode;
        this.getPermanentProvince(this.pmprovincecode);

      });
  }
  //getPermanentProvince
  getPermanentProvince(provincecode) {
    this.isLoading = true;
    this.service.getProvince(this.pmprovincecode)
      .subscribe(response => {
        this.isLoading = false;
        this.pmprovince = (response.json());
        this.pmprovincecode = this.pmprovince[0].provincecode;
        this.pmprovincename = this.pmprovince[0].provincename;
        this.pmcountrycode = this.pmprovince[0].countrycode;
        this.getPermanentCountry(this.pmcountrycode);

      });
  }
  //getPermanentCountry
  getPermanentCountry(countrycode) {
    this.isLoading = true;
    this.service.getCountry(countrycode)
      .subscribe(response => {
        this.isLoading = false;
        this.pmcountry = (response.json());
        this.pmcountrycode = this.pmcountry[0].countrycode;
        this.pmcountryname = this.pmcountry[0].countryname;

        // console.log(response.json());
      });
  }
  //clearFields
  clearFields() {
    this.mode = false;
    this.btnmode = true;
    this.guid = UUID.UUID();
    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);
    this.empcode = '';
    this.firstname = '';
    this.middlename = '';
    this.lastname = '';
    this.fathername = '';
    this.cnic = '';
    this.gender = 1;
    this.maritalstatus = 1;
    this.eobi = '';
    this.gli = '';
    this.socialsecurity = '';
    this.birthplace = '';
    this.nationalcode = 1;
    this.religion = '';
    this.remarks = '';
    this.correspond = 1;
    this.psline1 = '';
    this.psline2 = '';
    this.psline3 = '';
    this.pscitycode = 1;
    this.pscitymodel = 1;
    this.psprovincecode = 1;
    this.pscountrycode = 1;
    this.pmline1 = '';
    this.pmline2 = '';
    this.pmline3 = '';
    this.pmcitymodel = 1;
    this.pmcitycode = 1;
    this.pmprovincecode = 1;
    this.pmcountrycode = 1;
    this.phoneno = '';
    this.cellno = '';
    this.email = '';
    this.officecode = 1;
    this.departmentcode = 1;
    this.designationcode = 1;
    this.emptypecode = 1;
    this.categorycode = 1;
    this.gradecode = 1;
    this.empstatuscode = 1;
    this.showcontractdate = 'none';
    this.showconfirmdate = '';
    this.imageUrl = "../../../../assets/images/user-thumbnail.png";
    this.dob = new cDate();
    this.joiningdate = new cDate();
    this.conenddate = new cDate();
    this.confirmdate = new cDate();
    this.getFills();
  }
  //IfExists
  IfExists(bookcode) {
    this.service.IfExists(bookcode)
      .subscribe(response => {
        this.status = (response.json());
        if (this.status == true) {
          $("#alertWarning").show();
          $("#submitUpdate").prop("disabled", true);
        }
        else {
          $("#alertWarning").hide();
          $("#submitUpdate").prop("disabled", false);
        }
      });
  }
  //saveEmployee
  saveEmployee(firstname, middlename, lastname, fathername, cnic, gender, maritalstatus, eobi, gli, socialsecurity, birthplace, nationalcode, religion, remarks, correspond,
    psline1, psline2, psline3, pscitycode, psprovincecode, pscountrycode, pmline1, pmline2, pmline3, pmcitycode, pmprovincecode, pmcountrycode,
    phoneno, cellno, email, officecode, departmentcode, designationcode, emptypecode, categorycode, gradecode, empstatuscode) {
       
    var existingCnic=this.emplist.filter(f=>f.cnic===cnic); 
        
    var firstname=this.firstname.trim(); 
    var fathername=this.fathername.trim(); 
    var dateofbirth=$("#dob").val();
    var joiningdate=$("#joindt").val();
    var confirmdate=$("#confdt").val();
    if(existingCnic.length>0){
      swal("CNIC already exist");
      return;
    }
    if(dateofbirth=='' || dateofbirth.toString().length<10){
      swal("Date Of Birth Is Empty Or Invalid");
      return;
    }
    if(joiningdate=='' || joiningdate.toString().length<10){
      swal("Joining Date Is Empty Or Invalid");
      return;
    }
    if(confirmdate=='' || confirmdate.toString().length<10){
      swal("Confirmation Date Is Empty Or Invalid");
      return;
    }
    if( this.cnic!='' && this.cnic.length!=13){
      swal("CNIC is invalid");
      return;
    }
    if(this.cellno!='' && this.cellno.length!=11){
      swal("Cell No. is invalid");
      return;
    }
    if(this.phoneno!='' && this.phoneno.length!=11){
      swal("Phone No. is invalid");
      return;
    }
    var regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/; 
    if(!regex.test(email)){
      swal("Invalid Email Format");
      return;
    }
    if (firstname != '') {
      this.isLoading = true;
      if(fathername!=''){
        if(this.cnic!=''){
          if(this.cellno!=''){
            if(this.psline1!='' && this.pmline1!=''){
                if (emptypecode != 1) { //Contract Employee
                  var emps = new Employee(0, firstname, middlename, lastname, fathername, cnic, gender, maritalstatus, eobi, gli, socialsecurity, birthplace, nationalcode, religion, remarks, correspond, psline1, psline2, psline3, pscitycode, pmline1, pmline2, pmline3, pmcitycode, phoneno, cellno, email, officecode, departmentcode, designationcode, emptypecode, categorycode, gradecode, empstatuscode, this.dob.getDateFinal(), this.joiningdate.getDateFinal(), this.conenddate.getDateFinal(), null, this.logedInUserID, '', this.UserSessionID);
                }
                else { //Regular Employee 
                  var emps = new Employee(0, firstname, middlename, lastname, fathername, cnic, gender, maritalstatus, eobi, gli, socialsecurity, birthplace, nationalcode, religion, remarks, correspond, psline1, psline2, psline3, pscitycode, pmline1, pmline2, pmline3, pmcitycode, phoneno, cellno, email, officecode, departmentcode, designationcode, emptypecode, categorycode, gradecode, empstatuscode, this.dob.getDateFinal(), this.joiningdate.getDateFinal(), null, this.confirmdate.getDateFinal(), this.logedInUserID, '', this.UserSessionID);
                } 
                if (this.fileToUpload != null) { 
                  this.ImageService.postFile('', this.fileToUpload).subscribe(
                    data => {
                      this.service.saveEmployee(emps).then(
                        (response) => {
                          this.getEmployees(''); this.modalReference.close(); this.clearFields(); this.isLoading = false;
                        },
                        (error) => console.log(error)) 
                    }
                  ); 
                }
                else { 
                  this.service.saveEmployee(emps).then(
                    (response) => {
                      this.getEmployees(''); this.modalReference.close(); this.clearFields(); this.isLoading = false;
                    },
                    (error) => console.log(error))
                }
            }else
            swal("At Least Line 1 Of Both Address Is Required");
            this.isLoading=false;
          }else
          swal("Enter Cell No.");
          this.isLoading=false;
        }else
        swal("CNIC iS Required");
        this.isLoading=false;
      }else{
        if(this.fathername.replace(/\s/g,"").length<=0)
          this.fathername='';
        swal("Enter Father Name!");
        this.isLoading=false;
      } 
    }
    else {
      if(this.firstname.replace(/\s/g,"").length<=0)
        this.firstname='';
      swal("Enter First Name!");
      this.isLoading=false;
    }
  }
  //updateEmployee
  updateEmployee(firstname, middlename, lastname, fathername, cnic, gender, maritalstatus, eobi, gli, socialsecurity, birthplace, nationalcode, religion, remarks, correspond,
    psline1, psline2, psline3, pscitycode, psprovincecode, pscountrycode, pmline1, pmline2, pmline3, pmcitycode, pmprovincecode, pmcountrycode,
    phoneno, cellno, email, officecode, departmentcode, designationcode, emptypecode, categorycode, gradecode, empstatuscode) {
      
      var existingCnic=this.emplist.filter(f=>f.cnic===cnic && f.empcode != this.empcode);

      var firstname=this.firstname.trim();
      var fathername=this.fathername.trim();
      var dateofbirth=$("#dob").val();   
      var joiningdate=$("#joindt").val();
      var confirmdate=$("#confdt").val();
      if(existingCnic.length>0){
        swal("CNIC already exist");
        return;
      }
      if(dateofbirth=='' || dateofbirth.toString().length<10){
        swal("Date Of Birth Is Empty Or Invalid");
        return;
      }
      if(joiningdate=='' || joiningdate.toString().length<10){
        swal("Joining Date Is Empty Or Invalid");
        return;
      }
      if(confirmdate=='' || confirmdate.toString().length<10){
        swal("Confirmation Date Is Empty Or Invalid");
        return;
      }
      if( this.cnic!='' && this.cnic.length!=13){
        swal("CNIC is invalid");
        return;
      }
      if(this.cellno!='' && this.cellno.length!=11){
        swal("Cell No. is invalid");
        return;
      }
      if(this.phoneno!='' && this.phoneno.length!=11){
        swal("Phone No. is invalid");
        return;
      }
      var regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/; 
    if(!regex.test(email)){
      swal("Invalid Email Format");
      return;
    }
    if (firstname != '') {
      this.isLoading = true;
      console.log(emps);
      this.submitAdd='';
      this.permissionUtility.PermissionAdd='';
      //this.service.updateEmployee(emps).then(
      //  (response) => {
      //    this.getEmployees(); this.modalReference.close(); this.isLoading = false
      //  },
      //  (error) => console.log(error)) 
      if(fathername!=''){
        if(this.cnic!=''){
          if(this.cellno!=''){
            if(this.psline1!='' && this.pmline1!=''){
      if (this.fileToUpload != null) {
        if (emptypecode != 1) {//Contract Employee
          var emps = new Employee(this.empcode, firstname, middlename, lastname, fathername, cnic, gender, maritalstatus, eobi, gli, socialsecurity, birthplace, nationalcode, religion, remarks, this.correspond, psline1, psline2, psline3, pscitycode, pmline1, pmline2, pmline3, pmcitycode, phoneno, cellno, email, officecode, departmentcode, designationcode, emptypecode, categorycode, gradecode, empstatuscode, this.dob.getDateFinal(), this.joiningdate.getDateFinal(), this.conenddate.getDateFinal(), null, this.logedInUserID, '', this.UserSessionID);
        }
        else {//Regular Employee
          var emps = new Employee(this.empcode, firstname, middlename, lastname, fathername, cnic, gender, maritalstatus, eobi, gli, socialsecurity, birthplace, nationalcode, religion, remarks, this.correspond, psline1, psline2, psline3, pscitycode, pmline1, pmline2, pmline3, pmcitycode, phoneno, cellno, email, officecode, departmentcode, designationcode, emptypecode, categorycode, gradecode, empstatuscode, this.dob.getDateFinal(), this.joiningdate.getDateFinal(), null, this.confirmdate.getDateFinal(), this.logedInUserID, '', this.UserSessionID);
        } 
        this.ImageService.postFile('', this.fileToUpload).subscribe(
          data => {
            this.service.updateEmployee(emps).then(
              (response) => {
                this.getEmployees(''); this.modalReference.close(); this.isLoading = false
              },
              (error) => console.log(error)) 
          }
        );
      }
      else {
        if (emptypecode != 1) {//Contract Employee
          var emps = new Employee(this.empcode, firstname, middlename, lastname, fathername, cnic, gender, maritalstatus, eobi, gli, socialsecurity, birthplace, nationalcode, religion, remarks, this.correspond, psline1, psline2, psline3, pscitycode, pmline1, pmline2, pmline3, pmcitycode, phoneno, cellno, email, officecode, departmentcode, designationcode, emptypecode, categorycode, gradecode, empstatuscode, this.dob.getDateFinal(), this.joiningdate.getDateFinal(), this.conenddate.getDateFinal(), null, this.logedInUserID, '', this.UserSessionID);

        }
        else {//Regular Employee
          var emps = new Employee(this.empcode, firstname, middlename, lastname, fathername, cnic, gender, maritalstatus, eobi, gli, socialsecurity, birthplace, nationalcode, religion, remarks, this.correspond, psline1, psline2, psline3, pscitycode, pmline1, pmline2, pmline3, pmcitycode, phoneno, cellno, email, officecode, departmentcode, designationcode, emptypecode, categorycode, gradecode, empstatuscode, this.dob.getDateFinal(), this.joiningdate.getDateFinal(), null, this.confirmdate.getDateFinal(), this.logedInUserID, '', this.UserSessionID);
        } 
        this.service.updateEmployee(emps).then(
          (response) => {
            this.getEmployees(''); this.modalReference.close(); this.isLoading = false
          },
          (error) => console.log(error))
      } 
    }else
    swal("At Least Line 1 Of Both Address Is Required");
    this.isLoading=false;
    }else
    swal("Enter Cell No.");
    this.isLoading=false;
    }else
    swal("CNIC iS Required");
    this.isLoading=false;
    }else{
      if(this.fathername.replace(/\s/g,"").length<=0)
        this.fathername='';
      swal("Enter Father Name!");
      this.isLoading=false;
    } 
    }
    else {
      swal("Enter First Name!");
      this.isLoading=false;
    }
  }
  //getDetailsByID
  getDetailsByID(empcode, content) {
    this.mode = true;
    this.btnmode = false;
    this.imageUrl = "../../../../assets/images/user-thumbnail.png";
    this.service.getDetailsByID(empcode)
      .subscribe((o: Employee) => {

        if (o.empimage != null)
          this.imageUrl = o.empimage;





        this.empcode = o.emP_ID;
        this.firstname = o.firsT_NAME;
        this.middlename = o.middlE_NAME;
        this.lastname = o.lasT_NAME;
        this.fathername = o.fatheR_NAME;
        this.cnic = o.cnic;
        this.gender = o.gendeR_ID;
        this.maritalstatus = o.maritaL_STATUS_ID;
        this.eobi = o.eobI_NO;
        this.gli = o.glI_NO;
        this.socialsecurity = o.sociaL_SECURITY_NO;
        this.birthplace = o.birthplace;

        this.service.getNationality()
          .subscribe(response => {
            this.nationality = (response.json());
            this.nationalcode = o.countrY_ID;
          });

        this.religion = o.religion;
        this.remarks = o.remarks;
        this.correspond = o.correspondinG_ADDRESS;
        if (this.correspond != 1) {
          this.present = 0; this.permanent = 1;
        }
        else {
          this.present = 1; this.permanent = 0;
        }
        this.phoneno = o.phone;
        this.cellno = o.mobile;
        this.email = o.email;

        this.service.getOffice()
          .subscribe(response => {
            this.office = (response.json());
            this.officecode = o.officE_CODE;
          });

        this.service.getDepartment()
          .subscribe(response => {
            this.department = (response.json());
            this.departmentcode = o.departmenT_CODE;
            this.service.getDesignation(this.departmentcode)
              .subscribe(response => {
                this.designation = (response.json());
                this.designationcode = o.designatioN_CODE;
              });
          });
if(this.permissionUtility.PermissionView==''){
  this.submitAdd='none';
  this.submitUpdate='none';
}


        this.service.getEmploymentType()
          .subscribe(response => {
            this.emptype = (response.json());
            this.emptypecode = o.employmenT_TYPE_ID;
            this.ShowDates();
          });

        this.service.getCategory()
          .subscribe(response => {
            this.category = (response.json());
            this.categorycode = o.categorY_CODE;

          });

        this.service.getGrade()
          .subscribe(response => {
            this.grade = (response.json());
            this.gradecode = o.gradE_ID;
          });

        this.empstatuscode = o.joB_STATUS_ID;
        this.dob.setDate(o.dob);
        this.joiningdate.setDate(o.joininG_DATE);
        this.conenddate.setDate(o.contracT_END_DATE);
        this.confirmdate.setDate(o.confirmatioN_DATE);

        this.getAddressPresentByID(this.empcode);
        this.getAddressPermanentByID(this.empcode);
        this.openDetail(content);
      });
  }
  //getAddressPresentByID
  getAddressPresentByID(customer_ID) {
    this.isLoading = true;
    this.service.getAddressPresentByID(customer_ID)
      .subscribe(response => {
        this.psaddress = (response.json());
        this.psline1 = this.psaddress[0].line1;
        this.psline2 = this.psaddress[0].line2;
        this.psline3 = this.psaddress[0].line3;
        this.service.getCity()
          .subscribe(response => {
            this.pscity = this.getDropdownList(response.json(), "citycode", "cityname");
            this.pscitymodel = this.psaddress[0].citY_CODE;
            this.getPresentRegion(this.pscitymodel);
          });

        this.isLoading = false;
      });
  }
  //getAddressPermanentByID
  getAddressPermanentByID(customer_ID) {
    this.isLoading = true;
    this.service.getAddressPermanentByID(customer_ID)
      .subscribe(response => {
        this.pmaddress = (response.json());
        this.pmline1 = this.pmaddress[0].line1;
        this.pmline2 = this.pmaddress[0].line2;
        this.pmline3 = this.pmaddress[0].line3;

        this.service.getCity()
          .subscribe(response => {
            this.pmcity = this.getDropdownList(response.json(), "citycode", "cityname");
            this.pmcitymodel = this.pmaddress[0].citY_CODE;
            this.getPermanentRegion(this.pmcitymodel);
          });

        this.isLoading = false;
      });
  }
  //open
  open(content) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    // console.log(ngbModalOptions);
    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    // this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.clearFields();

  }
  //openDetail modal
  openDetail(content) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    // console.log(ngbModalOptions);
    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    // this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);
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
  changePS() {
    this.present = 1;
    this.permanent = 0;
    this.correspond = 1;
  }
  changePM() {
    this.present = 0;
    this.permanent = 1;
    this.correspond = 2;
  }
  //getEmpStatus
  getEmpStatus(d): any {
    let Res = '';
    if (d != null) {
      switch (d) {
        case 1:
          Res = "Active";
          break;
        case 2:
          Res = "InActive";
          break;

        default:
      }

    }
    return Res;

  }
  ShowDates() {
    if (this.emptypecode != 1) {
      this.showcontractdate = '';
      this.showconfirmdate = 'none';
      this.confirmdate = new cDate();
    }
    else {
      this.showconfirmdate = '';
      this.showcontractdate = 'none';
      this.conenddate = new cDate();
    }
  }
  //EmployeeImagePreview
  handleFileInput(file: FileList) {

    this.fileToUpload = file.item(0);
    console.log('-------------------------' + this.fileToUpload);
    //Show image preview
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);

  }

}
