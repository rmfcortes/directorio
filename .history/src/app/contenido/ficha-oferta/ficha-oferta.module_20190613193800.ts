import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FichaOfertaPage } from './ficha-oferta.page';

import { CallNumber } from '@ionic-native/call-number/ngx';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';

const routes: Routes = [
  {
    path: '',
    component: FichaOfertaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FichaOfertaPage],
  providers: [CallNumber, SpinnerDialog],
})
export class FichaOfertaPageModule {}
