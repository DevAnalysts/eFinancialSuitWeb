import { cDate } from "@shared/directives/custom-date";

export class Validation {
    event:any=KeyboardEvent;
    firsT_NAME:any; 
    public date:cDate = new cDate();
    public dob = new cDate();
     
    
    onlyAlphabet(event:KeyboardEvent){
        var ch=String.fromCharCode(event.which); 
        if(!(/[a-zA-Z()_@' ]/).test(ch)){
            event.preventDefault();
        }
      }
      onlyNumber(event:KeyboardEvent){
        var ch=String.fromCharCode(event.which); 
        if(!(/[0-9]/).test(ch)){
          event.preventDefault(); 
        } 
      }
      onlyAlphaNumeric(event:KeyboardEvent){
        var ch=String.fromCharCode(event.which); 
        if(!(/[a-zA-Z0-9()_' ]/).test(ch)){
            event.preventDefault();
        }
      }
      //two decimal places
      onKeyPressBlockNumbers(event)
  {
      
    let dec = event.target.value.indexOf(".")
    let tooLong = event.target.value.length > dec + 3
    let invalidNum = isNaN(parseFloat(event.target.value))
 
    if ((dec >= 0 && tooLong) || invalidNum) {
      event.target.value = event.target.value.slice(0, -1)
    }
      

  }

  pparseFloat(v){
    return parseFloat(v);  
  }
      MaskedDate(event: any) {
        if(event.key!="Backspace" || event.key!="Delete"){
        var v = event.target.value;
        if (v.match(/^\d{2}$/) !== null) {
          if(v>31)
          {v=31;}
          event.target.value = v + '/'; 
        } else if (v.match(/^\d{2}\/\d{2}$/) !== null) {
          var m = v.toString().slice(3);   
          if(m>12){
            m=12;
            v=v.toString().slice(0,2); 
            event.target.value = v + '/' + m + '/';
          }else
          event.target.value =  v + '/';
        }
      }
    }
     
}