import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { RecipeCard } from '../../../../../shared';


@Injectable()
export class RecipeCardService {
  URL = 'api/RecipeCard';
   
   constructor(private httpRepository: RepositoryHttpService) { }
  //getRecipeCard
  getRecipeCard(ID) {
    return this.httpRepository.getData(this.URL + "/getRecipeCard?ID=" + ID + "")
  }
  //searchOrderDetails
  searchOrderDetails(RC_ID: any) {
    return this.httpRepository.getData(this.URL + "/searchOrderDetails?RC_ID=" + RC_ID + "")
  }
  //getItem
  getItem(mode: any, item_Code: any) {
    return this.httpRepository.getData(this.URL + "/getItem?mode=" + mode + "&item_Code=" + item_Code + "")
  }
  //getItems
  getItems() {
    return this.httpRepository.getData(this.URL + "/getItems")
  }
  //getUnitPrice
  getUnitPrice(item_ID: Number) {
    return this.httpRepository.getData(this.URL + "/getUnitPrice?item_ID=" + item_ID + "")
  }
  //IfExists
  IfExists(item_ID: any) {
    return this.httpRepository.getData(this.URL + "/IfExists?item_ID=" + item_ID + "")
  }
  //getDetailsByID
  getDetailsByID(RC_ID: Number): Observable<RecipeCard> {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?RC_ID=" + RC_ID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //saveRecipe
  saveRecipe(recipe: any): Promise<any> {
    let body = JSON.stringify(recipe);
    // alert(body);
   return this.httpRepository.create(this.URL, recipe )
      .toPromise()
      .then(res => res.json() as RecipeCard)
      .catch()
  }
  //updateRecipe
  updateRecipe(recipe: any): Promise<any> {
    let body = JSON.stringify(recipe);
    // alert(body);
    return this.httpRepository.update(this.URL, recipe )
      .toPromise()
      .then(res => res.json() as RecipeCard)
      .catch()
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
