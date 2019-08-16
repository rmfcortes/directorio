import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { LottieAnimationViewModule } from 'ng-lottie';

import { IonicModule } from '@ionic/angular';

import { FavoritosPage } from './favoritos.page';
import { FichaNegocioPageModule } from '../negocios/ficha-negocio/ficha-negocio.module';
import { FichaOfertaPageModule } from '../ofertas/ficha-oferta/ficha-oferta.module';

const routes: Routes = [
  {
    path: '',
    component: FavoritosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LottieAnimationViewModule,
    FichaNegocioPageModule,
    FichaOfertaPageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FavoritosPage]
})
export class FavoritosPageModule {}
