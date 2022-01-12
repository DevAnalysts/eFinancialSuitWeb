import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ImgUploadService, ImgUpload } from '../../../shared';
import swal from 'sweetalert';

import { log } from 'util';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { Response } from '@angular/http/src/static_response';


@Component({
  selector: 'imgupload',
  templateUrl: './imgupload.component.html',
  styleUrls: ['./imgupload.component.scss']
})
export class ImgUploadComponent implements OnInit {
  ////Member Variables
  p: number = 1;
  Itemsname: any = "";
  active: any = 0;
  edit: any[] = [];
 
  

  category: any[] = [];
  item: any[] = [];
  adV_TYPE_CODE: any = 0;
  adV_AMOUNT: any = '';
  nO_OF_INSTALLMENT: any = '';
  installmenT_AMOUNT: any = '';
  remarkS: any = 0;


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

  imageUrl: string = "/assets/img/default-image.png";
  fileToUpload: File = null;
  @ViewChild("Image") fileInput;

  constructor(private imageService: ImgUploadService) { }

  ngOnInit() {
 
    this.logedInUserID = this.imageService.getSession('user_ID');
  }

  //-------File Methods-----
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);

    //Show image preview
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
  }

  OnSubmit(Caption, Image) {
    let fi = this.fileInput.nativeElement;
    if (fi.files && fi.files[0]) {
      let fileToUpload = fi.files[0];
      this.imageService.postFile(Caption.value, this.fileToUpload).subscribe(
        data => {
          console.log('done');
          Caption.value = null;
          Image.value = null;
          this.imageUrl = "/assets/img/default-image.png";
        }
      );
    }

   
  }
  //<<--------------->>







  Add() {

    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    this.ShowEmp1 = '';
    this.adV_AMOUNT = '';
  }
  Edit() {
    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    this.ShowEmp2 = ''
  }
  Cancel() {

    this.card1style = 'card col-sm-12'
    this.addbutton = '';
    this.card2display = 'none'; 1
    this.ShowEmp1 = 'none'
    this.ShowEmp2 = 'none'
  }

}










