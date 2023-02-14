import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OptionsComponent } from './options/options.component';
import { PopupComponent } from './popup/popup.component';

const routes: Routes = [
  {
    path: '',
      redirectTo: 'popup',
      pathMatch: 'full',
  },
  {
    path: 'popup',
    component: PopupComponent
  },
  {
    path: 'options',
    component: OptionsComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
