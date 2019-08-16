import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FichaBazarPage } from './ficha-bazar.page';

import { CallNumber } from '@ionic-native/call-number/ngx';

const routes: Routes = [
  {
    path: '',
    component: FichaBazarPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FichaBazarPage],
  providers: [CallNumber],
})
export class FichaBazarPageModule {}
