import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { OfertasPage } from './ofertas.page';
import { FichaOfertaPageModule } from '../ficha-oferta/ficha-oferta.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FichaOfertaPageModule,
    RouterModule.forChild([
      {
        path: '',
        component: OfertasPage
      }
    ])
  ],
  declarations: [OfertasPage],
})
export class OfertasPageModule {}
