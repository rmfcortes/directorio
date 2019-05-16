import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { IonicRatingModule } from 'ionic4-rating';

import { FichaNegocioPage } from './ficha-negocio.page';

import { GoogleMaps } from '@ionic-native/google-maps';
import { CallNumber } from '@ionic-native/call-number/ngx';

const routes: Routes = [
  {
    path: '',
    component: FichaNegocioPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicRatingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FichaNegocioPage],
  providers: [DatePipe, GoogleMaps, CallNumber]
})
export class FichaNegocioPageModule {}
