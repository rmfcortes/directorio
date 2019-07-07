import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NegociosPage } from './negocios.page';

import { IonicImageLoader } from 'ionic-image-loader';
import { FichaNegocioPageModule } from './ficha-negocio/ficha-negocio.module';

const routes: Routes = [
  {
    path: '',
    component: NegociosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicImageLoader,
    FichaNegocioPageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NegociosPage]
})
export class NegociosPageModule {}
