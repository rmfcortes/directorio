import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FichaBazarPage } from './ficha-bazar.page';

import { CallNumber } from '@ionic-native/call-number/ngx';
import { MapaPageModule } from '../../mapa/mapa.module';
import { LoginPageModule } from '../../../login/login.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapaPageModule,
    LoginPageModule
  ],
  declarations: [FichaBazarPage],
  entryComponents: [FichaBazarPage],
  providers: [CallNumber],
})
export class FichaBazarPageModule {}
