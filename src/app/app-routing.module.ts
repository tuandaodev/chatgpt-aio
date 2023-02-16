import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './content/content.component';
import { OptionsComponent } from './options/options.component';
import { PopupComponent } from './popup/popup.component';

const routes: Routes = [
  {
    path: '',
      redirectTo: 'content',
      pathMatch: 'full',
  },
  {
    path: 'content',
    component: ContentComponent
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

const config: ExtraOptions = {
  useHash: true,
};
@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
