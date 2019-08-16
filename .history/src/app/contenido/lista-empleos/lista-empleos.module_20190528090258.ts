import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListaEmpleosPage } from './lista-empleos.page';

const routes: Routes = [
  {
    path: '',
    component: ListaEmpleosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListaEmpleosPage]
})
export class ListaEmpleosPageModule {}
