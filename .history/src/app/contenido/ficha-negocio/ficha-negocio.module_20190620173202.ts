import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { IonicRatingModule } from 'ionic4-rating';

import { FichaNegocioPage } from './ficha-negocio.page';

import { AgmCoreModule } from '@agm/core';
import { CallNumber } from '@ionic-native/call-number/ngx';

import { InfoSucursalModalPageModule } from '../info-sucursal-modal/info-sucursal-modal.module';

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
    InfoSucursalModalPageModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD2bkQuBBHIVNcwmzQRFG6sIdx4WNWGL_0'
    }),
    RouterModule.forChild(routes)
  ],
  declarations: [FichaNegocioPage],
  providers: [DatePipe, CallNumber],
})
export class FichaNegocioPageModule {}
