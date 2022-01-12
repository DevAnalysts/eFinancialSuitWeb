import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';

@Injectable()
export class MenuService {

  URL = 'api/Menu';
  
  constructor(private httpRepository: RepositoryHttpService) { }
  //getHeaders
  getHeaders(logedInUserID: any) {
    return this.httpRepository.getData(this.URL + "/getHeaders?logedInUserID=" + logedInUserID + "")
  }
  //getSubHeaders
  getSubHeaders(logedInUserID: any) {
    return this.httpRepository.getData(this.URL + "/getSubHeaders?logedInUserID=" + logedInUserID + "")
  }
  //getUserPriviligedFiles
  getUserPriviligedFiles(logedInUserID: any) {
    return this.httpRepository.getData(this.URL + "/getUserPriviligedFiles?logedInUserID=" + logedInUserID + "")
  }
  //getPageDetail
  getPageDetail(page_ID: any) {
    return this.httpRepository.getData(this.URL + "/getPageDetail?page_ID=" + page_ID + "")
  }
}
