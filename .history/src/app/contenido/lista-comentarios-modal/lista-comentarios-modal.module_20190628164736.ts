import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListaComentariosModalPage } from './lista-comentarios-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ListaComentariosModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListaComentariosModalPage]
})
export class ListaComentariosModalPageModule {}
