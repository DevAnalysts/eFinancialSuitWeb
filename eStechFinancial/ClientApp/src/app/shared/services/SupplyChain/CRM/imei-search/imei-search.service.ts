import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
 
@Injectable()
export class IMEISearchService {

  URL = 'api/IMEISearch'; 

  constructor(private httpRepository: RepositoryHttpService) { }

 
     //searchIMEI
  searchIMEI(imeino: any) {
    return this.httpRepository.getData(this.URL + "/searchIMEI?imeino=" + imeino)
  }  


}
