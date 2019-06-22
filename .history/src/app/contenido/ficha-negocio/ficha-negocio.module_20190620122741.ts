import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { IonicRatingModule } from 'ionic4-rating';

import { FichaNegocioPage } from './ficha-negocio.page';

import { AgmCoreModule } from '@agm/core';
import { CallNumber } from '@ionic-native/call-number/ngx';

import { ScrollVanishDirective } from '../../directives/scroll-vanish.directive';
import { InfoSucursalModalPage } from '../info-sucursal-modal/info-sucursal-modal.page';

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
    InfoSucursalModalPage,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD2bkQuBBHIVNcwmzQRFG6sIdx4WNWGL_0'
    }),
    RouterModule.forChild(routes)
  ],
  declarations: [FichaNegocioPage, ScrollVanishDirective],
  providers: [DatePipe, CallNumber],
})
export class FichaNegocioPageModule {}
