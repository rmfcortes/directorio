import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { OfertasPage } from './ofertas.page';
import { FormsModule } from '@angular/forms';
import { FichaOfertaPageModule } from './ficha-oferta/ficha-oferta.module';
import { FichaNegocioPageModule } from '../negocios/ficha-negocio/ficha-negocio.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    FichaOfertaPageModule,
    FichaNegocioPageModule,
  ],
  declarations: [OfertasPage],
  entryComponents: [OfertasPage]
})
export class OfertasPageModule {}
