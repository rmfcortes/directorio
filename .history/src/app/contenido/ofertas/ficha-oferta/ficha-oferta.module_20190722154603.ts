import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FichaOfertaPage } from './ficha-oferta.page';

import { CallNumber } from '@ionic-native/call-number/ngx';
import { MapaPageModule } from '../../mapa/mapa.module';
import { FichaNegocioPageModule } from '../../negocios/ficha-negocio/ficha-negocio.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FichaNegocioPageModule,
    MapaPageModule
  ],
  declarations: [FichaOfertaPage],
  providers: [CallNumber],
  entryComponents: [FichaOfertaPage]
})
export class FichaOfertaPageModule {}
