import { Observable, throwError } from 'rxjs'
import swal from 'sweetalert';

export function sendWhatsappMessage(CustomerCell, message) {
  let apilink = 'http://';
  apilink = 'http://web.whatsapp.com/send?phone=' + CustomerCell + '&text=' + encodeURI(message);
  window.open(apilink, "_blank");
}
export class CommonUtility {

  public handleError(error) {
    let errorMessage = '';
    if (error instanceof ErrorEvent) {
      // client-side error   
      errorMessage = `Error Message: ${error.error.message}`;
    } else {
      //server-side error response codes such as 400, 404, 500 etc.		
      errorMessage = `Error Message:  ${error.statusText} (${error.status})\nPlease contact to support team.`;
    }
    swal({ text: errorMessage, icon: "error" })
    return throwError(errorMessage);
  }

}