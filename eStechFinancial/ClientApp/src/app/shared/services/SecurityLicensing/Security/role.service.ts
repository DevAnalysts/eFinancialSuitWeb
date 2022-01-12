
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { Roles } from '../../../../shared';

@Injectable()
export class RoleService {

  URL = 'api/Role';
   
   constructor(private httpRepository: RepositoryHttpService) { }

  //getRoles
  getRoles() {
    return this.httpRepository.getData(this.URL + "/getRoles")
  }
  //getDesignation
  getDesignation() {
    return this.httpRepository.getData(this.URL + "/getDesignation")
  }
  //getModule
  getModule() {
    return this.httpRepository.getData(this.URL + "/getModule")
  }
  //getSubModule
  getSubModule(moduleid:any){
    return this.httpRepository.getData(this.URL + "/getSubModule?moduleid=" + moduleid)
  }
//getModulePages
  getModulePages(moduleid: any) {
    return this.httpRepository.getData(this.URL + "/getModulePages?moduleid=" + moduleid)
  }
  //getSubModulePages
  getSubModulePages(submoduleid: any) {
    return this.httpRepository.getData(this.URL + "/getSubModulePages?submoduleid=" + submoduleid)
  }

  //saveModulePages
  saveModulePages(modulePages: any): Promise<any> {
    let body = JSON.stringify(modulePages);
   console.log(modulePages);
   return this.httpRepository.create(this.URL+ "/saveModulePages", modulePages )
      .toPromise()
      .then(res => res.json() as any)
      .catch()
  }
  //saveSubModulePages
  saveSubModulePages(subModulePages: any): Promise<any>{
    let body = JSON.stringify(subModulePages);
    console.log(subModulePages);
    return this.httpRepository.create(this.URL+ "/saveSubModulePages", subModulePages )
    .toPromise()
    .then(res => res.json() as any)
    .catch()

  }
  //getRolesPermission
  getRolesPermission(moduleid: any) {
    return this.httpRepository.getData(this.URL + "/getRolesPermission?moduleid=" + moduleid)
  }
  //getRolePermissionByID
  getRolePermissionByID(ID: any) {
    return this.httpRepository.getData(this.URL + "/getRolePermissionByID?ID=" + ID)
  }
  //saveRole
  saveRole(role: any): Promise<any> {
    let body = JSON.stringify(role);
  //alert(body);
   return this.httpRepository.create(this.URL, role )
      .toPromise()
      .then(res => res.json() as Roles)
      .catch()
  }
  //deleteUnCheckedRow(role: any): Promise<any> {
  //  let body = JSON.stringify(role);
  //  //alert(body);
  //  return this.httpRepository.update(this.URL, role )
  //    .toPromise()
  //    .then(res => res.json() as Roles)
  //    .catch()
  //}

  deleteUnCheckedRow(role: any): Promise<any> {
    let body = JSON.stringify(role);
    //alert(body);
    return this.httpRepository.update(this.URL, role )
      .toPromise()
      .then(res => res.json() as Roles)
      .catch()
  }


  //getRoleByID
  getRoleByID(ROLE_ID: Number): Observable<Roles> {
    return this.httpRepository.getData(this.URL + "/getRoleByID?ROLE_ID=" + ROLE_ID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //
  getRoleByIDModuleWise(TREE_NODE_CODE: Number,ROLE_ID: Number): Observable<Roles> {
    return this.httpRepository.getData(this.URL + "/getRoleByID?TREE_NODE_CODE=" + TREE_NODE_CODE +"&ROLE_ID=" + ROLE_ID + "")
      .map((res) => {
        console.log(TREE_NODE_CODE);
        return res.json()[0];
        
      })
      .catch(this.handleError);
  }
  //updateRole
  updateRole(role: any): Promise<any> {
    let body = JSON.stringify(role);
    // alert(body);
    return this.httpRepository.update(this.URL, role )
      .toPromise()
      .then(res => res.json() as Roles)
      .catch()
  }
  updateRoleAgain(role: any): Promise<any> {
    let body = JSON.stringify(role);
    // alert(body);
    return this.httpRepository.update(this.URL, role )
      .toPromise()
      .then(res => res.json() as Roles)
      .catch()
  }


  getSession(value: any): string {
    if (typeof (Storage) !== 'undefined') {

      if (sessionStorage.getItem(value)) {
        return sessionStorage.getItem(value);
      }

      return 'undefined';
    }
  }
  //handleError
  private handleError(error: any) {
    var applicationError = error.headers.get('Application-Error');
    var serverError = error.json();
    var modelStateErrors: string = '';

    if (!serverError.type) {
      console.log(serverError);
      for (var key in serverError) {
        if (serverError[key])
          modelStateErrors += serverError[key] + '\n';
      }
    }
    modelStateErrors = modelStateErrors = '' ? null : modelStateErrors;
    return Observable.throw(applicationError || modelStateErrors || 'Server error');
  }

}
