import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { OfertasPage } from './ofertas.page';
import { FichaOfertaPage } from '../ficha-oferta/ficha-oferta.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: OfertasPage
      }
    ])
  ],
  declarations: [OfertasPage, FichaOfertaPage],
  entryComponents: [FichaOfertaPage]
})
export class OfertasPageModule {}
