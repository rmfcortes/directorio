import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FichaOfertaPage } from './ficha-oferta.page';

const routes: Routes = [
  {
    path: '',
    component: FichaOfertaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FichaOfertaPage]
})
export class FichaOfertaPageModule {}
