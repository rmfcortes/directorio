import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListaPasillosPage } from './lista-pasillos.page';

const routes: Routes = [
  {
    path: '',
    component: ListaPasillosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListaPasillosPage]
})
export class ListaPasillosPageModule {}
