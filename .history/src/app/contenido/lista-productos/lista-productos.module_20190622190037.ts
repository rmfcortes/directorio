import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListaProductosPage } from './lista-productos.page';
import { CartComponentModule } from 'src/app/shared/cart/cart.module';

const routes: Routes = [
  {
    path: '',
    component: ListaProductosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    CartComponentModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListaProductosPage]
})
export class ListaProductosPageModule {}
