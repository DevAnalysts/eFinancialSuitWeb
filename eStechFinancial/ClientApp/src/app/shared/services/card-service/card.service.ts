import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Injectable } from '@angular/core';

@Injectable()
export class CardService {
 url='api/Login/getUserDashboardCards';
  constructor(private httpRepository: RepositoryHttpService) { }
   getCards(logedInUserID,cardType) {
     return this.httpRepository.getData(this.url + '?logedInUserID='+ logedInUserID + '&cardType=' + cardType);
   }
}
