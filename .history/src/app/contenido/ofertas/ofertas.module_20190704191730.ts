import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { OfertasPage } from './ofertas.page';
import { FormsModule } from '@angular/forms';
import { FichaOfertaPageModule } from './ficha-oferta/ficha-oferta.module';
import { LoginPageModule } from '../login/login.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    FichaOfertaPageModule,
    LoginPageModule,
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
