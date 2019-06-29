import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { IonicRatingModule } from 'ionic4-rating';

import { FichaNegocioPage } from './ficha-negocio.page';

import { AgmCoreModule } from '@agm/core';
import { CallNumber } from '@ionic-native/call-number/ngx';

import { ScrollVanishDirective } from 'src/app/directives/scroll-vanish.directive';

import { InfoSucursalModalPageModule } from '../info-sucursal-modal/info-sucursal-modal.module';
import { CartComponentModule } from 'src/app/shared/cart/cart.module';
import { LoginPageModule } from '../login/login.module';
import { CalificarPageModule } from '../calificar/calificar.module';

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
    CartComponentModule,
    LoginPageModule,
    CalificarPageModule,
    IonicRatingModule,
    InfoSucursalModalPageModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD2bkQuBBHIVNcwmzQRFG6sIdx4WNWGL_0'
    }),
    RouterModule.forChild(routes)
  ],
  declarations: [FichaNegocioPage, ScrollVanishDirective],
  providers: [DatePipe, CallNumber],
})
export class FichaNegocioPageModule {}
