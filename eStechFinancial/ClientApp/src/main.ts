import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

///////////////////////// Pl Set Production Variable in environmnet and env.service ///////////
if (environment.production)
{  
  console.log('Production mode enabled !!!');
  //enableProdMode();
  //if (window) {
  //  window.console.log = () => { };
  //}
}
else {
  console.log('Debug mode enabled !!!');
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
