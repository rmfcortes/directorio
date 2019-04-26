import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { OfertasPage } from './ofertas.page';

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
  declarations: [OfertasPage],
})
export class OfertasPageModule {}
